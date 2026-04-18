using Microsoft.EntityFrameworkCore;
using __PYON_NAMESPACE__.Api.Data.Entities;

namespace __PYON_NAMESPACE__.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.Property(u => u.DisplayName).HasMaxLength(128).IsRequired();
            e.Property(u => u.PasswordHash).HasMaxLength(256).IsRequired();
        });

        b.Entity<Post>(e =>
        {
            e.HasIndex(p => p.Slug).IsUnique();
            e.Property(p => p.Slug).HasMaxLength(200).IsRequired();
            e.Property(p => p.Title).HasMaxLength(300).IsRequired();
            e.Property(p => p.Excerpt).HasMaxLength(500);
        });
    }
}
