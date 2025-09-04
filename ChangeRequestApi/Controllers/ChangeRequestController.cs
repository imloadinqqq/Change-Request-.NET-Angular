using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

  [Authorize (Roles = "Admin,Supervisor")]
  [HttpPatch("{id:length(24)}/status")]
  public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusObject obj)
  {
    try
    {
      var request = await _changeRequestService.GetByRequestIdAsync(id);
      if (request == null)
        return NotFound("Request not found");

      if (request.Status == RequestStatus.Pending)
        return BadRequest("Cannot change status while request is pending");

      await _changeRequestService.PatchStatusAsync(id, obj.NewStatus);
      return Ok("Status updated successfully");
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

  [HttpPost("{requestId}/approve")]
  [Authorize(Roles = "Admin,Supervisor")]
  public async Task<IActionResult> ApproveRequest(string requestId)
  {
    try 
    {
      var approverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
               User.FindFirst("sub")?.Value;
      var updatedRequest = await _changeRequestService.ApproveRequestAsync(requestId, approverId!);

      if (updatedRequest == null)
        return NotFound(new { message = "Request not found" });

      return Ok(updatedRequest);
    } catch (InvalidOperationException) 
    {
      return Conflict(new { message = "Request has been processed." });
    }
  }

  [HttpPost("{requestId}/reject")]
  [Authorize(Roles = "Admin,Supervisor")]
  public async Task<IActionResult> RejectRequest(string requestId)
  {
    try 
    {
      var approverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
               User.FindFirst("sub")?.Value;
      var updatedRequest = await _changeRequestService.RejectRequestAsync(requestId, approverId!);
      // if (updatedRequest == null)
      //   return NotFound(new { message = "Request not found" });

      return Ok(updatedRequest);
    } catch (InvalidOperationException)
    {
      return Conflict(new { message = "Request has been processed." });
    }
  }

  [Authorize (Roles = "Admin")]
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

  [Authorize (Roles = "Admin")]
  [HttpDelete("all")]
  public async Task<IActionResult> DeleteAll()
  {
    var deletedCount = await _changeRequestService.DeleteAllAsync();
    return Ok(new { Deleted = deletedCount });
  }
}
