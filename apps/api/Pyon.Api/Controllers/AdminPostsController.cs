using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using __PYON_NAMESPACE__.Api.Data;
using __PYON_NAMESPACE__.Api.Data.Entities;
using __PYON_NAMESPACE__.Api.DTOs;

namespace __PYON_NAMESPACE__.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/posts")]
public class AdminPostsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List()
    {
        var posts = await db.Posts
            .OrderByDescending(p => p.UpdatedAt)
            .Select(p => new PostResponse(
                p.Id, p.Slug, p.Title, p.Excerpt, p.BodyMarkdown, p.PublishedAt, p.CreatedAt, p.UpdatedAt))
            .ToListAsync();
        return Ok(posts);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var p = await db.Posts.FindAsync(id);
        return p is null ? NotFound() : Ok(new PostResponse(
            p.Id, p.Slug, p.Title, p.Excerpt, p.BodyMarkdown, p.PublishedAt, p.CreatedAt, p.UpdatedAt));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PostUpsertRequest req)
    {
        var authorId = CurrentUserId();
        if (authorId is null) return Unauthorized();

        if (await db.Posts.AnyAsync(p => p.Slug == req.Slug))
            return Conflict(new { message = "Slug already in use" });

        var post = new Post
        {
            Title = req.Title,
            Slug = req.Slug,
            Excerpt = req.Excerpt,
            BodyMarkdown = req.BodyMarkdown,
            AuthorId = authorId.Value,
            PublishedAt = req.Publish ? DateTime.UtcNow : null,
        };
        db.Posts.Add(post);
        await db.SaveChangesAsync();
        return Ok(ToDto(post));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] PostUpsertRequest req)
    {
        var p = await db.Posts.FindAsync(id);
        if (p is null) return NotFound();

        if (p.Slug != req.Slug && await db.Posts.AnyAsync(x => x.Slug == req.Slug))
            return Conflict(new { message = "Slug already in use" });

        p.Title = req.Title;
        p.Slug = req.Slug;
        p.Excerpt = req.Excerpt;
        p.BodyMarkdown = req.BodyMarkdown;
        p.UpdatedAt = DateTime.UtcNow;
        if (req.Publish && p.PublishedAt is null) p.PublishedAt = DateTime.UtcNow;
        if (!req.Publish) p.PublishedAt = null;
        await db.SaveChangesAsync();
        return Ok(ToDto(p));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var p = await db.Posts.FindAsync(id);
        if (p is null) return NotFound();
        db.Posts.Remove(p);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private Guid? CurrentUserId()
    {
        var sub = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        return Guid.TryParse(sub, out var id) ? id : null;
    }

    private static PostResponse ToDto(Post p) => new(
        p.Id, p.Slug, p.Title, p.Excerpt, p.BodyMarkdown, p.PublishedAt, p.CreatedAt, p.UpdatedAt);
}
