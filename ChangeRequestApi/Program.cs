using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using ChangeRequestApi.Auth;
using ChangeRequestApi.Health;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text;


var appStartTime = DateTime.UtcNow;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


// settings
builder.Services.Configure<ChangeRequestDatabaseSettings>(
    builder.Configuration.GetSection("ChangeRequestDatabase"));

builder.Services.Configure<UserDatabaseSettings>(
    builder.Configuration.GetSection("UserDatabase"));

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));

// services
builder.Services.AddCors(options => {
  options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy =>
                    {
                      policy.WithOrigins("http://localhost:8080", "http://frontend:8080")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
                    });
});

// 
builder.Services.AddSingleton<ChangeRequestService>();
builder.Services.AddSingleton<UserService>();

builder.Services.AddSingleton<UserMongoClient>(sp =>
{
    var userSettings = sp.GetRequiredService<IOptions<UserDatabaseSettings>>().Value;
    return new UserMongoClient(new MongoClient(userSettings.ConnectionString));
});

builder.Services.AddSingleton<ChangeRequestMongoClient>(sp =>
{
    var crSettings = sp.GetRequiredService<IOptions<ChangeRequestDatabaseSettings>>().Value;
    return new ChangeRequestMongoClient(new MongoClient(crSettings.ConnectionString));
});


builder.Services.AddHealthChecks()
  .AddMongoDb(
      sp => sp.GetRequiredService<UserMongoClient>().Client,
      databaseNameFactory: sp => sp.GetRequiredService<IOptions<UserDatabaseSettings>>().Value.DatabaseName,
      name: "user-mongodb"
  )
  .AddMongoDb(
      sp => sp.GetRequiredService<ChangeRequestMongoClient>().Client,
      databaseNameFactory: sp => sp.GetRequiredService<IOptions<ChangeRequestDatabaseSettings>>().Value.DatabaseName,
      name: "change-request-mongodb"
);

builder.Services.AddControllers()
  .AddJsonOptions(options => {
  options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
  options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddSwaggerGen(c => {
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "ChangeRequest API", Version = "v1" });

  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Description = "JWT Authorization header using the Bearer scheme.",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT"
  });

  c.AddSecurityRequirement(new OpenApiSecurityRequirement
  {
    {
      new OpenApiSecurityScheme
      {
        Reference = new OpenApiReference
        {
          Type = ReferenceType.SecurityScheme,
          Id = "Bearer"
        }
      },
      new string[] {}
    }
  });
});

// Jwt
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.Events = new JwtBearerEvents
  {
    // ILogger API
    OnAuthenticationFailed = ctx =>
    {
      var logger = ctx.HttpContext.RequestServices
        .GetRequiredService<ILoggerFactory>()
        .CreateLogger("JwtBearer");
      logger.LogWarning(ctx.Exception, "JWT authentication failed.");
      return Task.CompletedTask;
    },
    OnTokenValidated = ctx =>
    {
      var logger = ctx.HttpContext.RequestServices
        .GetRequiredService<ILoggerFactory>()
        .CreateLogger("JwtBearer");
      logger.LogInformation("JWT validated for {Token}", ctx.SecurityToken);
      return Task.CompletedTask;
    }
  };
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = jwtSettings!.Issuer,
    ValidAudience = jwtSettings.Audience,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
    ClockSkew = TimeSpan.Zero
  };
});

// auth service
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<CookieAuthenticationOptions>(builder.Configuration.GetSection("CookieSettings"));
builder.Services.AddAuthorization();

var app = builder.Build();

// seed default admin
using (var scope = app.Services.CreateScope())
{
  var userService = scope.ServiceProvider.GetRequiredService<UserService>();

  var allUsers = userService.GetAllAsync().GetAwaiter().GetResult();
  if (!allUsers.Any())
  {
    var adminUser = new RegisterUserObject
    {
      Username = "admin",
      Password = "password1234",
    };

    await userService.CreateAdminAsync("admin", "password1234");
    Console.WriteLine("Default admin created: admin / password1234");
  }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI(c =>
  {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ChangeRequest API v1");
    c.RoutePrefix = "swagger";
  });
}

// app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

builder.WebHost.UseUrls("http://0.0.0.0:3000");
// use our auth service
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
  ResponseWriter = async (context, report) =>
  {
    context.Response.ContentType = "application/json";
    var uptime = DateTime.UtcNow - appStartTime;
    var result = JsonSerializer.Serialize(new
    {
      status = report.Status.ToString(),
      uptime = uptime.ToString(@"dd\.hh\:mm\:ss"),
      checks = report.Entries.Select(e => new {
        name = e.Key,
        status = e.Value.Status.ToString(),
        exception = e.Value.Exception?.Message,
        duration = e.Value.Duration.ToString()
      })
    });
    await context.Response.WriteAsync(result);
  }
});

app.MapControllers();

app.Run();
