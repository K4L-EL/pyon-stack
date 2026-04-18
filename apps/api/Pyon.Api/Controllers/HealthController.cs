using Microsoft.AspNetCore.Mvc;

namespace __PYON_NAMESPACE__.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", service = "__PYON_NAME__" });
}
