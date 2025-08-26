using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using ChangeRequestApi.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace ChangeRequestApi.Controllers;

// CRUD OPERATIONS
// CreateAsync - Post
// UpdateAsync - Put
// GetAsync - Get
// RemoveAsync - Delete

[ApiController]
[Route("api/[controller]")]
public class ChangeRequestController : ControllerBase
{
  private readonly ChangeRequestService _changeRequestService;
  private readonly IConfiguration _configuration;

  public ChangeRequestController(ChangeRequestService changeRequestService, IConfiguration configuration)
  {
    _changeRequestService = changeRequestService;
    _configuration = configuration;
  }

  [Authorize]
  [HttpGet]
  public async Task<List<ChangeRequest>> Get() =>
    await _changeRequestService.GetAsync();

  [HttpGet("{id:length(24)}")]
  public async Task<ActionResult<ChangeRequest>> Get(string id)
  {
    var request = await _changeRequestService.GetAsync(id);

    if (request is null)
    {
      return NotFound();
    }

    return request;
  }

  [HttpPost]
  public async Task<IActionResult> Post(ChangeRequest newRequest)
  {
    await _changeRequestService.CreateAsync(newRequest);

    return CreatedAtAction(nameof(Get), new { id = newRequest.Id }, newRequest); // return status and id of new request 
  }

  [HttpPut("{id:length(24)}")]
  public async Task<IActionResult> Update(string id, ChangeRequest updatedRequest)
  {
    var request = await _changeRequestService.GetAsync(id);

    if (request is null)
    {
      return NotFound();
    }

    updatedRequest.Id = request.Id;

    await _changeRequestService.UpdateAsync(id, updatedRequest);

    return NoContent();
  }

  [HttpDelete("{id:length(24)}")] // specify a parameter for action
  public async Task<IActionResult> Delete(string id)
  {
    var request = await _changeRequestService.GetAsync(id);

    if (request is null)
    {
      return NotFound();
    }

    await _changeRequestService.RemoveAsync(id);

    return NoContent();
  }

  [HttpDelete("all")]
  public async Task<IActionResult> DeleteAll()
  {
    var deletedCount = await _changeRequestService.DeleteAllAsync();
    return Ok(new { Deleted = deletedCount });
  }

  [HttpPost("login")]
  public IActionResult Login([FromBody] LoginRequest request)
  {
      // Validate user credentials (from DB or in-memory)
      if (request.Username != "admin" || request.Password != "password")
          return Unauthorized();

      var jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();

      var claims = new[]
      {
          new Claim(ClaimTypes.Name, request.Username),
          new Claim(ClaimTypes.Role, "Admin")
      };

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: jwtSettings.Issuer,
          audience: jwtSettings.Audience,
          claims: claims,
          expires: DateTime.Now.AddMinutes(30),
          signingCredentials: creds
      );

      return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
  }
}
