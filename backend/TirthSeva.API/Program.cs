using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TirthSeva.API.Data;
using TirthSeva.API.Helpers;
using TirthSeva.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure SQL Server Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secret = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");

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
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
    };
});

builder.Services.AddAuthorization();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register Services
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<EmailHelper>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TempleService>();
builder.Services.AddScoped<BhaktnivasService>();
builder.Services.AddScoped<DarshanService>();
builder.Services.AddScoped<FoodServiceService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<PaymentService>();

// Add HttpClient for external API calls
builder.Services.AddHttpClient();

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Ensure database is created with latest schema
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        // Apply migrations
        context.Database.Migrate();
        
        // Seed data
        DbSeeder.SeedData(context);
        
        Console.WriteLine("Database initialized and seeded successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while seeding the database: {ex.Message}");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Ensure uploads directories exist
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
var templesPath = Path.Combine(uploadsPath, "temples");
var bhaktnivasPath = Path.Combine(uploadsPath, "bhaktnivas");

if (!Directory.Exists(templesPath))
{
    Directory.CreateDirectory(templesPath);
}
if (!Directory.Exists(bhaktnivasPath))
{
    Directory.CreateDirectory(bhaktnivasPath);
}

app.UseCors("AllowFrontend");

// Enable static file serving for uploaded images
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("=".PadRight(60, '='));
Console.WriteLine("TirthSeva API is running!");
Console.WriteLine("=".PadRight(60, '='));
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"API URL: https://localhost:7001");
Console.WriteLine($"Swagger UI: https://localhost:7001/swagger");
Console.WriteLine("=".PadRight(60, '='));
Console.WriteLine("\nTest Accounts Available:");
Console.WriteLine("- Admin: admin@tirthseva.com / Admin@123");
Console.WriteLine("- User: ramesh@example.com / User@123");
Console.WriteLine("- Provider 1: suresh@example.com / Provider@123");
Console.WriteLine("- Provider 2: mahesh@example.com / Provider@123");
Console.WriteLine("=".PadRight(60, '='));

app.Run();
