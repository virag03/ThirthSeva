using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TirthSeva.API.Data;
using TirthSeva.API.Helpers;
using TirthSeva.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ================= DATABASE CONFIGURATION (PostgreSQL) =================

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// ================= JWT AUTHENTICATION =================

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

// ================= CORS =================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ================= REGISTER SERVICES =================

builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<EmailHelper>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TempleService>();
builder.Services.AddScoped<BhaktnivasService>();
builder.Services.AddScoped<DarshanService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<UserService>();

builder.Services.AddHttpClient();

var app = builder.Build();

// ================= AUTO MIGRATION & SEED =================

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        // Apply migrations automatically
        context.Database.Migrate();

        // Seed initial data
        DbSeeder.SeedData(context);

        // Create Admin if not exists
        var admin = context.Users
            .FirstOrDefault(u => u.Email == "admin@tirthseva.com" && u.Role == "Admin");

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

            Console.WriteLine("Admin user created successfully.");
        }

        Console.WriteLine("Database migrated & seeded successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization error: {ex.Message}");
    }
}

// ================= MIDDLEWARE PIPELINE =================

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

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("==============================================");
Console.WriteLine("TirthSeva API is running...");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");
Console.WriteLine("==============================================");

app.Run();