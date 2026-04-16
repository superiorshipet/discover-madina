# Use .NET SDK for building
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Install SQLite dependencies
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

# Copy published output
COPY --from=build /app/out ./

# Create wwwroot and uploads directory
RUN mkdir -p wwwroot/uploads

# Expose port (Railway uses PORT env variable)
EXPOSE 8080

# Set environment variable for ASP.NET
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "DiscoverMadina.dll"]
