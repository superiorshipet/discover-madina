using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DiscoverMadina.Data;
using DiscoverMadina.Repositories;
using DiscoverMadina.Repositories.Interfaces;
using DiscoverMadina.Models;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=discover_madina.db"));

// Repositories
builder.Services.AddScoped<IAttractionRepository, AttractionRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IAttractionPhotoRepository, AttractionPhotoRepository>();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "DiscoverMadinaSecretKey2025!";
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

builder.Services.AddCors(opt => opt.AddPolicy("AllowFrontend", policy =>
{
    policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
}));

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// Migrate and Seed
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
        Console.WriteLine("✅ Admin: admin / admin123");
    }
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

Directory.CreateDirectory(Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads"));

app.Run();
