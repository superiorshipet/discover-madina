using Microsoft.EntityFrameworkCore;
using DiscoverMadina.Models;

namespace DiscoverMadina.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Attraction> Attractions => Set<Attraction>();
    public DbSet<User>       Users       => Set<User>();
    public DbSet<Admin>      Admins      => Set<Admin>();
    public DbSet<Review>     Reviews     => Set<Review>();
    public DbSet<ChatLog>    ChatLogs    => Set<ChatLog>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Attraction>().Property(a => a.Latitude).HasPrecision(10,7);
        mb.Entity<Attraction>().Property(a => a.Longitude).HasPrecision(10,7);

        mb.Entity<Review>()
          .HasOne(r => r.User).WithMany(u => u.Reviews)
          .HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Review>()
          .HasOne(r => r.Attraction).WithMany(a => a.Reviews)
          .HasForeignKey(r => r.AttractionId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<ChatLog>()
          .HasOne(c => c.User).WithMany(u => u.ChatLogs)
          .HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.SetNull);

        // Static seed dates — no dynamic values
        var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        mb.Entity<Attraction>().HasData(
            new Attraction { Id=1, Name="المسجد النبوي الشريف", NameEn="Al-Masjid an-Nabawi",
                Category="religious", Icon="🕌", Latitude=24.4672m, Longitude=39.6111m,
                RatingAvg=5.0f, OpeningHours="24/7",
                Description="المسجد النبوي الشريف هو ثاني أقدس مكان في الإسلام.",
                IsFeatured=true, CreatedAt=seedDate },

            new Attraction { Id=2, Name="مسجد قباء", NameEn="Masjid Quba",
                Category="religious", Icon="🕌", Latitude=24.4397m, Longitude=39.6151m,
                RatingAvg=4.9f, OpeningHours="24/7",
                Description="أول مسجد بُني في الإسلام.",
                IsFeatured=true, CreatedAt=seedDate },

            new Attraction { Id=3, Name="متحف المدينة المنورة", NameEn="Madinah Museum",
                Category="cultural", Icon="🏛️", Latitude=24.4710m, Longitude=39.6125m,
                RatingAvg=4.6f, OpeningHours="09:00 - 21:00",
                Description="يعرض تاريخ المدينة المنورة عبر العصور.",
                IsFeatured=true, CreatedAt=seedDate },

            new Attraction { Id=4, Name="حديقة الملك فهد", NameEn="King Fahd Park",
                Category="entertainment", Icon="🌳", Latitude=24.4800m, Longitude=39.5960m,
                RatingAvg=4.4f, OpeningHours="07:00 - 23:00",
                Description="أكبر حديقة عامة في المدينة المنورة.",
                IsFeatured=true, CreatedAt=seedDate },

            new Attraction { Id=5, Name="مطعم البيك", NameEn="Al-Baik Restaurant",
                Category="dining", Icon="🍗", Latitude=24.4680m, Longitude=39.6090m,
                RatingAvg=4.7f, OpeningHours="10:00 - 02:00",
                Description="سلسلة مطاعم سعودية شهيرة.",
                IsFeatured=false, CreatedAt=seedDate }
        );

        mb.Entity<Admin>().HasData(
            new Admin { Id=1, Username="admin01",
                PasswordHash="$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // admin123
                Role="superadmin", CreatedAt=seedDate }
        );
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(w =>
            w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }
}
