using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DiscoverMadina.Data;
using DiscoverMadina.Repositories;
using DiscoverMadina.Repositories.Interfaces;
using DiscoverMadina.Models;

var builder = WebApplication.CreateBuilder(args);

// Database - Use SQLite locally, PostgreSQL on Railway
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var usePostgres = !string.IsNullOrEmpty(databaseUrl);

if (usePostgres)
{
    Console.WriteLine($"📦 DATABASE_URL found, using PostgreSQL");
    
    // Railway sends: postgresql://user:pass@host:port/db
    // Parse manually instead of using Uri
    var connectionString = ParsePostgresUrl(databaseUrl);
    
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseNpgsql(connectionString));
    
    Console.WriteLine("✅ Using PostgreSQL (Railway)");
}
else
{
    // SQLite for local development
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=discover_madina.db"));
    
    Console.WriteLine("✅ Using SQLite (Local Development)");
}

// Helper function to parse PostgreSQL URL
static string ParsePostgresUrl(string url)
{
    // Expected format: postgresql://username:password@host:port/database
    try
    {
        // Remove "postgresql://" prefix
        var withoutPrefix = url.Replace("postgresql://", "");
        
        // Split credentials and host/db
        var atIndex = withoutPrefix.IndexOf('@');
        var credentials = withoutPrefix.Substring(0, atIndex);
        var hostAndDb = withoutPrefix.Substring(atIndex + 1);
        
        // Parse credentials
        var colonIndex = credentials.IndexOf(':');
        var username = credentials.Substring(0, colonIndex);
        var password = credentials.Substring(colonIndex + 1);
        
        // Parse host:port/database
        var slashIndex = hostAndDb.IndexOf('/');
        var hostAndPort = hostAndDb.Substring(0, slashIndex);
        var database = hostAndDb.Substring(slashIndex + 1);
        
        // Parse host and port
        var portColonIndex = hostAndPort.LastIndexOf(':');
        var host = hostAndPort.Substring(0, portColonIndex);
        var port = hostAndPort.Substring(portColonIndex + 1);
        
        var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SslMode=Require;TrustServerCertificate=true";
        return connectionString;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Failed to parse DATABASE_URL: {ex.Message}");
        throw;
    }
}

// Repositories
builder.Services.AddScoped<IAttractionRepository, AttractionRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IAttractionPhotoRepository, AttractionPhotoRepository>();

builder.Services.AddHttpClient();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "DiscoverMadinaSuperSecretKey2025!@#$%^&*()";
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

builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// Migrate and Seed Database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    if (usePostgres)
    {
        // For PostgreSQL, apply migrations
        db.Database.Migrate();
    }
    else
    {
        // For SQLite, ensure created
        db.Database.EnsureCreated();
    }
    
    // Seed admin if not exists
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
    
    // Seed superadmin if not exists
    if (!db.Admins.Any(a => a.Username == "superior"))
    {
        db.Admins.Add(new Admin
        {
            Username = "superior",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("superior004"),
            Role = "superadmin",
            CreatedAt = DateTime.UtcNow
        });
        db.SaveChanges();
        Console.WriteLine("✅ Super admin created: superior / superior004");
    }
    
    // Seed attractions if empty
    if (!db.Attractions.Any())
    {
        var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        db.Attractions.AddRange(
            new Attraction { Name = "المسجد النبوي الشريف", NameEn = "Al-Masjid an-Nabawi", Category = "religious", Icon = "🕌", Latitude = 24.4672m, Longitude = 39.6111m, RatingAvg = 5.0f, OpeningHours = "24/7", Description = "المسجد النبوي الشريف هو ثاني أقدس مكان في الإسلام.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Name = "مسجد قباء", NameEn = "Masjid Quba", Category = "religious", Icon = "🕌", Latitude = 24.4397m, Longitude = 39.6151m, RatingAvg = 4.9f, OpeningHours = "24/7", Description = "أول مسجد بُني في الإسلام.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Name = "جبل أحد", NameEn = "Mount Uhud", Category = "cultural", Icon = "⛰️", Latitude = 24.5267m, Longitude = 39.6411m, RatingAvg = 4.8f, OpeningHours = "دائماً مفتوح", Description = "موقع جبل أحد التاريخي.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Name = "مسجد القبلتين", NameEn = "Masjid Al-Qiblatayn", Category = "religious", Icon = "🕌", Latitude = 24.4847m, Longitude = 39.5789m, RatingAvg = 4.7f, OpeningHours = "24/7", Description = "هنا تلقى النبي ﷺ الوحي بتغيير القبلة.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Name = "مطعم البيك", NameEn = "Al-Baik", Category = "dining", Icon = "🍗", Latitude = 24.4680m, Longitude = 39.6090m, RatingAvg = 4.7f, OpeningHours = "11:00 - 02:00", Description = "سلسلة مطاعم سعودية شهيرة.", IsFeatured = false, CreatedAt = seedDate },
            new Attraction { Name = "متحف دار المدينة", NameEn = "Dar Al Madinah Museum", Category = "cultural", Icon = "🏛️", Latitude = 24.4710m, Longitude = 39.6125m, RatingAvg = 4.6f, OpeningHours = "09:00 - 21:00", Description = "متحف يعرض تاريخ وتراث المدينة.", IsFeatured = false, CreatedAt = seedDate },
            new Attraction { Name = "المساجد السبعة", NameEn = "The Seven Mosques", Category = "religious", Icon = "🕌", Latitude = 24.5019m, Longitude = 39.6078m, RatingAvg = 4.5f, OpeningHours = "24/7", Description = "مجمع مساجد تاريخية.", IsFeatured = false, CreatedAt = seedDate },
            new Attraction { Name = "حديقة الملك فهد", NameEn = "King Fahd Park", Category = "entertainment", Icon = "🌳", Latitude = 24.4800m, Longitude = 39.5960m, RatingAvg = 4.4f, OpeningHours = "07:00 - 23:00", Description = "أكبر حديقة عامة في المدينة.", IsFeatured = false, CreatedAt = seedDate }
        );
        db.SaveChanges();
        Console.WriteLine("✅ 8 attractions seeded");
    }
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseDefaultFiles();
app.UseStaticFiles();

var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsDir);

app.Run();
