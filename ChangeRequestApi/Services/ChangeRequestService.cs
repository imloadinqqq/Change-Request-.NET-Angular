using ChangeRequestApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChangeRequestApi.Services;

public class ChangeRequestService
{
  private readonly IMongoCollection<ChangeRequest> _changeCollection;
  public static int Count = 0;

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

  public async Task<List<ChangeRequest>> GetAsync() {
    Interlocked.Increment(ref Count);
    return await _changeCollection.Find(_ => true).ToListAsync();
  }

  public async Task<ChangeRequest?> GetAsync(string id) {
    Interlocked.Increment(ref Count);
    return await _changeCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
  }

  public async Task<ChangeRequest?> GetByIdAsync(string id)
  {
    Interlocked.Increment(ref Count);
    return await _changeCollection
      .Find(x => x.Id == id)
      .FirstOrDefaultAsync();
  }

  public async Task CreateAsync(ChangeRequest newRequest) {
    Interlocked.Increment(ref Count);
    await _changeCollection.InsertOneAsync(newRequest);
  }

  public async Task UpdateAsync(string id, ChangeRequest updatedRequest) {
    Interlocked.Increment(ref Count);
    await _changeCollection.ReplaceOneAsync(x => x.Id == id, updatedRequest);
  }

  public async Task PatchStatusAsync(string id, string newStatus)
  {
    Interlocked.Increment(ref Count);
    if (!Enum.TryParse<RequestStatus>(newStatus, ignoreCase: true, out var statusEnum))
    {
      throw new ArgumentException("Invalid status");
    }

    var update = Builders<ChangeRequest>.Update.Set(x => x.Status, statusEnum);

    var res = await _changeCollection.UpdateOneAsync(
        x => x.Id == id,
        update
    );

    if (res.MatchedCount == 0)
    {
      throw new KeyNotFoundException("Change request not found");
    }
  }

  public async Task RemoveAsync(string id) {
    Interlocked.Increment(ref Count);
    await _changeCollection.DeleteOneAsync(x => x.Id == id);
  }

  public async Task<long> DeleteAllAsync()
  {
    Interlocked.Increment(ref Count);
    var result = await _changeCollection.DeleteManyAsync(FilterDefinition<ChangeRequest>.Empty);
    return result.DeletedCount;
  }

  public async Task<ChangeRequest?> ApproveRequestAsync(string id, string approverId)
  {
    Interlocked.Increment(ref Count);

    var filter = Builders<ChangeRequest>.Filter.Eq(x => x.Id, id);

    var update = Builders<ChangeRequest>.Update
      .Set(x => x.Status, RequestStatus.Approved)
      .Set(x => x.ApprovedById, approverId);

    var res = await _changeCollection.FindOneAndUpdateAsync(
      x => x.Id == id && x.Status == RequestStatus.Pending,
      update
    );

    if (res == null)
    {
      var exists = await _changeCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
      if (exists == null)
        return null;
      throw new InvalidOperationException("Already processed.");
    } 

    return res;
  }

  public async Task<ChangeRequest?> RejectRequestAsync(string id, string approverId)
  {
    Interlocked.Increment(ref Count);

    var filter = Builders<ChangeRequest>.Filter.Eq(x => x.Id, id);

    var update = Builders<ChangeRequest>.Update
      .Set(x => x.Status, RequestStatus.Rejected)
      .Set(x => x.ApprovedById, approverId);

    var res = await _changeCollection.FindOneAndUpdateAsync(
      x => x.Id == id && x.Status == RequestStatus.Pending,
      update
    );

    if (res == null)
    {
      var exists = await _changeCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
      if (exists == null)
        return null;
      throw new InvalidOperationException("Already processed.");
    } 

    return res;
  }


}
