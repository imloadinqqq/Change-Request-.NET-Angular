using ChangeRequestApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChangeRequestApi.Services;

public class UserService
{
  private readonly IMongoCollection<User> _userCollection;

  public UserService(IOptions<UserDatabaseSettings> userDatabaseSettings)
  {
    var connectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING") 
                           ?? userDatabaseSettings.Value.ConnectionString;

    var mongoClient = new MongoClient(connectionString);
    var mongoDatabase = mongoClient.GetDatabase(userDatabaseSettings.Value.DatabaseName);

    _userCollection = mongoDatabase.GetCollection<User>(
        userDatabaseSettings.Value.UserCollectionName);
  }

  public async Task<User?> GetAsync(string id) =>
    await _userCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

  public async Task<List<User>> GetAllAsync() =>
    await _userCollection.Find(_ => true).ToListAsync();

  public async Task<User> CreateAsync(RegisterUserObject regis)
  {
    var newUser = new User
    {
      Username = regis.Username,
      Password = BCrypt.Net.BCrypt.HashPassword(regis.Password),
      Type = regis.Type ?? UserType.Developer
    };

    await _userCollection.InsertOneAsync(newUser);
    return newUser;
  }

  public async Task PatchAsync(string id, string newRole)
  {
    if (!Enum.TryParse<UserType>(newRole, ignoreCase: true, out var roleEnum))
    {
      throw new ArgumentException("Invalid role type");
    }

    var update = Builders<User>.Update.Set(u => u.Type, roleEnum);

    var res = await _userCollection.UpdateOneAsync(
      u => u.Id == id,
      update
    );

    if (res.MatchedCount == 0)
    {
      throw new KeyNotFoundException("User not found");
    }
  }

  public async Task<User?> GetByCredentialsAsync(string username, string password)
  {
      var user = await _userCollection.Find(u => u.Username == username).FirstOrDefaultAsync();

      if (user is null) 
          return null;

      if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
          return null;

      return user;
  }

  public async Task<User?> GetByUsernameAsync(string username)
  {
    var user = await _userCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
    if (user is null)
      return null;

    return user;
  }

  public async Task<UserStatsObject> GetUserStatsAsync()
  {
    var total = await _userCollection.CountDocumentsAsync(FilterDefinition<User>.Empty);

    var groupResult = await _userCollection.Aggregate()
      .Group(u => u.Type, g => new { Role = g.Key, Count = g.Count() })
      .ToListAsync();

    var stats = new UserStatsObject
    {
      TotalUsers = (int)total
    };

    foreach (var item in groupResult)
    {
      stats.UsersByRole[item.Role.ToString()] = item.Count;
    }

    return stats;
  }
}
