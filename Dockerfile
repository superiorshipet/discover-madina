# Multi-stage Dockerfile for Discover Madina Full-Stack App
# .NET 8 Backend + Static Frontend + Nginx for prod

## Stage 1: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj and restore
COPY backend/DiscoverMadina.csproj ./backend/
RUN dotnet restore ./backend/DiscoverMadina.csproj

# Copy source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Publish
WORKDIR /app/backend
RUN dotnet publish -c Release -o out --no-restore

## Stage 2: Runtime + Nginx
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy backend
COPY --from=build /app/backend/out ./

# Copy frontend static files to wwwroot (served by .NET)
COPY frontend/ ./wwwroot/frontend/

# Install nginx for SPA routing (optional, .NET serves static)
RUN apt-get update &amp;&amp; apt-get install -y nginx &amp;&amp; rm -rf /var/lib/apt/lists/*

# Nginx config for SPA
COPY <<EOF /etc/nginx/sites-available/default
server {
    listen 80;
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:5000/health || exit 1

# Run .NET (nginx proxies)
ENTRYPOINT ["dotnet", "DiscoverMadina.dll"]

