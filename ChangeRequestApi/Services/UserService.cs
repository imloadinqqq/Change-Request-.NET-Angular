using ChangeRequestApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChangeRequestApi.Services;

public class UserService
{
  private readonly IMongoCollection<User> _userCollection;

  public UserService(IOptions<UserDatabaseSettings> userDatabaseSettings)
  {
    var mongoClient = new MongoClient(
        userDatabaseSettings.Value.ConnectionString);

    var mongoDatabase = mongoClient.GetDatabase(
        userDatabaseSettings.Value.DatabaseName);

    _userCollection = mongoDatabase.GetCollection<User>(
        userDatabaseSettings.Value.UserCollectionName);
  }

  public async Task<User?> GetAsync(string id) =>
    await _userCollection.Find(x => x.Id == id).FirstOrDefaultAsync();


  public async Task CreateAsync(User newUser)
  {
    newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
    await _userCollection.InsertOneAsync(newUser);
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
}
