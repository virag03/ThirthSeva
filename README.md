# TirthSeva - Pilgrimage Assistance Platform

A comprehensive full-stack web application built to assist pilgrims visiting Indian temples. The platform provides services for booking Bhaktnivas (pilgrim accommodation), scheduling Darshan (temple visits), finding nearby food/services, and location assistance.

## 🌟 Features

### For Users (Pilgrims)
- **Temple Search**: Browse and search from 10 famous Indian temples
- **Bhaktnivas Booking**: Affordable accommodation (₹50-₹200 per night)
- **Darshan Slots**: Book temple visit time slots
- **Food & Services**: Find nearby prasadam, food, and shops with prices
- **Location Help**: Google Maps integration for directions
- **Booking Management**: View and manage all bookings

### For Service Providers
- **Listing Management**: Create and manage Bhaktnivas listings
- **Availability Control**: Toggle availability of accommodations
- **Booking Tracking**: View all incoming bookings
- **Dashboard**: Statistics and quick actions

### For Administrators
- **Temple Management**: CRUD operations on temples
- **Bhaktnivas Oversight**: Manage all listings across providers
- **User Management**: View and manage users and service providers
- **Booking Overview**: Monitor all platform bookings
- **Complete CRUD Control**: Full administrative access

## 🎨 Design Features

- **Spiritual Theme**: Saffron, white, and maroon color palette
- **Elderly-Friendly**: Large fonts (minimum 18px), high contrast, simple navigation
- **Mobile-First**: Fully responsive design
- **Accessibility**: WCAG compliant with keyboard navigation
- **Bootstrap 5**: Modern UI components with Bootstrap Icons

## 🛠️ Tech Stack

### Backend
- **.NET 8 Web API**
- **Entity Framework Core** with MySQL
- **JWT Authentication** with role-based authorization
- **BCrypt** for password hashing
- **MailKit** for email verification
- **Swagger** for API documentation

### Frontend
- **React 18** with Vite
- **React Router** for routing
- **Axios** for API calls
- **Bootstrap 5** for styling
- **Bootstrap Icons** for iconography

### Database
- **MySQL** with seeded data:
  - 10 Famous Indian temples
  - 30 Bhaktnivas accommodations
  - Darshan slots for 7 days
  - Food and nearby services
  - Test user accounts

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- .NET 8 SDK
-MySQL Server (v8.0 or higher)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend/TirthSeva.API
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Update MySQL connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=tirthseva_db;User=root;Password=YOUR_PASSWORD;"
  }
}
```

4. The database will be automatically created and seeded when you run the application:
```bash
dotnet run
```

The API will start at `https://localhost:7001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install npm packages:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

## 🔑 Test Accounts

The database is pre-seeded with the following test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tirthseva.com | Admin@123 |
| User | ramesh@example.com | User@123 |
| Service Provider | suresh@example.com | Provider@123 |
| Service Provider | mahesh@example.com | Provider@123 |

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email
- `GET /api/auth/me` - Get current user

### Temples
- `GET /api/temples` - Get all temples
- `GET /api/temples/{id}` - Get temple by ID
- `GET /api/temples/search` - Search temples
- `POST /api/temples` - Create temple (Admin only)
- `PUT /api/temples/{id}` - Update temple (Admin only)
- `DELETE /api/temples/{id}` - Delete temple (Admin only)

### Bhaktnivas
- `GET /api/bhaktnivas` - Get all with filters
- `GET /api/bhaktnivas/{id}` - Get by ID
- `GET /api/bhaktnivas/my-listings` - Get provider's listings
- `POST /api/bhaktnivas` - Create listing (Provider only)
- `PUT /api/bhaktnivas/{id}` - Update listing
- `DELETE /api/bhaktnivas/{id}` - Delete listing
- `PATCH /api/bhaktnivas/{id}/availability` - Update availability

### Darshan
- `GET /api/darshan/temple/{id}` - Get temple slots
- `GET /api/darshan/available` - Get available slots

### Food Services
- `GET /api/food-services/temple/{id}` - Get services by temple

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User's bookings
- `GET /api/bookings/provider-bookings` - Provider's bookings
- `GET /api/bookings/all` - All bookings (Admin only)
- `DELETE /api/bookings/{id}` - Cancel booking

### Payments
- `POST /api/payments/process` - Process payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history

## ⚙️ Configuration

### Email Verification
To enable email sending, update `appsettings.json`:
```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your-email@gmail.com",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  }
}
```

**Note**: When SMTP is not configured, verification links are printed to the console.

### Google Maps API
To enable maps on the Location Help page:
1. Get a Google Maps API key from Google Cloud Console
2. Create `.env` file in frontend directory:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Payment Gateway
The application uses a mock payment system. To integrate real payments:
- Stripe: Add API keys in backend configuration
- PayPal: Configure PayPal SDK and credentials

## 🚀 Production Build

### Backend
```bash
cd backend/TirthSeva.API
dotnet publish -c Release
```

### Frontend
```bash
cd frontend
npm run build
```

The production files will be in `frontend/dist`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Key Highlights

✅ **Complete Full-Stack Solution**
✅ **Role-Based Access Control** (User, ServiceProvider, Admin)
✅ **JWT Authentication** with email verification
✅ **Responsive Mobile-First Design**
✅ **Elderly-Friendly UI** with large fonts and simple navigation
✅ **Indian Spiritual Theme** (Saffron, White, Maroon)
✅ **Price Range** ₹50-₹200 for budget-conscious pilgrims
✅ **10 Famous Temples** pre-loaded with data
✅ **Mock Payment Integration** (easily extendable to Stripe/PayPal)
✅ **Real-time Slot Availability** tracking
✅ **Production-Ready Code** with proper error handling

## 📝 License

This project is created for educational and demonstration purposes.

## 🙏 Acknowledgments

- Bootstrap Icons for beautiful iconography
- Google Fonts (Poppins) for readable typography
- All the famous Indian temples featured in this application

---

**Built with ❤️ for the spiritual community**
