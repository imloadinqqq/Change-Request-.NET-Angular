using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using ChangeRequestApi.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace ChangeRequestApi.Controllers;

// CRUD OPERATIONS
// CreateAsync - Post
// UpdateAsync - Put
// GetAsync - Get
// RemoveAsync - Delete

// Roles
// Admin: Can GET,POST,PUT,DELETE
// Developer: Can GET (only if id matches submitted id), POST, PUT (matching id), DELETE (matching id)
// Supervisor: GET, PUT (update status)

[ApiController]
[Route("api/requests")]
public class ChangeRequestController : ControllerBase
{
  private readonly ChangeRequestService _changeRequestService;
  private readonly IConfiguration _configuration;

  public ChangeRequestController(ChangeRequestService changeRequestService, IConfiguration configuration)
  {
    _changeRequestService = changeRequestService;
    _configuration = configuration;
  }

  [Authorize(Roles = "Admin,Developer,Supervisor")]
  [HttpGet]
  public async Task<ActionResult<List<ChangeRequest>>> Get()
  {
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
      User.FindFirst("sub")?.Value;

    if (userId == null)
      return Unauthorized();

    List<ChangeRequest> requests;

    if (User.IsInRole("Developer"))
    {
      // see requests matching user id
      requests = await _changeRequestService.GetByUserIdAsync(userId);
    }
    else
    {
      requests = await _changeRequestService.GetAsync();
    }

    return requests;
  }

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

  [Authorize(Roles = "Admin,Developer,Supervisor")]
  [HttpPost]
  public async Task<IActionResult> Post(ChangeRequest newRequest)
  {
    // find userid from JWT claim
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
      User.FindFirst("sub")?.Value;

    if (userId == null)
      return Unauthorized();

    // populate change request user id field
    newRequest.UserId = userId;

    await _changeRequestService.CreateAsync(newRequest);

    return CreatedAtAction(nameof(Get), new { id = newRequest.Id }, newRequest); // return status and id of new request 
  }

  [Authorize (Roles = "Admin,Developer,Supervisor")]
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
}
