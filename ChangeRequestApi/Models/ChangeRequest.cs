using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace ChangeRequestApi.Models
{
  public enum RequestStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    InProgress = 3,
    Completed = 4
  }

  public enum RequestPriority {
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
  }

  public class ChangeRequest
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("Id")]
    public string? Id { get; set; }

    [BsonElement("title")]
    [JsonPropertyName("Title")]
    public string Title { get; set; } = null!;

    [BsonElement("description")]
    [JsonPropertyName("Description")]
    public string Description { get; set; } = null!;

    [BsonElement("status")]
    [JsonPropertyName("Status")]
    public RequestStatus Status { get; set; } = RequestStatus.Pending;

    [BsonElement("priority")]
    [JsonPropertyName("Priority")]
    public RequestPriority Priority { get; set; } = RequestPriority.Medium;

    [BsonElement("targetDate")]
    [BsonRepresentation(BsonType.DateTime)]
    [JsonPropertyName("Target Date")]
    public DateTime? TargetDate { get; set; }

    [BsonElement("approvedById")]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("Id of Approver")]
    public string? ApprovedById { get; set; }
  }
}
