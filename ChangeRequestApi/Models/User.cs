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

  public class UpdateRoleObject 
  {
    public string NewRole { get; set; } = null!;
  }

  public class LoginRequestObject
  {
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
  }
}
