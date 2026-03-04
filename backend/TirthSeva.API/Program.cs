using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TirthSeva.API.Data;
using TirthSeva.API.Helpers;
using TirthSeva.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Listen on PORT when set (e.g. Render, Heroku)
//var builder = WebApplication.CreateBuilder(args);



// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure SQL Server Database
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
   //for-mssql-server-DB options.UseSqlServer(connectionString));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));


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
              .AllowAnyMethod();
              //.AllowCredentials();
    });
});

// Register Services
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<EmailHelper>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TempleService>();
builder.Services.AddScoped<BhaktnivasService>();
builder.Services.AddScoped<DarshanService>();

builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<UserService>();

// Add HttpClient for external API calls
builder.Services.AddHttpClient();

var app = builder.Build();

// Initialize database - CHANGED THIS SECTION
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        //mssql-vala  var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Only use Migrate() - Remove EnsureDeleted() and EnsureCreated()
        // Migrate will apply any pending migrations and create database if it doesn't exist
        context.Database.Migrate();
        
        // Now seed the data
        DbSeeder.SeedData(context);
        
        Console.WriteLine("Database initialized and seeded successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while seeding the database: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
}


// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

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

// Enable static file serving for uploaded images
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    //mssqlvalavar context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Check if admin exists
    var admin = context.Users.FirstOrDefault(u => u.Email == "admin@tirthseva.com" && u.Role == "Admin");
    if (admin == null)
    {
        var adminUser = new TirthSeva.API.Models.User
        {
            Name = "Admin User",
            Email = "admin@tirthseva.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin",
            IsEmailVerified = true,
            CreatedAt = DateTime.UtcNow
        };
        
        context.Users.Add(adminUser);
        context.SaveChanges();
        Console.WriteLine("MANUAL: Admin user created!");
    }
    else
    {
        Console.WriteLine($"MANUAL: Admin exists. Total users: {context.Users.Count()}");
    }
}

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
