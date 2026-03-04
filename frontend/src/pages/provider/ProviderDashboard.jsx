import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { bookingService } from '../../services/bookingService';

const ProviderDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalListings: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // Load provider's listings
            const listings = await bhaktnivasService.getMyListings();

            // Load provider's bookings
            const bookings = await bookingService.getProviderBookings();

            // Calculate statistics
            const totalRevenue = bookings
                .filter(b => b.paymentStatus === 'Completed')
                .reduce((sum, b) => sum + b.totalAmount, 0);

            const pendingBookings = bookings.filter(b => b.bookingStatus === 'Confirmed').length;

            setStats({
                totalListings: listings.length,
                totalBookings: bookings.length,
                pendingBookings,
                totalRevenue
            });
        } catch (error) {
            console.error('Failed to load statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4">
                <i className="bi bi-speedometer2 me-3"></i>
                Service Provider Dashboard
            </h1>
            <p className="lead">Welcome, {user?.name}!</p>

            {/* Statistics Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card text-center bg-primary text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{loading ? '...' : stats.totalListings}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Total Listings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-success text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{loading ? '...' : stats.totalBookings}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Total Bookings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-warning text-dark">
                        <div className="card-body py-4">
                            <h2 className="display-4">{loading ? '...' : stats.pendingBookings}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Pending Bookings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-info text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">₹{loading ? '...' : stats.totalRevenue}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Total Revenue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-4 mt-3">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-5">
                            <i className="bi bi-building text-saffron" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">My Listings</h3>
                            <p>Manage your Bhaktnivas</p>
                            <Link to="/provider/listings" className="btn btn-primary">
                                View Listings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-5">
                            <i className="bi bi-plus-circle text-maroon" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">Add Listing</h3>
                            <p>Create new Bhaktnivas</p>
                            <Link to="/provider/listings/create" className="btn btn-secondary">
                                Add New
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-5">
                            <i className="bi bi-calendar-check text-saffron" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">Bookings</h3>
                            <p>View incoming bookings</p>
                            <Link to="/provider/bookings" className="btn btn-primary">
                                View Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
