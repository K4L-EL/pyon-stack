using Microsoft.EntityFrameworkCore;
using __PYON_NAMESPACE__.Api.Data;
using __PYON_NAMESPACE__.Api.Data.Entities;

namespace __PYON_NAMESPACE__.Api.Services;

public class DataSeeder(AppDbContext db, IConfiguration config, ILogger<DataSeeder> logger)
{
    public async Task SeedAsync()
    {
        var email = config["Seed:AdminEmail"] ?? "admin@example.com";
        var password = config["Seed:AdminPassword"] ?? "change-me-now";

        var admin = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (admin is null)
        {
            admin = new User
            {
                Email = email,
                DisplayName = "Admin",
                IsAdmin = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            };
            db.Users.Add(admin);
            await db.SaveChangesAsync();
            logger.LogInformation("Seeded admin user {Email}", email);
        }
        else if (!admin.IsAdmin)
        {
            admin.IsAdmin = true;
            await db.SaveChangesAsync();
        }

        if (!await db.Posts.AnyAsync())
        {
            db.Posts.Add(new Post
            {
                Slug = "welcome",
                Title = "Welcome to __PYON_DISPLAY_NAME__",
                Excerpt = "Your first post, published by the seeder.",
                BodyMarkdown = "# Welcome\n\nEdit this post from the admin panel at `/admin/blog`.",
                AuthorId = admin.Id,
                PublishedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();
            logger.LogInformation("Seeded welcome post");
        }
    }
}
