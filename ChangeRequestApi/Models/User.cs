using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace ChangeRequestApi.Models
{
  public enum UserType
  {
    Admin = 0,
    Developer = 1,
    Supervisor = 2
  }

  public class User
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("Id")]
    public string? Id { get; set; }

    [BsonElement("username")]
    [JsonPropertyName("Username")]
    public string Username { get; set; } = null!;

    [BsonElement("password")]
    [JsonPropertyName("Password")]
    public string Password { get; set; } = null!;

    [BsonElement("usertype")]
    [JsonPropertyName("UserType")]
    public UserType Type { get; set; } = UserType.Developer;

    [BsonElement("isApproved")]
    [JsonPropertyName("IsApproved")]
    public bool IsApproved { get; set; } = false;

  }

  public class Login
  {
    [JsonPropertyName("username")]
    public string Username { get; set; } = null!;

    [JsonPropertyName("password")]
    public string Password { get; set; } = null!;
  }

  public class RegisterUserObject
  {
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
  }

  public class RegisterAdminObject
  {
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public UserType Type { get; set; } = UserType.Admin;
  }


  public class UpdateRoleObject 
  {
    public string NewRole { get; set; } = null!;
  }

  public class LoginRequestObject
  {
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
  }

  public class UserStatsObject
  {
    public int TotalUsers { get; set; }
    public Dictionary<string, int> UsersByRole { get; set; } = new();
  }

  public class UserProfileObject
  {
    public string Id { get; set; } = null!;
    public string Username { get; set; } = null!;
    public UserType Type { get; set; }
  }
}
