# Multi-stage build for both frontend and backend

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /backend
COPY backend/*.csproj ./
RUN dotnet restore
COPY backend/ ./
RUN dotnet publish -c Release -o out

# Stage 3: Final Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Install SQLite
RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy backend
COPY --from=backend-build /backend/out ./

# Copy frontend build to wwwroot
COPY --from=frontend-build /frontend/dist ./wwwroot/

# Create directories for persistent data
RUN mkdir -p /app/data /app/wwwroot/uploads

# Set permissions
RUN chmod -R 755 /app/wwwroot

EXPOSE 8080

ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "DiscoverMadina.dll"]
