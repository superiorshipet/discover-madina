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
# ... (rest of your build steps)

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY frontend/ ./wwwroot/

# Railway looks for PORT, so we tell .NET to listen there
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "DiscoverMadina.dll"]