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
                Title = "__PYON_COPY_SEED_POST_TITLE__",
                Excerpt = "__PYON_COPY_SEED_POST_EXCERPT__",
                BodyMarkdown = "__PYON_COPY_SEED_POST_BODY__",
                AuthorId = admin.Id,
                PublishedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();
            logger.LogInformation("Seeded welcome post");
        }
    }
}
