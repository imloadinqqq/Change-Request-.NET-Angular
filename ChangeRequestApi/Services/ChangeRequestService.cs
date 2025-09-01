using ChangeRequestApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChangeRequestApi.Services;

public class ChangeRequestService
{
  private readonly IMongoCollection<ChangeRequest> _changeCollection;

  public ChangeRequestService(IOptions<ChangeRequestDatabaseSettings> changeRequestDatabaseSettings)
  {
    var connectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING") 
                           ?? changeRequestDatabaseSettings.Value.ConnectionString;

    var mongoClient = new MongoClient(connectionString);

    var mongoDatabase = mongoClient.GetDatabase(
        changeRequestDatabaseSettings.Value.DatabaseName);

    _changeCollection = mongoDatabase.GetCollection<ChangeRequest>(
        changeRequestDatabaseSettings.Value.ChangeRequestCollectionName);
  }

  // CRUD operations

  public async Task<List<ChangeRequest>> GetAsync() =>
    await _changeCollection.Find(_ => true).ToListAsync();

  public async Task<ChangeRequest?> GetAsync(string id) =>
    await _changeCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

  public async Task<List<ChangeRequest>> GetByUserIdAsync(string userId) =>
    await _changeCollection.Find(x => x.UserId == userId).ToListAsync();

  public async Task CreateAsync(ChangeRequest newRequest) =>
    await _changeCollection.InsertOneAsync(newRequest);

  public async Task UpdateAsync(string id, ChangeRequest updatedRequest) =>
    await _changeCollection.ReplaceOneAsync(x => x.Id == id, updatedRequest);

  public async Task RemoveAsync(string id) =>
    await _changeCollection.DeleteOneAsync(x => x.Id == id);

  public async Task<long> DeleteAllAsync()
  {
    var result = await _changeCollection.DeleteManyAsync(FilterDefinition<ChangeRequest>.Empty);
    return result.DeletedCount;
  }

  public async Task<ChangeRequest?> ApproveRequestAsync(string id, string approverId)
  {
    var update = Builders<ChangeRequest>.Update
      .Set(x => x.Status, RequestStatus.Approved)
      .Set(x => x.ApprovedById, approverId);

    var res = await _changeCollection.FindOneAndUpdateAsync(x => x.Id == id, update, new FindOneAndUpdateOptions<ChangeRequest>
    {
      ReturnDocument = ReturnDocument.After
    });

    return res;
  }
}
