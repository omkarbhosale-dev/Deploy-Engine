import express from 'express';
import Docker from 'dockerode';
import cors from 'cors';

const app = express();
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());

const docker = new Docker();


// 1. RUN AN IMAGE WITH DYNAMIC PORT MAPPING
// ==========================================
app.post('/api/containers/run', async (req, res) => {
    const { image, name, cmd, internalPort } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'Image name is required' });
    }

    
    const containerPort = internalPort ? `${internalPort}/tcp` : '80/tcp';

    try {
        console.log(`Pulling image: ${image}...`);
        await new Promise((resolve, reject) => {
            docker.pull(image, (err, stream) => {
                if (err) return reject(err);
                docker.modem.followProgress(stream, (err, output) => err ? reject(err) : resolve(output));
            });
        });

        // Configure container with Port Bindings
        const containerParams = {
            Image: image,
            Tty: false,
            ExposedPorts: {
                [containerPort]: {}
            },
            HostConfig: {
                PortBindings: {
                    
                    [containerPort]: [{ HostPort: "" }] 
                }
            }
        };
        
        if (cmd) containerParams.Cmd = cmd;
        if (name) containerParams.name = name;

        const container = await docker.createContainer(containerParams);
        await container.start();

        
        const inspectData = await container.inspect();
        const bindings = inspectData.NetworkSettings.Ports[containerPort];
        const assignedHostPort = bindings && bindings[0] ? bindings[0].HostPort : null;

        res.status(201).json({
            message: 'Container started successfully',
            containerId: container.id,
            liveLink: assignedHostPort ? `http://localhost:${assignedHostPort}` : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. MONITOR CONTAINERS
// ==========================================
app.get('/api/containers/monitor', async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: false });
        
        const monitorData = await Promise.all(containers.map(async (c) => {
            const container = docker.getContainer(c.Id);
            const stats = await container.stats({ stream: false });
            
            
            const webPort = c.Ports.find(p => p.PublicPort);
            const liveLink = webPort ? `http://localhost:${webPort.PublicPort}` : null;
            
            return {
                id: c.Id,
                name: c.Names[0].replace('/', ''),
                image: c.Image,
                state: c.State,
                status: c.Status,
                liveLink,
                metrics: {
                    cpuUsage: stats.cpu_stats.cpu_usage.total_usage,
                    memoryUsage: stats.memory_stats.usage,
                    memoryLimit: stats.memory_stats.limit
                }
            };
        }));

        res.status(200).json(monitorData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. STOP OR KILL A CONTAINER
// ==========================================
app.post('/api/containers/:id/stop', async (req, res) => {
    const { id } = req.params;
    const { forceKill } = req.body; // Pass true to kill, false to stop

    try {
        const container = docker.getContainer(id);
        
        if (forceKill) {
            // immediate termination
            await container.kill();
            res.status(200).json({ message: `Container ${id} killed forcefully.` });
        } else {
            // graceful shutdown
            await container.stop();
            res.status(200).json({ message: `Container ${id} stopped gracefully.` });
        }
    } catch (error) {
        // 304 means the container is already stopped
        if (error.statusCode === 304) {
            return res.status(400).json({ error: 'Container is already stopped.' });
        }
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Deployment Engine API is running on http://localhost:${PORT}`);
});