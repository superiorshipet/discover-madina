using Microsoft.EntityFrameworkCore;
using DiscoverMadina.Models;
using static DiscoverMadina.Controllers.SavedPlacesController;

namespace DiscoverMadina.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Attraction> Attractions => Set<Attraction>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<AttractionPhoto> AttractionPhotos => Set<AttractionPhoto>();
    public DbSet<SavedPlace> SavedPlaces => Set<SavedPlace>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Attraction>().Property(a => a.Latitude).HasPrecision(10, 7);
        mb.Entity<Attraction>().Property(a => a.Longitude).HasPrecision(10, 7);

        mb.Entity<Review>()
          .HasOne(r => r.User).WithMany(u => u.Reviews)
          .HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
        mb.Entity<Review>()
          .HasOne(r => r.Attraction).WithMany(a => a.Reviews)
          .HasForeignKey(r => r.AttractionId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<AttractionPhoto>()
          .HasOne(p => p.Attraction).WithMany(a => a.Photos)
          .HasForeignKey(p => p.AttractionId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<SavedPlace>()
          .HasOne(s => s.User).WithMany()
          .HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Cascade);
        mb.Entity<SavedPlace>()
          .HasOne(s => s.Attraction).WithMany()
          .HasForeignKey(s => s.AttractionId).OnDelete(DeleteBehavior.Cascade);

        var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        mb.Entity<Attraction>().HasData(
            new Attraction { Id = 1, Name = "المسجد النبوي الشريف", NameEn = "Al-Masjid an-Nabawi", Category = "religious", Icon = "🕌", Latitude = 24.4672m, Longitude = 39.6111m, RatingAvg = 5.0f, OpeningHours = "24/7", Description = "المسجد النبوي الشريف هو ثاني أقدس مكان في الإسلام.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Id = 2, Name = "مسجد قباء", NameEn = "Masjid Quba", Category = "religious", Icon = "🕌", Latitude = 24.4397m, Longitude = 39.6151m, RatingAvg = 4.9f, OpeningHours = "24/7", Description = "أول مسجد بُني في الإسلام.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Id = 3, Name = "جبل أحد", NameEn = "Mount Uhud", Category = "cultural", Icon = "⛰️", Latitude = 24.5267m, Longitude = 39.6411m, RatingAvg = 4.8f, OpeningHours = "دائماً مفتوح", Description = "موقع جبل أحد التاريخي.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Id = 4, Name = "مسجد القبلتين", NameEn = "Masjid Al-Qiblatayn", Category = "religious", Icon = "🕌", Latitude = 24.4847m, Longitude = 39.5789m, RatingAvg = 4.7f, OpeningHours = "24/7", Description = "هنا تلقى النبي ﷺ الوحي بتغيير القبلة.", IsFeatured = true, CreatedAt = seedDate },
            new Attraction { Id = 5, Name = "مطعم البيك", NameEn = "Al-Baik", Category = "dining", Icon = "🍗", Latitude = 24.4680m, Longitude = 39.6090m, RatingAvg = 4.7f, OpeningHours = "11:00 - 02:00", Description = "سلسلة مطاعم سعودية شهيرة.", IsFeatured = false, CreatedAt = seedDate },
            new Attraction { Id = 6, Name = "متحف دار المدينة", NameEn = "Dar Al Madinah Museum", Category = "cultural", Icon = "🏛️", Latitude = 24.4710m, Longitude = 39.6125m, RatingAvg = 4.6f, OpeningHours = "09:00 - 21:00", Description = "متحف يعرض تاريخ وتراث المدينة.", IsFeatured = false, CreatedAt = seedDate },
            new Attraction { Id = 7, Name = "المساجد السبعة", NameEn = "The Seven Mosques", Category = "religious", Icon = "🕌", Latitude = 24.5019m, Longitude = 39.6078m, RatingAvg = 4.5f, OpeningHours = "24/7", Description = "مجمع مساجد تاريخية.", IsFeatured = false, CreatedAt = seedDate },
            new Attraction { Id = 8, Name = "حديقة الملك فهد", NameEn = "King Fahd Park", Category = "entertainment", Icon = "🌳", Latitude = 24.4800m, Longitude = 39.5960m, RatingAvg = 4.4f, OpeningHours = "07:00 - 23:00", Description = "أكبر حديقة عامة في المدينة.", IsFeatured = false, CreatedAt = seedDate }
        );
    }
}
