using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DiscoverMadina.Data;
using DiscoverMadina.Repositories;
using DiscoverMadina.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ── DATABASE ──────────────────────────────────────────────────────────────────
// On Railway: build a PostgreSQL connection string from injected PG* env vars.
// Locally:    fall back to SQLite via appsettings.json → ConnectionStrings:Default
var pgHost = Environment.GetEnvironmentVariable("PGHOST");

if (!string.IsNullOrEmpty(pgHost))
{
    // Railway PostgreSQL — compose the Npgsql connection string from individual vars
    var pgPort     = Environment.GetEnvironmentVariable("PGPORT")     ?? "5432";
    var pgDb       = Environment.GetEnvironmentVariable("PGDATABASE") ?? "railway";
    var pgUser     = Environment.GetEnvironmentVariable("PGUSER")     ?? "postgres";
    var pgPassword = Environment.GetEnvironmentVariable("PGPASSWORD") ?? "";

    var connectionString =
        $"Host={pgHost};Port={pgPort};Database={pgDb};Username={pgUser};Password={pgPassword};SSL Mode=Require;Trust Server Certificate=true;";

    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseNpgsql(connectionString));
}
else
{
    // Local development — SQLite
    var sqliteConn = builder.Configuration.GetConnectionString("Default")
                     ?? "Data Source=discover_madina.db";
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlite(sqliteConn));
}

// ── REPOSITORIES ──────────────────────────────────────────────────────────────
builder.Services.AddScoped<IAttractionRepository, AttractionRepository>();
builder.Services.AddScoped<IReviewRepository,     ReviewRepository>();
builder.Services.AddScoped<IUserRepository,       UserRepository>();

builder.Services.AddHttpClient();

// ── JWT AUTH ──────────────────────────────────────────────────────────────────
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
             ?? builder.Configuration["Jwt:Key"]
             ?? "DiscoverMadinaSecretKey2025!";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => {
        opt.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "DiscoverMadina",
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

// ── PORT ──────────────────────────────────────────────────────────────────────
// Railway injects PORT; default to 8080
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// ── AUTO-MIGRATE ON STARTUP ───────────────────────────────────────────────────
using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ── MIDDLEWARE PIPELINE ───────────────────────────────────────────────────────
app.UseSwagger();
app.UseSwaggerUI();
app.UseDefaultFiles();
app.UseStaticFiles();   // serves /wwwroot (frontend + uploaded images)
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();   // ← only once

// ── ENSURE UPLOADS DIR EXISTS ─────────────────────────────────────────────────
var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsDir);

app.Run();