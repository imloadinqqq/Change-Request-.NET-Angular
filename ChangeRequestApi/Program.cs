using ChangeRequestApi.Models;
using ChangeRequestApi.Services;
using ChangeRequestApi.Auth;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<ChangeRequestDatabaseSettings>(
    builder.Configuration.GetSection("ChangeRequestDatabase"));

builder.Services.AddSingleton<ChangeRequestService>();

builder.Services.AddControllers()
  .AddJsonOptions(
      options => options.JsonSerializerOptions.PropertyNamingPolicy = null);
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen(c => {
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "ChangeRequest API", Version = "v1" });

  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Description = "JWT Authorization header using the Bearer scheme.",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.ApiKey,
    Scheme = "Bearer"
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
      Array.Empty<string>()
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
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
    };
});


// auth service
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<CookieAuthenticationOptions>(builder.Configuration.GetSection("CookieSettings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
      options.Path = "/swagger";
      options.DocumentPath = "/openapi/v1.json";
      options.DocumentTitle = "ChangeRequest API v1";
    });
}

app.UseHttpsRedirection();

// use our auth service
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
