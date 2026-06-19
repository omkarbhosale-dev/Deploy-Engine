'use client';

import { useState, useEffect } from 'react';

interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  liveLink: string | null; // <-- Added liveLink field
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    memoryLimit: number;
  };
}

export default function Dashboard() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [newImage, setNewImage] = useState('');
  const [newName, setNewName] = useState('');
  const [internalPort, setInternalPort] = useState('80');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api/containers';

  const fetchContainers = async () => {
    try {
      const res = await fetch(`${API_URL}/monitor`);
      const data = await res.json();
      setContainers(data);
    } catch (error) {
      console.error('Failed to fetch containers:', error);
    }
  };

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: newImage, 
          name: newName, 
          internalPort: parseInt(internalPort) 
        }),
      });
      
      if (res.ok) {
        setNewImage('');
        setNewName('');
        setInternalPort('80');
        await fetchContainers();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error('Deployment failed:', error);
    }
    setLoading(false);
  };

  const handleStop = async (id: string, forceKill: boolean) => {
    try {
      await fetch(`${API_URL}/${id}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceKill }),
      });
      fetchContainers();
    } catch (error) {
      console.error('Failed to stop container:', error);
    }
  };

  const formatMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Deployment Engine</h1>
          <p className="text-gray-500">Manage and monitor your containerized applications with live endpoints.</p>
        </header>

        {/* Deploy New Image Form */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Deploy New Service</h2>
          <form onSubmit={handleDeploy} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Docker Image</label>
              <input 
                type="text" 
                placeholder="e.g., nginx:alpine" 
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Container Name</label>
              <input 
                type="text" 
                placeholder="e.g., prod-web" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Port</label>
              <input 
                type="number" 
                placeholder="80" 
                value={internalPort}
                onChange={(e) => setInternalPort(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 h-[46px]"
            >
              {loading ? 'Deploying...' : 'Deploy'}
            </button>
          </form>
        </section>

        {/* Active Containers */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Active Containers</h2>
          <div className="grid gap-4">
            {containers.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">No containers running.</p>
            ) : (
              containers.map((container) => (
                <div key={container.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{container.name}</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        {container.state}
                      </span>
                      {container.liveLink && (
                        <a 
                          href={container.liveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full hover:bg-blue-100 transition"
                        >
                          Live Link ↗
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Image: {container.image} • {container.status}</p>
                    
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Memory: {formatMB(container.metrics?.memoryUsage || 0)} MB / {formatMB(container.metrics?.memoryLimit || 0)} MB</span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => handleStop(container.id, true)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  );
}