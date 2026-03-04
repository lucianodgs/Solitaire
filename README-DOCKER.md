# Windows 3.11 Solitaire - Docker Setup

Este documento explica como executar o jogo Solitaire usando Docker.

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) (opcional, mas recomendado)

## Opção 1: Usando Docker Compose (Recomendado)

### 1. Construir e iniciar o container

```bash
docker-compose up -d
```

O jogo estará disponível em: **http://localhost:8080**

### 2. Parar o container

```bash
docker-compose down
```

### 3. Reconstruir após alterações

```bash
docker-compose up -d --build
```

---

## Opção 2: Usando Docker diretamente

### 1. Construir a imagem

```bash
docker build -t windows-solitaire .
```

### 2. Executar o container

```bash
docker run -d -p 8080:80 --name solitaire windows-solitaire
```

O jogo estará disponível em: **http://localhost:8080**

### 3. Parar e remover o container

```bash
docker stop solitaire
docker rm solitaire
```

---

## Comandos úteis

### Ver logs

```bash
# Docker Compose
docker-compose logs -f

# Docker direto
docker logs -f solitaire
```

### Verificar status

```bash
# Docker Compose
docker-compose ps

# Docker direto
docker ps
```

### Acessar o container

```bash
docker exec -it solitaire sh
```

---

## Estrutura dos arquivos Docker

```
.
├── Dockerfile          # Configuração multi-stage build
├── docker-compose.yml  # Orquestração do container
├── nginx.conf          # Configuração do Nginx
├── .dockerignore       # Arquivos ignorados no build
└── README-DOCKER.md    # Este arquivo
```

---

## Configuração

### Porta

Por padrão, o container expõe a porta **80** internamente. Você pode mapear para qualquer porta do host:

```bash
# Mapear para porta 3000
docker run -d -p 3000:80 --name solitaire windows-solitaire
```

Ou editar o `docker-compose.yml`:

```yaml
ports:
  - "3000:80"
```

### Variáveis de ambiente

O app não requer variáveis de ambiente, mas você pode adicionar se necessário:

```yaml
environment:
  - NODE_ENV=production
```

---

## Solução de problemas

### Porta já em uso

Se a porta 8080 estiver ocupada, altere no `docker-compose.yml` ou use outra porta:

```bash
docker run -d -p 8081:80 --name solitaire windows-solitaire
```

### Limpar build cache

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Remover todos os containers e imagens

```bash
docker-compose down --rmi all
```

---

## Performance

A imagem Docker usa:
- **Multi-stage build** para reduzir o tamanho final
- **Nginx Alpine** como servidor web leve
- **Gzip compression** para assets
- **Cache headers** para recursos estáticos

Tamanho típico da imagem: ~25-30MB
