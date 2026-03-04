# TirthSeva - Complete Project Architecture & Interview Guide

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Technology Stack](#4-technology-stack)
5. [Overall Architecture](#5-overall-architecture)
6. [Spring Boot Backend Architecture](#6-spring-boot-backend-architecture)
7. [.NET Backend Architecture](#7-net-backend-architecture)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Database Schema](#9-database-schema)
10. [Key Features & Flows](#10-key-features--flows)
11. [Interview Talking Points](#11-interview-talking-points)

---

## 1. Project Overview

### Project Name
**TirthSeva** - A comprehensive temple pilgrimage services platform

### Project Description
TirthSeva is a full-stack web application designed to facilitate temple pilgrimage services, enabling users to book Darshan slots and Bhaktnivas (accommodation) near temples. The platform serves three types of users: **Pilgrims (Users)**, **Service Providers**, and **Administrators**.

### Core Value Proposition
- **For Pilgrims**: Easy discovery and booking of Darshan slots and accommodation near temples
- **For Service Providers**: Platform to list temples, manage Darshan slots, and offer Bhaktnivas accommodations
- **For Administrators**: Complete oversight and management of the platform

---

## 2. Problem Statement

### Challenges Addressed

1. **Fragmented Booking Experience**
   - Traditional temple visits require separate arrangements for Darshan and accommodation
   - No centralized platform for temple-related services
   - Lack of real-time availability information

2. **Manual Management Overhead**
   - Service providers struggle with manual slot management
   - No automated system for capacity tracking
   - Difficult to manage multiple temples and accommodations

3. **Trust & Verification Issues**
   - No standardized verification process for users
   - Lack of secure payment integration
   - No reliable booking confirmation system

4. **Geographic Discovery**
   - Difficult to find temples and accommodations in specific locations
   - No integrated mapping solution
   - Limited search and filter capabilities

---

## 3. Solution Overview

### Our Solution

TirthSeva provides a **unified digital platform** that addresses all these challenges:

1. **Centralized Booking System**
   - Single platform for Darshan slots and Bhaktnivas booking
   - Real-time availability tracking
   - Automated capacity management

2. **Multi-Role Architecture**
   - **User Role**: Browse, search, and book services
   - **ServiceProvider Role**: Manage temples, Darshan slots, and Bhaktnivas listings
   - **Admin Role**: Platform-wide management and oversight

3. **Secure Authentication & Authorization**
   - Email-based OTP verification
   - JWT-based stateless authentication
   - Role-based access control (RBAC)

4. **Payment Integration**
   - Razorpay payment gateway integration
   - Secure transaction processing
   - Payment status tracking

5. **Geographic Features**
   - Interactive maps using Leaflet/MapLibre
   - Location-based search
   - State and city filtering

6. **Dual Backend Support**
   - Spring Boot (Java) backend
   - .NET 8.0 (C#) backend
   - Both backends provide identical API contracts

---

## 4. Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 7.3.0
- **Routing**: React Router DOM 6.20.1
- **HTTP Client**: Axios 1.6.2
- **UI Framework**: Bootstrap 5.3.2, React Bootstrap 2.9.1
- **Maps**: Leaflet 1.9.4, React Leaflet 4.2.1, MapLibre GL 5.16.0
- **Notifications**: React Toastify 11.0.5
- **Icons**: Bootstrap Icons 1.11.2
- **Geocoding**: Geoapify React Geocoder Autocomplete 2.0

### Spring Boot Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0
- **Email**: Spring Mail (SMTP)
- **API Documentation**: Springdoc OpenAPI (Swagger) 2.3.0
- **JWT Library**: JJWT 0.12.3
- **Password Hashing**: BCrypt (Spring Security Crypto)
- **Build Tool**: Maven
- **Validation**: Jakarta Validation

### .NET Backend
- **Framework**: ASP.NET Core 8.0
- **Language**: C# (.NET 8.0)
- **ORM**: Entity Framework Core 8.0
- **Database**: SQL Server (LocalDB) / MySQL compatible
- **Authentication**: JWT Bearer Authentication
- **Email**: MailKit 4.3.0
- **API Documentation**: Swashbuckle (Swagger) 6.5.0
- **Password Hashing**: BCrypt.Net-Next 4.0.3
- **Build Tool**: .NET CLI / MSBuild

### Database
- **Primary**: MySQL 8.0 (Spring Boot) / SQL Server LocalDB (.NET)
- **Schema**: Relational database with 7 core tables
- **Migrations**: EF Core Migrations (.NET) / Hibernate DDL (Spring Boot)

### DevOps & Tools
- **Version Control**: Git
- **Package Managers**: npm (Frontend), Maven (Spring Boot), NuGet (.NET)
- **Development Environment**: VS Code / Visual Studio / IntelliJ IDEA

---

## 5. Overall Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React 18 + Vite + React Router + Axios + Bootstrap         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │   User   │  │Provider │  │  Admin   │                   │
│  │  Pages   │  │  Pages  │  │  Pages   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (JWT Authentication)
                            │
        ┌───────────────────┴───────────────────┐
        │                                         │
┌───────▼────────┐                    ┌─────────▼────────┐
│ Spring Boot    │                    │   .NET 8.0 API    │
│   Backend      │                    │     Backend       │
│                │                    │                   │
│ ┌───────────┐  │                    │  ┌─────────────┐ │
│ │ Controllers│ │                    │  │ Controllers  │ │
│ └───────────┘  │                    │  └─────────────┘ │
│ ┌───────────┐  │                    │  ┌─────────────┐ │
│ │  Services │  │                    │  │   Services  │ │
│ └───────────┘  │                    │  └─────────────┘ │
│ ┌───────────┐  │                    │  ┌─────────────┐ │
│ │Repositories│ │                    │  │   DbContext │ │
│ └───────────┘  │                    │  └─────────────┘ │
│ ┌───────────┐  │                    │  ┌─────────────┐ │
│ │ Security  │  │                    │  │   JWT Helper │ │
│ └───────────┘  │                    │  └─────────────┘ │
└───────┬────────┘                    └─────────┬────────┘
        │                                         │
        └───────────────────┬─────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Database      │
                    │   MySQL/SQL     │
                    │   Server        │
                    └─────────────────┘
```

### Architecture Patterns

1. **Layered Architecture**
   - **Presentation Layer**: React Frontend
   - **API Layer**: REST Controllers
   - **Business Logic Layer**: Services
   - **Data Access Layer**: Repositories (Spring) / DbContext (EF Core)
   - **Database Layer**: MySQL/SQL Server

2. **Separation of Concerns**
   - Controllers handle HTTP requests/responses
   - Services contain business logic
   - Repositories/DbContext handle data access
   - DTOs for data transfer

3. **Stateless Authentication**
   - JWT tokens stored client-side (localStorage)
   - No server-side session storage
   - Token validation on each request

4. **RESTful API Design**
   - Resource-based URLs
   - HTTP methods (GET, POST, PUT, DELETE)
   - JSON request/response format

---

## 6. Spring Boot Backend Architecture

### Project Structure

```
backend-spring/
├── src/
│   └── main/
│       ├── java/com/tirthseva/api/
│       │   ├── controller/          # REST Controllers
│       │   ├── service/              # Business Logic
│       │   ├── repository/           # Data Access Layer
│       │   ├── entity/               # JPA Entities
│       │   ├── dto/                  # Data Transfer Objects
│       │   ├── security/             # Security Configuration
│       │   ├── config/               # Configuration Classes
│       │   ├── util/                 # Utility Classes
│       │   └── exception/            # Exception Handlers
│       └── resources/
│           └── application.properties # Configuration
└── pom.xml                           # Maven Dependencies
```

### Key Components

#### 1. Controllers (REST API Endpoints)

**AuthController**
- `POST /api/auth/register` - User registration with OTP generation
- `POST /api/auth/login` - User authentication
- `POST /api/auth/verify-otp` - Email OTP verification
- `POST /api/auth/resend-otp` - Resend OTP email
- `GET /api/auth/me` - Get current user profile

**TemplesController**
- `GET /api/temples` - Get all temples (public)
- `GET /api/temples/{id}` - Get temple by ID
- `GET /api/temples/search` - Search temples by query/state/city
- `GET /api/temples/states` - Get all states
- `GET /api/temples/cities/{state}` - Get cities by state
- `POST /api/temples` - Create temple (ServiceProvider)
- `PUT /api/temples/{id}` - Update temple (ServiceProvider)
- `DELETE /api/temples/{id}` - Delete temple (ServiceProvider/Admin)

**DarshanController**
- `GET /api/darshan/available` - Get available Darshan slots
- `POST /api/darshan` - Create Darshan slot (ServiceProvider)
- `PUT /api/darshan/{id}` - Update Darshan slot
- `DELETE /api/darshan/{id}` - Delete Darshan slot

**BhaktnivasController**
- `GET /api/bhaktnivas` - Get all Bhaktnivas listings
- `GET /api/bhaktnivas/{id}` - Get Bhaktnivas by ID
- `GET /api/bhaktnivas/temple/{templeId}` - Get Bhaktnivas by temple
- `POST /api/bhaktnivas` - Create Bhaktnivas listing (ServiceProvider)
- `PUT /api/bhaktnivas/{id}` - Update Bhaktnivas
- `DELETE /api/bhaktnivas/{id}` - Delete Bhaktnivas

**BookingsController**
- `POST /api/bookings/confirm-and-book` - Create booking with payment
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/provider` - Get provider's bookings
- `PUT /api/bookings/{id}/status` - Update booking status
- `DELETE /api/bookings/{id}` - Cancel booking

**PaymentsController**
- `POST /api/payments/verify` - Verify payment transaction
- `GET /api/payments/history` - Get payment history

**UsersController** (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `DELETE /api/users/{id}` - Delete user
- `PUT /api/users/{id}/role` - Update user role

#### 2. Services (Business Logic Layer)

**AuthService**
- User registration with OTP generation
- Password hashing using BCrypt
- JWT token generation
- OTP verification logic
- Email sending via JavaMailSender

**TempleService**
- Temple CRUD operations
- Search and filtering logic
- State/city aggregation
- Image upload handling

**DarshanService**
- Darshan slot management
- Availability calculation
- Slot capacity tracking
- Date-based filtering

**BhaktnivasService**
- Bhaktnivas CRUD operations
- Availability slot management
- Price calculation
- Capacity validation

**BookingService**
- Booking creation with transaction management
- Availability validation before booking
- Slot capacity decrement (atomic operation)
- Booking status management
- Cancellation with capacity restoration

**PaymentService**
- Payment processing
- Transaction verification
- Payment history retrieval
- Integration with Razorpay

**UserService**
- User profile management
- Role management
- User listing and search

#### 3. Repositories (Data Access Layer)

Spring Data JPA repositories extending `JpaRepository`:
- `UserRepository`
- `TempleRepository`
- `DarshanSlotRepository`
- `BhaktnivasRepository`
- `BhaktnivasSlotRepository`
- `BookingRepository`
- `PaymentRepository`

**Key Features**:
- Automatic query generation from method names
- Custom queries using `@Query` annotation
- Pagination and sorting support

#### 4. Security Configuration

**SecurityConfig**
- JWT authentication filter chain
- Public endpoint configuration
- Role-based authorization
- CORS configuration

**JwtAuthFilter**
- Custom filter for JWT token validation
- Extracts token from Authorization header
- Sets SecurityContext with user details

**JwtUtil**
- Token generation with claims (userId, email, role)
- Token validation
- Token expiration handling

#### 5. Email Service

**EmailUtil**
- OTP email sending
- HTML email templates
- Async email processing (`@Async`)
- SMTP configuration via `application.properties`

#### 6. Entity Models (JPA)

**User Entity**
- Fields: id, name, email, passwordHash, role, isEmailVerified, emailOTP, otpExpiry
- Relationships: OneToMany with Bookings, BhaktnivasListings

**Temple Entity**
- Fields: id, serviceProviderId, name, location, city, state, description, imagePath, latitude, longitude
- Relationships: ManyToOne with User, OneToMany with Bhaktnivas, DarshanSlots

**DarshanSlot Entity**
- Fields: id, templeId, date, startTime, endTime, capacity, availableSlots, price
- Relationships: ManyToOne with Temple, OneToMany with Bookings

**Bhaktnivas Entity**
- Fields: id, templeId, serviceProviderId, name, description, pricePerNight, capacity, amenities, imageUrl
- Relationships: ManyToOne with Temple and User, OneToMany with Bookings

**BhaktnivasSlot Entity**
- Fields: id, bhaktnivasId, date, availableCapacity
- Tracks daily availability for Bhaktnivas

**Booking Entity**
- Fields: id, userId, templeId, bhaktnivasId, darshanSlotId, bookingDate, checkInDate, checkOutDate, totalAmount, paymentStatus, bookingStatus, numberOfPersons
- Relationships: ManyToOne with User, Temple, Bhaktnivas, DarshanSlot

**Payment Entity**
- Fields: id, bookingId, amount, paymentMethod, transactionId, status, createdAt, completedAt
- Relationships: OneToOne with Booking

#### 7. DTOs (Data Transfer Objects)

- `RegisterRequest` / `RegisterResponse`
- `LoginRequest` / `LoginResponse`
- `VerifyOTPRequest` / `ResendOTPRequest`
- `CreateTempleRequest` / `UpdateTempleRequest`
- `DarshanSlotDTO`
- `CreateBookingRequest` / `BookingListDTO`
- `UserProfileResponse`
- And more...

#### 8. Exception Handling

**GlobalExceptionHandler**
- Centralized exception handling
- Custom error responses
- Validation error formatting

### Key Spring Boot Features Used

1. **Dependency Injection**
   - `@Autowired` / Constructor injection
   - `@Service`, `@Repository`, `@Controller` annotations

2. **Transaction Management**
   - `@Transactional` annotation for atomic operations
   - Automatic rollback on exceptions

3. **Validation**
   - Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Email`, etc.)
   - Custom validators

4. **Configuration**
   - `application.properties` for externalized configuration
   - `@Configuration` classes for programmatic config

5. **AOP (Aspect-Oriented Programming)**
   - `@Async` for asynchronous email sending
   - Transaction management

---

## 7. .NET Backend Architecture

### Project Structure

```
backend/TirthSeva.API/
├── Controllers/          # REST API Controllers
├── Services/             # Business Logic Layer
├── Models/               # Entity Models
├── Data/                 # DbContext and Migrations
├── DTOs/                 # Data Transfer Objects
├── Helpers/              # Utility Classes
├── Migrations/           # EF Core Migrations
├── wwwroot/              # Static Files (Images)
├── Program.cs            # Application Entry Point
└── appsettings.json      # Configuration
```

### Key Components

#### 1. Controllers (REST API Endpoints)

**AuthController**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/me` - Current user profile

**TemplesController**
- `GET /api/temples` - Get all temples
- `GET /api/temples/{id}` - Get temple by ID
- `GET /api/temples/search` - Search temples
- `GET /api/temples/states` - Get states
- `GET /api/temples/cities/{state}` - Get cities
- `POST /api/temples` - Create temple (ServiceProvider)
- `PUT /api/temples/{id}` - Update temple
- `DELETE /api/temples/{id}` - Delete temple

**DarshanController**
- `GET /api/darshan/available` - Available slots
- `POST /api/darshan` - Create slot (ServiceProvider)
- `PUT /api/darshan/{id}` - Update slot
- `DELETE /api/darshan/{id}` - Delete slot

**BhaktnivasController**
- `GET /api/bhaktnivas` - Get all listings
- `GET /api/bhaktnivas/{id}` - Get by ID
- `GET /api/bhaktnivas/temple/{templeId}` - Get by temple
- `POST /api/bhaktnivas` - Create listing
- `PUT /api/bhaktnivas/{id}` - Update listing
- `DELETE /api/bhaktnivas/{id}` - Delete listing

**BookingsController**
- `POST /api/bookings/confirm-and-book` - Create booking
- `GET /api/bookings/my-bookings` - User bookings
- `GET /api/bookings/provider` - Provider bookings
- `GET /api/bookings/all` - All bookings (Admin)
- `PUT /api/bookings/{id}/status` - Update status
- `DELETE /api/bookings/{id}` - Cancel booking

**PaymentsController**
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history

**UsersController** (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user
- `DELETE /api/users/{id}` - Delete user
- `PUT /api/users/{id}/role` - Update role

#### 2. Services (Business Logic)

**AuthService**
- Registration with OTP
- Login with JWT generation
- OTP verification
- Password hashing (BCrypt.Net)

**TempleService**
- CRUD operations
- Search and filtering
- State/city aggregation
- Image handling

**DarshanService**
- Slot management
- Availability queries
- Capacity tracking

**BhaktnivasService**
- Listing management
- Availability slot management
- Price calculations

**BookingService**
- Booking creation with validation
- Availability checks
- Atomic capacity updates
- Status management
- Cancellation logic

**PaymentService**
- Payment processing
- Transaction verification
- History retrieval

**UserService**
- User management
- Role updates
- Profile operations

#### 3. Data Access (Entity Framework Core)

**ApplicationDbContext**
- DbSet properties for all entities
- Fluent API configuration
- Relationship configuration
- Index creation
- Decimal precision configuration

**Key Features**:
- Code-First approach
- Migrations for schema changes
- Lazy loading support
- Eager loading with `Include()`
- LINQ queries

#### 4. Models (Entity Classes)

**User Model**
- Properties: Id, Name, Email, PasswordHash, Role, IsEmailVerified, EmailOTP, OTPExpiry, CreatedAt
- Navigation: Bookings, BhaktnivasListings
- Data Annotations: `[Required]`, `[EmailAddress]`, `[StringLength]`

**Temple Model**
- Properties: Id, ServiceProviderId, Name, Location, City, State, Description, ImagePath, Latitude, Longitude
- Navigation: ServiceProvider, BhaktnivasList, DarshanSlots, Bookings

**DarshanSlot Model**
- Properties: Id, TempleId, Date, StartTime, EndTime, Capacity, AvailableSlots, Price
- Navigation: Temple, Bookings

**Bhaktnivas Model**
- Properties: Id, TempleId, ServiceProviderId, Name, Description, PricePerNight, Capacity, Amenities, ImageUrl, Latitude, Longitude
- Navigation: Temple, ServiceProvider, Bookings

**BhaktnivasSlot Model**
- Properties: Id, BhaktnivasId, Date, AvailableCapacity
- Tracks daily availability

**Booking Model**
- Properties: Id, UserId, TempleId, BhaktnivasId, DarshanSlotId, BookingDate, CheckInDate, CheckOutDate, TotalAmount, PaymentStatus, BookingStatus, NumberOfPersons
- Navigation: User, Temple, Bhaktnivas, DarshanSlot, Payment

**Payment Model**
- Properties: Id, BookingId, Amount, PaymentMethod, TransactionId, Status, CreatedAt, CompletedAt
- Navigation: Booking

#### 5. Helpers

**JwtHelper**
- `GenerateToken()` - Creates JWT with claims
- `ValidateToken()` - Validates JWT token
- Uses `JwtSecurityTokenHandler`
- Symmetric key signing (HMAC SHA256)

**EmailHelper**
- `SendOTPEmailAsync()` - Sends OTP email
- Uses MailKit for SMTP
- HTML email templates
- Async/await pattern

#### 6. Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TirthSevaDbP;..."
  },
  "JwtSettings": {
    "Secret": "...",
    "Issuer": "TirthSevaAPI",
    "Audience": "TirthSevaClient",
    "ExpiryInMinutes": 30
  },
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "...",
    "Password": "..."
  }
}
```

#### 7. Program.cs (Startup Configuration)

**Key Configurations**:
- DbContext registration with SQL Server
- JWT Bearer authentication
- CORS policy
- Service registration (Scoped services)
- Static file serving
- Swagger/OpenAPI
- Database migration on startup
- Admin user seeding

### Key .NET Features Used

1. **Dependency Injection**
   - Built-in DI container
   - Service lifetime (Scoped, Singleton, Transient)
   - Constructor injection

2. **Entity Framework Core**
   - Code-First migrations
   - LINQ queries
   - Change tracking
   - Lazy/Eager loading

3. **Authentication & Authorization**
   - JWT Bearer authentication middleware
   - `[Authorize]` attribute
   - Role-based authorization

4. **Middleware Pipeline**
   - CORS middleware
   - Authentication middleware
   - Authorization middleware
   - Static files middleware

5. **Async/Await**
   - Asynchronous service methods
   - `Task<T>` return types
   - Non-blocking I/O operations

---

## 8. Frontend Architecture

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── common/          # Reusable components
│   ├── pages/
│   │   ├── public/          # Public pages
│   │   ├── user/            # User-specific pages
│   │   ├── provider/        # Provider pages
│   │   └── admin/           # Admin pages
│   ├── services/            # API service layer
│   ├── context/             # React Context (Auth)
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── package.json            # Dependencies
```

### Key Components

#### 1. Routing (React Router)

**Public Routes**:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/verify-otp` - OTP verification
- `/bhaktnivas` - Bhaktnivas listings
- `/bhaktnivas/:id` - Bhaktnivas details
- `/darshan` - Darshan booking

**Protected Routes**:
- `/user/dashboard` - User dashboard
- `/user/bookings` - User bookings
- `/provider/dashboard` - Provider dashboard
- `/provider/listings` - Manage listings
- `/provider/bookings` - Provider bookings
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/bookings` - All bookings

**Route Protection**:
- `ProtectedRoute` component checks authentication
- Role-based access control
- Redirects to login if not authenticated

#### 2. State Management

**AuthContext**
- Global authentication state
- User information
- Login/logout functions
- Token management

**Local Storage**
- JWT token storage
- User data persistence
- Session persistence across page refreshes

#### 3. API Service Layer

**api.js** (Axios Configuration)
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Token expiration check

**authService.js**
- `register()` - User registration
- `login()` - Authentication
- `logout()` - Clear session
- `verifyOTP()` - OTP verification
- `resendOTP()` - Resend OTP
- `getCurrentUser()` - Fetch user profile
- `isAuthenticated()` - Check auth status

**Other Services**:
- Temple service calls
- Booking service calls
- Payment service calls
- Image upload service

#### 4. UI Components

**Common Components**:
- `Navbar` - Public navigation
- `DashboardNavbar` - Dashboard navigation
- `Footer` - Footer component
- `TempleCard` - Temple display card
- `BhaktnivasCard` - Bhaktnivas display card
- `ImageUpload` - Image upload component
- `LeafletMap` - Map component
- `ActionCard` - Dashboard action card

**Page Components**:
- `Home` - Landing page
- `Login` - Login form
- `Register` - Registration form
- `VerifyOTP` - OTP verification form
- `BhaktnivasListing` - Listings page
- `BhaktnivasDetails` - Details page
- `DarshanBooking` - Booking page
- `UserDashboard` - User dashboard
- `MyBookings` - User bookings
- `ProviderDashboard` - Provider dashboard
- `AdminDashboard` - Admin dashboard
- And more...

#### 5. Features

**Maps Integration**:
- Leaflet for interactive maps
- MapLibre GL for advanced mapping
- Geoapify for geocoding/autocomplete
- Location picker for temples/Bhaktnivas

**Image Handling**:
- Image upload to backend
- Image preview
- Multiple image support for Bhaktnivas

**Form Handling**:
- Controlled components
- Form validation
- Error handling
- Success notifications (Toastify)

**Search & Filter**:
- Temple search by name
- State/city filtering
- Date-based filtering for slots
- Real-time search

**Payment Integration**:
- Razorpay integration
- Payment form
- Transaction verification
- Payment status display

#### 6. Styling

- Bootstrap 5.3.2 for responsive design
- React Bootstrap for React components
- Bootstrap Icons for icons
- Custom CSS for specific styling

---

## 9. Database Schema

### Entity Relationship Diagram

```
Users
├── Id (PK)
├── Name
├── Email (Unique)
├── PasswordHash
├── Role (User/ServiceProvider/Admin)
├── IsEmailVerified
├── EmailOTP
├── OTPExpiry
└── CreatedAt
    │
    ├── OneToMany ──> Bookings (UserId)
    └── OneToMany ──> Bhaktnivas (ServiceProviderId)
    └── OneToMany ──> Temples (ServiceProviderId)

Temples
├── Id (PK)
├── ServiceProviderId (FK -> Users)
├── Name
├── Location
├── City
├── State
├── Description
├── ImagePath
├── Latitude
├── Longitude
└── CreatedAt
    │
    ├── OneToMany ──> Bhaktnivas (TempleId)
    ├── OneToMany ──> DarshanSlots (TempleId)
    └── OneToMany ──> Bookings (TempleId)

Bhaktnivas
├── Id (PK)
├── TempleId (FK -> Temples)
├── ServiceProviderId (FK -> Users)
├── Name
├── Description
├── PricePerNight
├── Capacity
├── IsAvailable
├── DistanceFromTemple
├── ImageUrl
├── Latitude
├── Longitude
├── Amenities
├── ContactPhone
└── CreatedAt
    │
    ├── OneToMany ──> BhaktnivasSlots (BhaktnivasId)
    └── OneToMany ──> Bookings (BhaktnivasId)

BhaktnivasSlots
├── Id (PK)
├── BhaktnivasId (FK -> Bhaktnivas)
├── Date
└── AvailableCapacity

DarshanSlots
├── Id (PK)
├── TempleId (FK -> Temples)
├── Date
├── StartTime
├── EndTime
├── Capacity
├── AvailableSlots
├── Price
└── CreatedAt
    │
    └── OneToMany ──> Bookings (DarshanSlotId)

Bookings
├── Id (PK)
├── UserId (FK -> Users)
├── TempleId (FK -> Temples)
├── BhaktnivasId (FK -> Bhaktnivas, nullable)
├── DarshanSlotId (FK -> DarshanSlots, nullable)
├── BookingDate
├── CheckInDate (nullable)
├── CheckOutDate (nullable)
├── TotalAmount
├── PaymentStatus (Pending/Completed/Failed/Refunded)
├── BookingStatus (Confirmed/Cancelled/Completed)
├── NumberOfPersons
├── SpecialRequests (nullable)
└── CreatedAt
    │
    └── OneToOne ──> Payments (BookingId)

Payments
├── Id (PK)
├── BookingId (FK -> Bookings, Unique)
├── Amount
├── PaymentMethod
├── TransactionId
├── Status (Success/Failed)
├── CreatedAt
└── CompletedAt
```

### Database Design Principles

1. **Normalization**
   - Third Normal Form (3NF)
   - No redundant data
   - Foreign key relationships

2. **Indexes**
   - Email (unique index)
   - City, State (for search)
   - UserId, BookingDate (for queries)
   - TempleId (for filtering)

3. **Constraints**
   - Foreign key constraints
   - Unique constraints (Email)
   - Check constraints (via application logic)
   - Not null constraints

4. **Data Types**
   - Decimal precision for money (10,2)
   - DateTime for timestamps
   - String lengths optimized
   - Integer IDs (auto-increment)

---

## 10. Key Features & Flows

### 1. User Registration & OTP Verification Flow

**Flow**:
1. User submits registration form (name, email, password, role)
2. Backend validates input
3. Backend generates 6-digit OTP
4. OTP stored in database with 10-minute expiry
5. Email sent with OTP via SMTP
6. User receives email and enters OTP
7. Backend verifies OTP (checks match and expiry)
8. On success: `IsEmailVerified = true`, OTP cleared
9. User can now login

**Implementation Details**:
- **Spring Boot**: `AuthService.register()`, `EmailUtil.sendOTPEmail()`, `AuthService.verifyOTP()`
- **.NET**: `AuthService.RegisterAsync()`, `EmailHelper.SendOTPEmailAsync()`, `AuthService.VerifyOTPAsync()`
- **Frontend**: `Register.jsx`, `VerifyOTP.jsx`, `authService.js`

### 2. Authentication & JWT Flow

**Flow**:
1. User submits login credentials
2. Backend validates email/password (BCrypt hash comparison)
3. Backend generates JWT token with claims (userId, email, role)
4. Token returned to frontend
5. Frontend stores token in localStorage
6. Axios interceptor adds token to all subsequent requests
7. Backend validates token on protected routes
8. Token expiration checked client-side

**Implementation Details**:
- **Spring Boot**: `JwtUtil.generateToken()`, `JwtAuthFilter`, `SecurityConfig`
- **.NET**: `JwtHelper.GenerateToken()`, JWT Bearer middleware, `[Authorize]` attribute
- **Frontend**: `api.js` interceptors, `authService.js`, `AuthContext.jsx`

### 3. Darshan Slot Booking Flow

**Flow**:
1. User selects temple and date
2. Frontend calls `GET /api/darshan/available?templeId=X&date=Y`
3. Backend queries available slots (AvailableSlots > 0)
4. User selects slot and number of persons (max 4)
5. User proceeds to payment (Razorpay)
6. After payment success, frontend calls `POST /api/bookings/confirm-and-book`
7. Backend validates availability again
8. Backend atomically:
   - Decrements `AvailableSlots` by `NumberOfPersons`
   - Creates Booking record
   - Creates Payment record
9. Booking confirmed

**Implementation Details**:
- **Spring Boot**: `@Transactional`, `BookingService.createBooking()`
- **.NET**: EF Core transaction, `BookingService.CreateBookingWithPaymentAsync()`
- **Frontend**: `DarshanBooking.jsx`, Razorpay integration

### 4. Bhaktnivas Booking Flow

**Flow**:
1. User browses Bhaktnivas listings
2. User selects Bhaktnivas and dates (check-in/check-out)
3. Frontend calls `GET /api/bhaktnivas/{id}`
4. Backend checks availability for date range via `BhaktnivasSlots`
5. User confirms booking
6. Payment processed
7. Backend validates availability for all dates in range
8. Backend atomically:
   - Decrements `AvailableCapacity` for each date slot
   - Creates Booking record
   - Creates Payment record
9. Booking confirmed

**Implementation Details**:
- **Spring Boot**: `BhaktnivasService`, `BookingService`, date range validation
- **.NET**: `BhaktnivasService`, `BookingService`, LINQ date filtering
- **Frontend**: `BhaktnivasDetails.jsx`, date picker, availability check

### 5. Service Provider Management Flow

**Flow**:
1. ServiceProvider logs in
2. Provider creates/edits Temple
3. Provider creates Darshan slots for temple
4. Provider creates Bhaktnivas listings
5. Provider manages availability slots for Bhaktnivas
6. Provider views bookings for their listings
7. Provider can update booking status

**Implementation Details**:
- **Controllers**: `TemplesController`, `DarshanController`, `BhaktnivasController`
- **Services**: Business logic with ownership validation
- **Frontend**: Provider dashboard, CRUD forms

### 6. Admin Management Flow

**Flow**:
1. Admin logs in
2. Admin views all users, temples, bookings
3. Admin can delete/modify any entity
4. Admin can update user roles
5. Admin can manage all bookings

**Implementation Details**:
- **Authorization**: `[Authorize(Roles = "Admin")]` / `@PreAuthorize("hasRole('Admin')")`
- **Controllers**: Admin-specific endpoints
- **Frontend**: Admin dashboard, management pages

---

## 11. Interview Talking Points

### Project Introduction

**"I developed TirthSeva, a comprehensive temple pilgrimage services platform that enables users to book Darshan slots and accommodation near temples. The project demonstrates full-stack development skills with dual backend implementations in Spring Boot and .NET, along with a React frontend."**

### Key Highlights to Emphasize

#### 1. **Dual Backend Architecture**
- **Why**: "I implemented the same API in both Spring Boot and .NET to demonstrate proficiency in multiple backend technologies and to show understanding of RESTful API design principles."
- **Technical Details**:
  - Both backends provide identical API contracts
  - Same database schema
  - Consistent authentication/authorization
  - Comparable performance and features

#### 2. **Security Implementation**
- **JWT Authentication**: "I implemented stateless JWT authentication with secure token generation, validation, and expiration handling."
- **OTP Verification**: "Email-based OTP verification ensures user authenticity before account activation."
- **Password Security**: "BCrypt hashing for password storage with salt rounds."
- **Role-Based Access Control**: "RBAC implementation with three roles: User, ServiceProvider, and Admin."

#### 3. **Database Design**
- **Normalized Schema**: "Designed a normalized database schema following 3NF principles with proper relationships and constraints."
- **Indexing Strategy**: "Created indexes on frequently queried columns (Email, City, State, UserId) for optimal query performance."
- **Transaction Management**: "Implemented atomic transactions for booking operations to ensure data consistency."

#### 4. **Business Logic Complexity**
- **Availability Management**: "Implemented real-time availability tracking with atomic capacity updates to prevent overbooking."
- **Date Range Validation**: "Complex logic for Bhaktnivas booking that validates availability across multiple date slots."
- **Payment Integration**: "Integrated Razorpay payment gateway with transaction verification and status tracking."

#### 5. **Frontend Architecture**
- **Component-Based Design**: "Modular React components with reusable UI elements."
- **State Management**: "React Context API for global authentication state."
- **Route Protection**: "Protected routes with role-based access control."
- **API Integration**: "Axios interceptors for automatic token attachment and error handling."

#### 6. **Code Quality & Best Practices**
- **Separation of Concerns**: "Layered architecture with clear separation between controllers, services, and data access."
- **DTO Pattern**: "Data Transfer Objects for API request/response to decouple internal models from API contracts."
- **Exception Handling**: "Centralized exception handling with meaningful error messages."
- **Async Operations**: "Asynchronous email sending and database operations for better performance."

### Technical Deep Dives

#### Spring Boot Specific (If Asked)

**"In the Spring Boot backend, I leveraged Spring Data JPA for data access, which provides automatic query generation and repository pattern implementation. I used `@Transactional` annotations for atomic operations, ensuring that booking creation and slot capacity updates happen in a single transaction. The security layer uses Spring Security with a custom JWT filter that validates tokens and populates the SecurityContext. For email functionality, I used Spring Mail with `@Async` annotation to send emails asynchronously without blocking the request thread."**

**Key Spring Boot Components**:
- Spring Data JPA Repositories
- `@Transactional` for transaction management
- Spring Security with JWT filter
- `@Async` for asynchronous operations
- Jakarta Bean Validation
- Springdoc OpenAPI for Swagger documentation

#### .NET Specific (If Asked)

**"In the .NET backend, I used Entity Framework Core with Code-First migrations for database management. The DbContext implements the Unit of Work pattern, automatically tracking changes and saving them atomically. I configured JWT Bearer authentication middleware in Program.cs, which validates tokens on every request. The service layer uses async/await pattern throughout for non-blocking I/O operations. I also implemented dependency injection using the built-in DI container with scoped service lifetimes."**

**Key .NET Components**:
- Entity Framework Core with Code-First
- JWT Bearer Authentication middleware
- Dependency Injection (Scoped services)
- Async/await pattern
- Data Annotations for validation
- Swashbuckle for Swagger

### Challenges & Solutions

#### Challenge 1: Preventing Overbooking
**Problem**: "Multiple users could book the same slot simultaneously, leading to overbooking."

**Solution**: "I implemented atomic transactions that validate availability and decrement capacity in a single database transaction. In Spring Boot, I used `@Transactional`, and in .NET, EF Core's `SaveChangesAsync()` ensures atomicity. Additionally, I added a final availability check right before booking creation."

#### Challenge 2: Date Range Availability
**Problem**: "Bhaktnivas booking requires checking availability across multiple dates."

**Solution**: "I created a `BhaktnivasSlots` table that tracks daily availability. When booking, the system queries all slots in the date range and validates that each date has sufficient capacity. The booking process atomically decrements capacity for all affected dates."

#### Challenge 3: Token Management
**Problem**: "Managing JWT tokens securely on the client side."

**Solution**: "I implemented Axios interceptors that automatically attach tokens to requests and check expiration before sending. Expired tokens trigger automatic logout and redirect to login. The token is stored in localStorage for persistence across sessions."

### Scalability Considerations

1. **Database**: "Indexes on frequently queried columns, connection pooling, and query optimization."
2. **Caching**: "Can implement Redis for session caching and frequently accessed data."
3. **Load Balancing**: "Stateless JWT design allows horizontal scaling."
4. **File Storage**: "Currently local storage; can migrate to cloud storage (AWS S3, Azure Blob)."
5. **Email Queue**: "Can implement message queue (RabbitMQ, Azure Service Bus) for email processing."

### Future Enhancements

1. **Real-time Notifications**: "WebSocket integration for booking confirmations and updates."
2. **Review System**: "User reviews and ratings for temples and Bhaktnivas."
3. **Mobile App**: "React Native or Flutter mobile application."
4. **Analytics Dashboard**: "Provider analytics for bookings and revenue."
5. **Multi-language Support**: "Internationalization for multiple languages."
6. **Advanced Search**: "Elasticsearch for full-text search capabilities."

### Metrics & Performance

- **Response Time**: "API endpoints respond within 100-300ms for most operations."
- **Database Queries**: "Optimized queries with proper indexing reduce query time."
- **Concurrent Users**: "Designed to handle multiple concurrent bookings with transaction isolation."
- **Email Delivery**: "Asynchronous email sending prevents blocking user requests."

### Learning Outcomes

1. **Full-Stack Development**: "Gained experience in frontend, backend, and database design."
2. **Multiple Technologies**: "Proficient in Spring Boot, .NET, React, and MySQL."
3. **Security**: "Deep understanding of JWT, OTP, password hashing, and RBAC."
4. **API Design**: "RESTful API design principles and best practices."
5. **Problem Solving**: "Solved complex business logic challenges like availability management."

---

## Conclusion

TirthSeva is a production-ready, full-stack application that demonstrates proficiency in modern web development technologies, security best practices, and complex business logic implementation. The dual backend approach showcases adaptability and understanding of different technology ecosystems while maintaining consistent API design and functionality.

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Project**: TirthSeva - Temple Pilgrimage Services Platform
