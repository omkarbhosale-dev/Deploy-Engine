# 🚀 Mini Deployment Engine

A custom Platform-as-a-Service (PaaS) deployment engine built with Node.js, Express, Dockerode, and Next.js. This application allows you to programmatically pull Docker images, spin up containers with dynamic port mapping, and monitor real-time resource usage from a modern web dashboard.

## ✨ Features

- **Deploy on the Fly:** Provide any Docker image tag (e.g., `nginx:alpine`) to instantly pull and run it.
- **Dynamic Port Mapping:** Automatically assigns random, conflict-free host ports to your containers, generating a direct "Live Link" to view your deployed applications.
- **Container Lifecycle Management:** Cleanly stop (SIGTERM) or forcefully kill (SIGKILL) processes directly from the UI.

## 🛠️ Tech Stack

**Backend (API)**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Dockerode](https://github.com/apocas/dockerode) (Docker Engine API wrapper)

**Frontend (Dashboard)**
- [Next.js 16 (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your host machine:
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine:** Must be installed and actively running, as the backend needs access to the local Docker socket.
- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- **npm** or **yarn**

## 📂 Project Structure

```text
deploy-engine/
├── server.js              # Express server & Dockerode API
├── package.json           # Backend dependencies
├── .gitignore             # Root gitignore
└── frontend/              # Next.js Application
    ├── app/               # App Router pages & layouts
    │   ├── page.tsx       # Main Dashboard UI
    │   └── layout.tsx     # Root layout 
    ├── tailwind.config.ts # Tailwind styling configuration
    ├── next.config.mjs    # Next.js config (Turbopack root setup)
    └── package.json       # Frontend dependencies

```

## 🚀 Getting Started
#### 1. Clone the repository
```Bash
git clone <your-repo-url>
cd deploy-engine
```

#### 2. Start the Backend API
Open a terminal in the root directory and install the backend dependencies.

```Bash
npm install
node server.js
```
The API will start running on `http://localhost:8080`.

#### 3. Start the Frontend Dashboard
Open a second terminal window, navigate to the frontend directory, and start the Next.js development server.

```Bash
cd frontend
npm install
npm run dev
```
The Dashboard will start running on `http://localhost:3000`.

#### 4. Deploy your first app
Open your browser to `http://localhost:3000`. In the "Deploy New Service" section, enter nginx:alpine and click Deploy. Once finished, click the Live Link ↗ to view your running server!