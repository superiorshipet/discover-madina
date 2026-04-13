using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DiscoverMadina.Data;
using DiscoverMadina.Repositories;
using DiscoverMadina.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=discover_madina.db"));

builder.Services.AddScoped<IAttractionRepository, AttractionRepository>();
builder.Services.AddScoped<IReviewRepository,    ReviewRepository>();
builder.Services.AddScoped<IUserRepository,      UserRepository>();

builder.Services.AddHttpClient();

var jwtKey = builder.Configuration["Jwt:Key"] ?? "DiscoverMadinaSecretKey2025!";
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
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles(); // serve /wwwroot (uploaded images)
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseDefaultFiles(); 
app.UseStaticFiles(); 

app.MapControllers();

// ensure wwwroot/uploads exists
var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
Directory.CreateDirectory(uploadsDir);

app.Run();
