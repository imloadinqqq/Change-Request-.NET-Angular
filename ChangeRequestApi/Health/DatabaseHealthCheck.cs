namespace ChangeRequestApi.Health;
using MongoDB.Driver;

public class UserMongoClient
{
    public IMongoClient Client { get; }
    public UserMongoClient(IMongoClient client) => Client = client;
}

public class ChangeRequestMongoClient
{
    public IMongoClient Client { get; }
    public ChangeRequestMongoClient(IMongoClient client) => Client = client;
}
