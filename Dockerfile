# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["backend/DiscoverMadina.csproj", "backend/"]
RUN dotnet restore "backend/DiscoverMadina.csproj"

COPY . .
WORKDIR "/src/backend"
RUN dotnet publish "DiscoverMadina.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY frontend/ ./wwwroot/

# Do NOT hardcode ASPNETCORE_URLS here — Program.cs reads $PORT at runtime
EXPOSE 8080

ENTRYPOINT ["dotnet", "DiscoverMadina.dll"]