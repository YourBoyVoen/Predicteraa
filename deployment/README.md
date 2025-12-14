# Predictive Maintenance System

A full-stack predictive maintenance application with AI-powered diagnostics.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Hapi.js + Node.js
- **ML Inference**: FastAPI + Python
- **Database**: PostgreSQL

## Prerequisites

- Docker
- Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

## Quick Start with Docker

1. **Clone the repositories**
   ```bash
   mkdir capstone-project && cd capstone-project
   
   # Clone backend repository
   git clone <backend-repo-url> hapi-capstone
   
   # Clone frontend repository
   git clone <frontend-repo-url> Predicteraa
   ```

2. **Configure environment variables (only in the deployment .env, not the .env.example for debug aka the ones in the repository roots)**
   ```bash
   # Copy the root .env.example (only this one is needed for Docker)
   cp .env.example .env
   
   # Edit .env with your configuration:
   # - Database credentials (POSTGRES_PASSWORD)
   # - JWT secrets (ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY)
   # - API keys (GEMINI_API_KEY, OPENROUTER_API_KEY)
   # - API URLs (VITE_API_BASE_URL, VITE_API_PORT)
   ```
   
   **Note:** You only need the root `.env` file for Docker deployment. Individual repository `.env` files (`hapi-capstone/.env` and `Predicteraa/.env`) are only needed for local development without Docker.

NOTE: Move the files in deployment folder to the directory that contains both repositories (in their folder form) then continue running commands in that directory

3. **Build and start all services**
   ```bash
   docker compose up -d --build
   ```

4. **Run database migrations and seeds**
   ```bash
   docker compose exec backend npm run migrate:latest
   docker compose exec backend npm run seed:run
   ```

5. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:9000
   - FastAPI Docs: http://localhost:8000/docs
   - Swagger UI: http://localhost:9000/documentation

## Docker Commands

### Start all services
```bash
docker compose up -d
```

### Stop all services
```bash
docker compose down
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f fastapi
```

### Rebuild services
```bash
# Rebuild all
docker compose up -d --build

# Rebuild specific service
docker compose up -d --build backend
```

### Database operations
```bash
# Run migrations
docker compose exec backend npm run migrate up

# Run seeds
docker compose exec backend npm run seed:run

# Fresh migration
docker compose exec backend npm run migrate:fresh
```

### Access service shell
```bash
# Backend shell
docker compose exec backend sh

# Database shell
docker compose exec postgres psql -U postgres -d predictive_maintenance
```

## Development Mode

For local development without Docker, you need to configure each repository's `.env` file:

1. **Configure local environment files**
   ```bash
   # Backend environment
   cd hapi-capstone
   cp .env.example .env
   # Edit hapi-capstone/.env with local settings
   
   # Frontend environment
   cd ../Predicteraa
   cp .env.example .env
   # Edit Predicteraa/.env with local settings
   ```

2. **Start PostgreSQL**
   ```bash
   docker compose up -d postgres
   ```

3. **Backend (hapi-capstone folder)**
   ```bash
   cd hapi-capstone
   npm install
   npm run migrate:latest
   npm run seed:run
   npm run dev
   ```

4. **FastAPI (hapi-capstone folder)**
   ```bash
   cd hapi-capstone
### Docker Deployment (Root `.env`)

For Docker deployment, only configure the root `.env` file with these key variables:

- `POSTGRES_USER`: Database user (default: postgres)
- `POSTGRES_PASSWORD`: Database password (**change this!**)
- `POSTGRES_DB`: Database name (default: predictive_maintenance)
- `ACCESS_TOKEN_KEY`: JWT access token secret (**change this!**)
- `REFRESH_TOKEN_KEY`: JWT refresh token secret (**change this!**)
- `ACCESS_TOKEN_AGE`: Token expiration in seconds (default: 3600)
- `VITE_API_BASE_URL`: API host for frontend (default: localhost)
- `VITE_API_PORT`: API port for frontend (default: 9000)
- `GEMINI_API_KEY`: Google Gemini API key (**required for AI agent**)
- `OPENROUTER_API_KEY`: OpenRouter API key (**required for AI agent**)
- `NODE_ENV`: Environment mode (default: production)

### Local Development

For local development, configure individual repository `.env` files:
- `hapi-capstone/.env`: Backend configuration (see `hapi-capstone/.env.example`)
- `Predicteraa/.env`: Frontend configuration (see `Predicteraa/.env.example`
   npm run dev
   ```

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `ACCESS_TOKEN_KEY`: JWT access token secret
- `REFRESH_TOKEN_KEY`: JWT refresh token secret
- `NODE_ENV`: Environment (development/production)

## API Documentation

- Swagger UI: http://localhost:9000/documentation
- FastAPI Docs: http://localhost:8000/docs

## Ports

- **Frontend**: 80
- **Backend**: 9000
- **FastAPI**: 8000
- **PostgreSQL**: 5432

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
netstat -ano | findstr :9000

# Stop the process or change port in docker compose.yml
```

### Database connection issues
```bash
# Check if postgres is healthy
docker compose ps

# Check logs
docker compose logs postgres
```

### Rebuild from scratch
```bash
docker compose down -v
docker compose up -d --build
```

## License

MIT
