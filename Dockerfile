# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore dependencies first (layer cache)
COPY ["backend/DiscoverMadina.csproj", "backend/"]
RUN dotnet restore "backend/DiscoverMadina.csproj"

# Copy everything and publish
COPY . .
WORKDIR "/src/backend"
RUN dotnet publish "DiscoverMadina.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

# Copy frontend into wwwroot so UseStaticFiles() serves it
COPY frontend/ ./wwwroot/

# Railway injects PORT; ASPNETCORE_URLS picks it up at runtime via Program.cs
EXPOSE 8080

ENTRYPOINT ["dotnet", "DiscoverMadina.dll"]