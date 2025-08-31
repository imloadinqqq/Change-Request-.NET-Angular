using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using ChangeRequestApi.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace ChangeRequestApi.Controllers;

[ApiController]
[Route("api/")]
public class UserController : ControllerBase
{
  private readonly UserService _userService;
  private readonly JwtSettings _jwtSettings;

  public UserController(UserService userService, IOptions<JwtSettings> jwtSettings)
  {
    _userService = userService;
    _jwtSettings = jwtSettings.Value;
  }

  [Authorize]
  [HttpGet("users/{id:length(24)}")]
  public async Task<IActionResult> Get(string id)
  {
    var user = await _userService.GetAsync(id);

    if (user is null)
      return NotFound();

    return Ok(user);
  }

  [Authorize (Roles = "Admin")]
  [HttpGet("users")]
  public async Task<ActionResult<List<User>>> GetUsers()
  {
    List<User> users;

    users = await _userService.GetAllAsync();

    return users;
  }

  [Authorize]
  [HttpGet("users/me")]
  public async Task<ActionResult<User>> GetCurrentUser()
  {
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
             User.FindFirst("sub")?.Value;

    if (string.IsNullOrEmpty(userId))
      return Unauthorized();

    var user = await _userService.GetAsync(userId);
    if (user == null)
      return NotFound();

    return Ok(new UserProfileObject
    {
      Id = user.Id!,
      Username = user.Username,
      Type = user.Type
    });
  }

  [Authorize (Roles = "Admin")]
  [HttpPatch("users/{id:length(24)}/role")]
  public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateRoleObject obj)
  {
    try
    {
      await _userService.PatchAsync(id, obj.NewRole);
      return Ok("Role updated successfully");
    }
    catch (ArgumentException ex)
    {
      return BadRequest(ex.Message);
    }
    catch (KeyNotFoundException ex)
    {
      return NotFound(ex.Message);
    }
  }

  [HttpPost("register")]
  public async Task<IActionResult> Create([FromBody] RegisterUserObject obj)
  {
    var existingUser = await _userService.GetByUsernameAsync(obj.Username);
    if (existingUser != null)
      return BadRequest("Username already exists");

    var newUser = await _userService.CreateAsync(obj);

    return Ok(new {
      Id = newUser.Id,
      Username = newUser.Username,
      Type = newUser.Type
    });
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginRequestObject request)
  {
    var user = await _userService.GetByCredentialsAsync(request.Username, request.Password);
    if (user == null)
        return Unauthorized();

    var claims = new[]
    {
      new Claim(JwtRegisteredClaimNames.Sub, user.Id!),
      new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
      new Claim(ClaimTypes.Role, user.Type.ToString()) // used to authorize Role in ChangeRequestController
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
      issuer: _jwtSettings.Issuer,
      audience: _jwtSettings.Audience,
      claims: claims,
      expires: DateTime.UtcNow.AddHours(1),
      signingCredentials: creds
    );

    return Ok(new
    {
      token = new JwtSecurityTokenHandler().WriteToken(token),
      user = new { user.Id, user.Username }
    });
  }

  [Authorize (Roles = "Admin")]
  [HttpGet("protected")]
  public IActionResult GetProtected() => Ok("You are an admin!");

  [Authorize (Roles = "Admin")]
  [HttpGet("users/stats")]
  public async Task<ActionResult<UserStatsObject>> GetUserStats()
  {
    var stats = await _userService.GetUserStatsAsync();
    return Ok(stats);
  }
}
