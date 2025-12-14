# Frontend React/Vite Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG VITE_API_BASE_URL=localhost
ARG VITE_API_PORT=9000

# Set as environment variables for build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_PORT=${VITE_API_PORT}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html


# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
