# Deployment Pipeline Configuration

This deployment pipeline automates building, testing, and deploying your app to production.

## Files Included

1. **.github/workflows/ci-cd.yml** - GitHub Actions workflow
   - Lints and tests on every push and PR
   - Builds Docker image on main branch or version tags
   - Pushes to Docker Hub
   - Deploys to Docker Swarm or Kubernetes

2. **docker-compose.prod.yml** - Production Docker Compose config
   - Used for single-host production deployments
   - Resource limits and health checks configured

3. **docker-compose.swarm.yml** - Docker Swarm config
   - Multi-replica deployment
   - Overlay networking
   - Restart policies and constraints

4. **k8s-deployment.yaml** - Kubernetes manifests
   - Deployment with 3 replicas
   - Service for load balancing
   - Resource requests/limits, probes, security context

## Setup Instructions

### Prerequisites
- GitHub repository
- Docker Hub account (or private registry)
- SSH access to Swarm/K8s cluster

## GitHub Secrets Configuration

Set this in your GitHub repository settings:

- `SSH_PRIVATE_KEY` - Your SSH private key (used for GitHub, Docker registry, and deployment)
- `DEPLOY_HOST` - Swarm manager hostname/IP (only if using Swarm)
- `DEPLOY_USER` - SSH username for Swarm/deployment host (only if using Swarm)
- `K8S_HOST` - Kubernetes master hostname/IP (only if using Kubernetes)
- `K8S_USER` - SSH username for Kubernetes host (only if using Kubernetes)

### Environment Variables

Create `.env` file for Docker Compose deployments:

```bash
DOCKER_REGISTRY=docker.io
IMAGE_NAME=your-username/my-app
IMAGE_TAG=latest
VERSION=1.0.0
```

## Deployment Options

### Option 1: Docker Compose (Single Host)
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Option 2: Docker Swarm (Multi-Host)
```bash
docker stack deploy -c docker-compose.swarm.yml my-app
```

### Option 3: Kubernetes
```bash
kubectl apply -f k8s-deployment.yaml
```

## Workflow Triggers

- **Lint & Test**: Every push to any branch and all PRs
- **Build & Push**: Pushes to `main` branch or version tags (v*)
- **Deploy to Swarm**: After successful build, push to `main` only
- **Deploy to Kubernetes**: After successful build, push to `main` only

## Versioning

Use semantic versioning for releases:
```bash
git tag v1.0.0
git push origin v1.0.0
```

This automatically builds and tags Docker image as:
- `your-registry/my-app:v1.0.0`
- `your-registry/my-app:1.0`
- `your-registry/my-app:latest` (if main branch)

## Monitoring Deployments

**Docker Swarm:**
```bash
docker service ls
docker service logs my-app-service
docker service ps my-app-service
```

**Kubernetes:**
```bash
kubectl get deployment
kubectl get pods
kubectl logs -f deployment/my-app-deployment
kubectl describe deployment my-app-deployment
```

## Security Considerations

- SSH keys and credentials stored as GitHub Secrets
- Docker images cached in GitHub Actions for faster builds
- Non-root user in Kubernetes deployment
- Resource limits enforced
- Health checks configured on all deployments
