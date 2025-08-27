namespace ChangeRequestApi.Auth;

public class JwtSettings
{
  public string Issuer { get; set; } = null!;
  public string Audience { get; set; } = null!;
  public string Key { get; set; } = null!;
  public int ExpiryMinutes { get; set; }
}

public class CookieSettings
{
  public string LoginPath { get; set; } = null!;
  public string LogoutPath { get; set; } = null!;
  public int ExpireMinutes { get; set; }
}
