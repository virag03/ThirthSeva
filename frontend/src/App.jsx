import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import DashboardNavbar from './components/common/DashboardNavbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import VerifyEmail from './pages/public/VerifyEmail';
import VerifyOTP from './pages/public/VerifyOTP';
import BhaktnivasListing from './pages/public/BhaktnivasListing';
import BhaktnivasDetails from './pages/public/BhaktnivasDetails';
import DarshanBooking from './pages/public/DarshanBooking';
import FoodServices from './pages/public/FoodServices';
import LocationHelp from './pages/public/LocationHelp';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MyBookings from './pages/user/MyBookings';

// Service Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import MyListings from './pages/provider/MyListings';
import CreateListing from './pages/provider/CreateListing';
import ProviderBookings from './pages/provider/ProviderBookings';
import MyTemples from './pages/provider/MyTemples';
import CreateTemple from './pages/provider/CreateTemple';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBhaktnivas from './pages/admin/ManageBhaktnivas';
import ManageUsers from './pages/admin/ManageUsers';
import AllBookings from './pages/admin/AllBookings';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user?.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // Determine if current route is a dashboard/protected route
    const isDashboardRoute = location.pathname.startsWith('/user/') ||
        location.pathname.startsWith('/provider/') ||
        location.pathname.startsWith('/admin/');

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Conditionally render navbar based on route */}
            {isDashboardRoute && isAuthenticated() ? <DashboardNavbar /> : <Navbar />}
            <main className="flex-grow-1">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/bhaktnivas" element={<BhaktnivasListing />} />
                    <Route path="/bhaktnivas/:id" element={<BhaktnivasDetails />} />
                    <Route path="/darshan" element={<DarshanBooking />} />
                    <Route path="/food-services" element={<FoodServices />} />
                    <Route path="/location-help" element={<LocationHelp />} />

                    {/* User Routes */}
                    <Route
                        path="/user/dashboard"
                        element={
                            <ProtectedRoute roles={['User']}>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/bookings"
                        element={
                            <ProtectedRoute roles={['User']}>
                                <MyBookings />
                            </ProtectedRoute>
                        }
                    />

                    {/* Service Provider Routes */}
                    <Route
                        path="/provider/dashboard"
                        element={
                            <ProtectedRoute roles={['ServiceProvider']}>
                                <ProviderDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/listings"
                        element={
                            <ProtectedRoute roles={['ServiceProvider']}>
                                <MyListings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/listings/create"
                        element={
                            <ProtectedRoute roles={['ServiceProvider']}>
                                <CreateListing />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/provider/bookings"
                        element={
                            <ProtectedRoute roles={['ServiceProvider']}>
                                <ProviderBookings />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/provider/temples" element={
                        <ProtectedRoute roles={['ServiceProvider']}>
                            <MyTemples />
                        </ProtectedRoute>
                    } />
                    <Route path="/provider/temples/create" element={
                        <ProtectedRoute roles={['ServiceProvider']}>
                            <CreateTemple />
                        </ProtectedRoute>
                    } />
                    <Route path="/provider/temples/edit/:id" element={
                        <ProtectedRoute roles={['ServiceProvider']}>
                            <CreateTemple />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute roles={['Admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/bhaktnivas"
                        element={
                            <ProtectedRoute roles={['Admin']}>
                                <ManageBhaktnivas />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute roles={['Admin']}>
                                <ManageUsers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/bookings"
                        element={
                            <ProtectedRoute roles={['Admin']}>
                                <AllBookings />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all redirect */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
