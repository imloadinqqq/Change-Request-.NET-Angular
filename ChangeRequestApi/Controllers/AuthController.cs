using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChangeRequestApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    [HttpGet("validate")]
    [Authorize]
    public IActionResult Validate()
    {
      var userId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value
                   ?? User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

      var username = User.Claims.FirstOrDefault(c => c.Type == "unique_name")?.Value
                     ?? User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

      var role = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

      return Ok(new
      {
        valid = true,
        userId,
        username,
        role
      });
    }
  }
}
