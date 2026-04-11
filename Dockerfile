# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy only the project file first to cache the restore layer
COPY ["backend/DiscoverMadina.csproj", "backend/"]
RUN dotnet restore "backend/DiscoverMadina.csproj"

# Copy everything else
COPY . .

# Publish the app
WORKDIR "/src/backend"
RUN dotnet publish "DiscoverMadina.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Copy the published .NET app
COPY --from=build /app/publish .

# Copy your frontend folder into wwwroot so .NET can see it
# (Assuming your HTML is in a folder named 'frontend' in your repo)
COPY frontend/ ./wwwroot/

# Railway uses port 8080 by default
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "DiscoverMadina.dll"]