using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using ChangeRequestApi.Auth;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Logging;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Text;

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
                      policy.WithOrigins("http://localhost:4200");
                    });
});

builder.Services.AddSingleton<ChangeRequestService>();
builder.Services.AddSingleton<UserService>();

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

app.UseHttpsRedirection();
app.UseCors();

// use our auth service
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
