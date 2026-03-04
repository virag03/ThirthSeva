# OOP Concepts Used in TirthSeva (.NET Backend)

This document highlights **where and how object-oriented programming (OOP)** is used in the **TirthSeva ASP.NET Core (.NET 8)** backend.

---

## Encapsulation

Encapsulation means **bundling data + behavior together** and **hiding internal details** behind a clear public API.

- **Service classes encapsulate business logic**
  - `AuthService` encapsulates registration/login/OTP verification logic, and exposes it through methods like `RegisterAsync`, `LoginAsync`, `VerifyOTPAsync`.
  - `BookingService` encapsulates booking validation, booking creation, and booking status updates.

- **Private fields hide internal dependencies**
  - Controllers and services keep dependencies private and only expose public endpoints/methods.

Example (private fields + public methods):

```csharp
// backend/TirthSeva.API/Services/AuthService.cs
public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly JwtHelper _jwtHelper;
    private readonly EmailHelper _emailHelper;

    public AuthService(ApplicationDbContext context, JwtHelper jwtHelper, EmailHelper emailHelper)
    {
        _context = context;
        _jwtHelper = jwtHelper;
        _emailHelper = emailHelper;
    }

    public async Task<LoginResponse?> RegisterAsync(RegisterRequest request) { /* ... */ }
    public async Task<LoginResponse?> LoginAsync(LoginRequest request) { /* ... */ }
}
```

---

## Abstraction

Abstraction is about **exposing only what’s necessary** and **separating responsibilities** so each part of the system stays simple.

In this project, abstraction shows up strongly via **layering**:

- **Controllers**: handle HTTP + request/response concerns (presentation/API layer)
- **Services**: contain business rules and workflows (domain/business layer)
- **DbContext + Models**: contain persistence mapping (data access layer)
- **DTOs**: shape data for API contracts, hiding internal entity structure

Examples:

- `AuthController` calls into `AuthService` instead of containing registration logic itself.
- DTOs like `RegisterRequest`, `LoginResponse` (in `backend/TirthSeva.API/DTOs/`) abstract the public API contract away from the internal EF models.

---

## Inheritance

Inheritance is used where a type **extends** a base type and inherits its behavior.

- **All controllers inherit `ControllerBase`** (framework inheritance)
  - This provides ASP.NET Core features like `Ok()`, `BadRequest()`, model-binding, etc.

Example:

```csharp
// backend/TirthSeva.API/Controllers/AuthController.cs
[ApiController]
public class AuthController : ControllerBase
{
    // ...
}
```

- **`ApplicationDbContext` inherits from `DbContext`**
  - This is the foundation of Entity Framework Core OOP design.

Example:

```csharp
// backend/TirthSeva.API/Data/ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
}
```

---

## Polymorphism

Polymorphism means “many forms”: a base type reference can represent derived types, and virtual/overridden methods can change behavior.

This project uses polymorphism mainly through the framework and EF Core:

- **Method overriding**
  - `ApplicationDbContext` overrides `OnModelCreating(ModelBuilder modelBuilder)` to customize EF Core mappings.

Example:

```csharp
// backend/TirthSeva.API/Data/ApplicationDbContext.cs
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    // custom configuration...
}
```

- **Virtual navigation properties in EF entities**
  - Models like `Booking` use `virtual` navigation properties (e.g., `virtual User User`) which EF can use for lazy-loading proxies (depending on configuration).

Example:

```csharp
// backend/TirthSeva.API/Models/Booking.cs
public virtual User User { get; set; } = null!;
public virtual Temple Temple { get; set; } = null!;
public virtual Payment? Payment { get; set; }
```

---

## Composition (Has-a) + Dependency Injection (DI)

Composition is a core OOP idea: objects are built from other objects (“has-a” relationship).

Your backend uses **constructor injection** + DI container registrations to compose the app:

- Controllers “have a” service (e.g., `AuthController` has an `AuthService`)
- Services “have a” `ApplicationDbContext` and helpers like `JwtHelper`, `EmailHelper`

DI wiring in `Program.cs`:

```csharp
// backend/TirthSeva.API/Program.cs
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<EmailHelper>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<BookingService>();
```

Controller composition example:

```csharp
// backend/TirthSeva.API/Controllers/BookingsController.cs
public BookingsController(BookingService bookingService, IConfiguration configuration, ApplicationDbContext context)
{
    _bookingService = bookingService;
    _configuration = configuration;
    _context = context;
}
```

This approach improves:

- testability (swap dependencies)
- separation of concerns
- maintainability

---

## Data Modeling as OOP Classes (Entities)

Database tables are modeled as **C# classes** (EF Core entities). This is classic OOP modeling:

- **State**: properties like `BookingStatus`, `TotalAmount`, `CheckInDate`
- **Relationships**: navigation properties `User`, `Temple`, `Payment`

Example entity:

```csharp
// backend/TirthSeva.API/Models/Booking.cs
public class Booking
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TempleId { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentStatus { get; set; } = "Pending";
    public string BookingStatus { get; set; } = "Confirmed";
    // ...
}
```

---

## SOLID (OOP design principles) in this project

Even if you didn’t explicitly label it, several SOLID ideas appear in the structure:

- **S (Single Responsibility Principle)**:
  - Controllers focus on HTTP endpoints.
  - Services focus on business logic.
  - `JwtHelper` focuses only on token generation/validation.

- **D (Dependency Inversion Principle)**:
  - High-level flow depends on injected dependencies (via DI container) rather than hard-coded “new” everywhere.

---

## Interview-ready 30-second summary

**“In my TirthSeva .NET backend, OOP is used through a layered architecture: controllers inherit from `ControllerBase` and delegate work to service classes like `AuthService` and `BookingService`, which encapsulate business rules. Entity Framework Core models the domain using entity classes and a `DbContext` (`ApplicationDbContext : DbContext`) where I override `OnModelCreating`—that’s inheritance + polymorphism. The whole app is composed using dependency injection in `Program.cs`, which keeps the design modular and maintainable.”**

---

## Security note (important)

Your `appsettings.json` currently contains real secrets (email password / JWT secret). For real deployment, move these to **environment variables** and keep `appsettings.json` non-sensitive.

