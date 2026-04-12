using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DiscoverMadina.Data;
using DiscoverMadina.Repositories;
using DiscoverMadina.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ── PORT — must be set BEFORE builder.Build() ─────────────────────────────────
// Railway injects PORT (e.g. 3000, 8080, random). We bind to 0.0.0.0:$PORT.
// Locally PORT is not set so we default to 8080.
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ── DATABASE ──────────────────────────────────────────────────────────────────
var pgHost = Environment.GetEnvironmentVariable("PGHOST");
var isPostgres = !string.IsNullOrEmpty(pgHost);

if (isPostgres)
{
    var pgPort     = Environment.GetEnvironmentVariable("PGPORT")     ?? "5432";
    var pgDb       = Environment.GetEnvironmentVariable("PGDATABASE") ?? "railway";
    var pgUser     = Environment.GetEnvironmentVariable("PGUSER")     ?? "postgres";
    var pgPassword = Environment.GetEnvironmentVariable("PGPASSWORD") ?? "";

    var connStr = $"Host={pgHost};Port={pgPort};Database={pgDb};Username={pgUser};Password={pgPassword};SSL Mode=Require;Trust Server Certificate=true;";
    builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connStr));
}
else
{
    var sqliteConn = builder.Configuration.GetConnectionString("Default") ?? "Data Source=discover_madina.db";
    builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlite(sqliteConn));
}

// ── REPOSITORIES ──────────────────────────────────────────────────────────────
builder.Services.AddScoped<IAttractionRepository, AttractionRepository>();
builder.Services.AddScoped<IReviewRepository,     ReviewRepository>();
builder.Services.AddScoped<IUserRepository,       UserRepository>();

builder.Services.AddHttpClient();

// ── JWT ───────────────────────────────────────────────────────────────────────
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
            ValidIssuer              = builder.Configuration["Jwt:Issuer"]   ?? "DiscoverMadina",
            ValidAudience            = builder.Configuration["Jwt:Audience"] ?? "DiscoverMadinaUsers",
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

// ── DB INIT ───────────────────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (isPostgres)
        db.Database.EnsureCreated();
    else
        db.Database.Migrate();
}

// ── PIPELINE ──────────────────────────────────────────────────────────────────
app.UseSwagger();
app.UseSwaggerUI();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsDir);

app.Run();