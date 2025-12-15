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

1. **Configure environment variables**
   ```bash
   # Copy the root .env.example to .env
   cp .env.example .env
   
   # Edit .env with your configuration:
   # - Database credentials (POSTGRES_PASSWORD)
   # - JWT secrets (ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY)
   # - API keys (GEMINI_API_KEY, OPENROUTER_API_KEY)
   # - CORS origins (CORS_ORIGINS)
   ```

2. **Build and start all services**
   ```bash
   docker compose up -d --build
   ```

3. **Run database migrations and seeds**
   ```bash
   docker compose exec backend npm run migrate:latest
   docker compose exec backend npm run seed:run
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:9000
   - API Documentation: http://localhost/documentation (or http://localhost:9000/api/documentation)
   - FastAPI Docs: http://localhost:8000/docs

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

# Access database shell
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
   pip install -r requirements.txt
   python fastapi_main.py
   ```

5. **Frontend (Predicteraa folder)**
   ```bash
   cd Predicteraa
   npm install
   npm run dev
   ```

**Note:** For local development, configure individual `.env` files in each repository folder (`hapi-capstone/.env` and `Predicteraa/.env`) instead of the root `.env` file.
- `NODE_ENV`: Environment mode (default: production)
- `HOST`: Backend host (default: 0.0.0.0)
- `PORT`: Backend port (default: 9000)
- `FASTAPIPROTOCOL`: FastAPI protocol (default: http)
- `FASTAPIHOST`: FastAPI host (default: fastapi)
- `FASTAPIPORT`: FastAPI port (default: 8000)

### Local Development

For local development, configure individual repository `.env` files:
- `hapi-capstone/.env`: Backend configuration (see `hapi-capstone/.env.example`)
- `Predicteraa/.env`: Frontend configuration (see `Predicteraa/.env.example`)

## API Documentation

- Swagger UI: http://localhost/documentation (or http://localhost:9000/documentation)
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
