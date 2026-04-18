using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using __PYON_NAMESPACE__.Api.DTOs;
using __PYON_NAMESPACE__.Api.Services;

namespace __PYON_NAMESPACE__.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/ai")]
public class AiController(IAiService ai, ILogger<AiController> logger) : ControllerBase
{
    [HttpGet("status")]
    [AllowAnonymous]
    public IActionResult Status() => Ok(new { configured = ai.IsConfigured });

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequest req, CancellationToken ct)
    {
        if (req?.Messages is null || req.Messages.Count == 0)
            return BadRequest(new { message = "messages is required" });

        if (!ai.IsConfigured)
            return StatusCode(503, new { message = "AI is not configured on this server." });

        try
        {
            var result = await ai.ChatAsync(req, ct);
            return Ok(result);
        }
        catch (OperationCanceledException)
        {
            return StatusCode(499, new { message = "Client closed request" });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "AI chat failed");
            return StatusCode(502, new { message = "Upstream AI call failed", detail = ex.Message });
        }
    }
}
