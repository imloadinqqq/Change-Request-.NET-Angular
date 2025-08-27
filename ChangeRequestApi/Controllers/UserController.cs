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

  [HttpGet("user/{id:length(24)}")]
  public async Task<IActionResult> Get(string id)
  {
    var user = await _userService.GetAsync(id);

    if (user is null)
      return NotFound();

    return Ok(user);
  }

  [HttpPost("createUser")]
  public async Task<IActionResult> Create(User newUser)
  {
    await _userService.CreateAsync(newUser);

    return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginRequest request)
  {
    var user = await _userService.GetByCredentialsAsync(request.Username, request.Password);
    if (user == null)
        return Unauthorized();

    var claims = new[]
    {
      new Claim(JwtRegisteredClaimNames.Sub, user.Id!),
      new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
      new Claim(ClaimTypes.Role, user.Type.ToString())
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

    Console.WriteLine(token);
    Console.WriteLine(_jwtSettings.Key);

    return Ok(new
    {
      token = new JwtSecurityTokenHandler().WriteToken(token),
      user = new { user.Id, user.Username }
    });
  }

  [Authorize(Roles = "Admin")]
  [HttpGet("protected")]
  public IActionResult GetProtected() => Ok("You are an admin!");

}

public class LoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
