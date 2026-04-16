using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DiscoverMadina.Data;
using DiscoverMadina.Repositories;
using DiscoverMadina.Repositories.Interfaces;
using DiscoverMadina.Models;

var builder = WebApplication.CreateBuilder(args);

// Database - Use /app/data for Railway volume
var dbPath = builder.Configuration.GetConnectionString("Default") ?? "Data Source=/app/data/discover_madina.db";
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlite(dbPath));

// Repositories
builder.Services.AddScoped<IAttractionRepository, AttractionRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IAttractionPhotoRepository, AttractionPhotoRepository>();

builder.Services.AddHttpClient();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "DiscoverMadinaSecretKey2025!ProductionChangeThis!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "DiscoverMadina",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "DiscoverMadinaUsers",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS - Allow Railway domain and localhost
builder.Services.AddCors(opt => opt.AddPolicy("AllowAll", policy =>
{
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader();
}));

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// Ensure database directory exists
var dataDir = Path.GetDirectoryName(dbPath.Replace("Data Source=", ""));
if (!string.IsNullOrEmpty(dataDir) && !Directory.Exists(dataDir))
    Directory.CreateDirectory(dataDir);

// Migrate and Seed Database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    
    if (!db.Admins.Any())
    {
        db.Admins.Add(new Admin
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "admin",
            CreatedAt = DateTime.UtcNow
        });
        db.SaveChanges();
        Console.WriteLine("✅ Default admin created: admin / admin123");
    }
}

// Serve static files from wwwroot (frontend build)
app.UseDefaultFiles();
app.UseStaticFiles();

// API endpoints
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// SPA fallback - serve index.html for any non-API routes
app.MapFallbackToFile("index.html");

// Create uploads directory
var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsDir);

app.Run();
