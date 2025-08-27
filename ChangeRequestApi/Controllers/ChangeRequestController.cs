using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using ChangeRequestApi.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Configuration;
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

  [Authorize(Roles = "Admin")]
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
}
