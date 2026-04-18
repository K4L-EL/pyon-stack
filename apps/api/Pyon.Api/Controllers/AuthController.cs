using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using __PYON_NAMESPACE__.Api.Data;
using __PYON_NAMESPACE__.Api.Data.Entities;
using __PYON_NAMESPACE__.Api.DTOs;
using __PYON_NAMESPACE__.Api.Services;

namespace __PYON_NAMESPACE__.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, IJwtService jwt, ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required" });
        if (req.Password.Length < 8)
            return BadRequest(new { message = "Password must be at least 8 characters" });

        var email = req.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "An account with that email already exists" });

        var user = new User
        {
            Email = email,
            DisplayName = string.IsNullOrWhiteSpace(req.DisplayName) ? email : req.DisplayName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        logger.LogInformation("Registered user {Email}", email);

        return Ok(new AuthResponse(
            jwt.Issue(user),
            new MeResponse(user.Id, user.Email, user.DisplayName, user.IsAdmin)));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        try
        {
            var email = (req.Email ?? "").Trim().ToLowerInvariant();
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid credentials" });

            user.LastLoginAt = DateTime.UtcNow;
            await db.SaveChangesAsync();

            return Ok(new AuthResponse(
                jwt.Issue(user),
                new MeResponse(user.Id, user.Email, user.DisplayName, user.IsAdmin)));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Login failed");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var sub = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        if (!Guid.TryParse(sub, out var id)) return Unauthorized();
        var user = await db.Users.FindAsync(id);
        if (user is null) return Unauthorized();
        return Ok(new MeResponse(user.Id, user.Email, user.DisplayName, user.IsAdmin));
    }
}
