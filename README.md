# Solitaire Game

Kimi Agent Versão similar do Solitaire - A React + TypeScript + Vite application with Docker support.

## Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Docker

**Build and run locally:**
```bash
docker compose up -d
```

Access at: http://localhost:8080

**Stop:**
```bash
docker compose down
```

## Project Structure

- `src/` - React components and hooks
- `dist/` - Built application
- `Dockerfile` - Multi-stage Docker build
- `docker-compose.yml` - Local development
- `docker-compose.prod.yml` - Production Compose
- `docker-compose.swarm.yml` - Docker Swarm deployment
- `k8s-deployment.yaml` - Kubernetes manifests

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Deployment

See [DEPLOYMENT_PIPELINE.md](DEPLOYMENT_PIPELINE.md) for CI/CD setup and deployment options.
