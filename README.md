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