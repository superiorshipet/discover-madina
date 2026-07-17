# Discover Madina 🌍

A modern web application dedicated to exploring and discovering the rich culture, history, and attractions of Madina.

## 📋 Overview

Discover Madina is a full-stack web application that provides users with comprehensive information about Madina's attractions, historical sites, cultural events, and local experiences. Built with modern web technologies, it offers an intuitive interface for discovering and exploring everything Madina has to offer.

## 🛠️ Technology Stack

- **HTML** (35.4%) - Semantic markup and page structure
- **C#** (23.5%) - Backend services and API development
- **CSS** (21.6%) - Styling and responsive design
- **JavaScript** (19.2%) - Client-side interactivity and DOM manipulation
- **Dockerfile** (0.3%) - Container configuration for deployment

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+) or npm
- .NET SDK (v5.0+)
- Docker (optional, for containerized deployment)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/superiorshipet/discover-madina.git
cd discover-madina

# Install frontend dependencies
npm install

# Restore .NET dependencies
dotnet restore
```

### Development

```bash
# Start the development server
npm run dev

# Build the project
npm run build

# Run the C# backend
dotnet run

# Run tests
npm run test
```

### Docker Deployment

```bash
# Build Docker image
docker build -t discover-madina .

# Run container
docker run -p 80:80 discover-madina
```

## 📁 Project Structure

```
discover-madina/
├── public/              # Static HTML files
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── styles/          # CSS stylesheets
│   └── scripts/         # JavaScript files
├── backend/             # C# backend services
│   ├── Controllers/      # API endpoints
│   ├── Models/          # Data models
│   ├── Services/        # Business logic
│   └── Data/            # Database context
├── Dockerfile           # Container configuration
└── package.json         # Node dependencies
```

## 🎯 Features

- 🗺️ **Interactive Map** - Explore Madina's geography and landmarks
- 📚 **Historical Information** - Detailed history of important sites
- 🎭 **Cultural Events** - Upcoming events and celebrations
- 🍽️ **Local Guide** - Restaurants, shops, and services
- 📸 **Photo Gallery** - Beautiful images of attractions
- 🔍 **Search & Filter** - Easy navigation and discovery
- 📱 **Responsive Design** - Works on all devices

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development

# Backend
ConnectionStrings__DefaultConnection=Server=localhost;Database=DiscoverMadina;
ASPNETCORE_ENVIRONMENT=Development
PORT=5000
```

## 📖 Usage

### Accessing the Application

1. Start the development server
2. Open your browser to `http://localhost:3000`
3. Explore attractions, events, and information about Madina

### API Documentation

The backend API provides endpoints for:

- `/api/attractions` - Get list of attractions
- `/api/events` - Upcoming events
- `/api/locations` - Location information
- `/api/reviews` - User reviews and ratings

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run C# unit tests
dotnet test
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues
- Verify your connection string in `.env`
- Ensure database service is running
- Run migrations: `dotnet ef database update`

### CORS Errors
- Check backend CORS configuration in `Startup.cs`
- Verify frontend URL is whitelisted

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact & Support

For questions, suggestions, or issues, please:

- Open an issue on [GitHub Issues](https://github.com/superiorshipet/discover-madina/issues)
- Contact: superiorshipet@github.com

## 🙏 Acknowledgments

- Thanks to all contributors and community members
- Special thanks to local guides and cultural experts
- Icons and assets from open-source libraries

---

**Last Updated:** July 2026  
**Version:** 1.0.0

Made with ❤️ by the Discover Madina Team
