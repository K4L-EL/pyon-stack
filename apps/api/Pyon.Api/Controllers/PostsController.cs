using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using __PYON_NAMESPACE__.Api.Data;
using __PYON_NAMESPACE__.Api.DTOs;

namespace __PYON_NAMESPACE__.Api.Controllers;

[ApiController]
[Route("api/posts")]
public class PostsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List()
    {
        var now = DateTime.UtcNow;
        var posts = await db.Posts
            .Where(p => p.PublishedAt != null && p.PublishedAt <= now)
            .OrderByDescending(p => p.PublishedAt)
            .Select(p => new PostResponse(
                p.Id, p.Slug, p.Title, p.Excerpt, p.BodyMarkdown, p.PublishedAt, p.CreatedAt, p.UpdatedAt))
            .ToListAsync();
        return Ok(posts);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var now = DateTime.UtcNow;
        var post = await db.Posts
            .Where(p => p.Slug == slug && p.PublishedAt != null && p.PublishedAt <= now)
            .Select(p => new PostResponse(
                p.Id, p.Slug, p.Title, p.Excerpt, p.BodyMarkdown, p.PublishedAt, p.CreatedAt, p.UpdatedAt))
            .FirstOrDefaultAsync();
        return post is null ? NotFound() : Ok(post);
    }
}
