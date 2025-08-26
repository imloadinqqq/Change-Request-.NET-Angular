namespace ChangeRequestApi.Models;

public class ChangeRequestDatabaseSettings
{
  public string ConnectionString { get; set; } = null!;
  
  public string DatabaseName { get; set; } = null!;

  public string ChangeRequestCollectionName { get; set; } = null!;
}
