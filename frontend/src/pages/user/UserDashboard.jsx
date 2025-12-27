import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            setBookings(data);

            // Calculate statistics
            const total = data.length;
            const upcoming = data.filter(b => b.bookingStatus === 'Confirmed').length;
            const completed = data.filter(b => b.bookingStatus === 'Completed').length;
            const cancelled = data.filter(b => b.bookingStatus === 'Cancelled').length;

            setStats({ total, upcoming, completed, cancelled });
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const recentBookings = bookings.slice(0, 3);

    return (
        <div className="container py-5">
            <h1 className="mb-4">
                <i className="bi bi-speedometer2 me-3"></i>
                Welcome, {user?.name}!
            </h1>

            {!user?.isEmailVerified && (
                <div className="alert alert-warning" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Email not verified!</strong> Please check your email for the verification link.
                </div>
            )}

            {/* Statistics Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card text-center bg-primary text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{stats.total}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Total Bookings</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-success text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{stats.upcoming}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Upcoming</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-info text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{stats.completed}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Completed</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-secondary text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{stats.cancelled}</h2>
                            <p style={{ fontSize: '1.1rem' }}>Cancelled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-5">
                            <i className="bi bi-calendar-check text-saffron" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">My Bookings</h3>
                            <p>View and manage your bookings</p>
                            <Link to="/user/bookings" className="btn btn-primary">
                                View Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-5">
                            <i className="bi bi-building text-maroon" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">Book Bhaktnivas</h3>
                            <p>Find affordable accommodation</p>
                            <Link to="/bhaktnivas" className="btn btn-secondary">
                                Browse Bhaktnivas
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-5">
                            <i className="bi bi-calendar-plus text-saffron" style={{ fontSize: '4rem' }}></i>
                            <h3 className="mt-3">Book Darshan</h3>
                            <p>Reserve your temple visit slot</p>
                            <Link to="/darshan" className="btn btn-primary">
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card mt-4">
                <div className="card-body">
                    <h3 className="card-title">
                        <i className="bi bi-clock-history me-2"></i>
                        Recent Activity
                    </h3>
                    {loading ? (
                        <div className="text-center py-3">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : recentBookings.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {recentBookings.map(booking => (
                                <div key={booking.id} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-1">{booking.templeName}</h5>
                                            {booking.bhaktnivasName && (
                                                <p className="mb-1 text-muted">
                                                    <i className="bi bi-building me-1"></i>
                                                    {booking.bhaktnivasName}
                                                </p>
                                            )}
                                            {booking.darshanDate && (
                                                <p className="mb-1 text-muted">
                                                    <i className="bi bi-calendar me-1"></i>
                                                    {new Date(booking.darshanDate).toLocaleDateString()} - {booking.darshanTime}
                                                </p>
                                            )}
                                            {booking.checkInDate && (
                                                <p className="mb-1 text-muted">
                                                    <i className="bi bi-calendar-range me-1"></i>
                                                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-end">
                                            <h5 className="text-primary mb-2">₹{booking.totalAmount}</h5>
                                            <span className={`badge ${booking.paymentStatus === 'Completed' ? 'bg-success' :
                                                    booking.paymentStatus === 'Pending' ? 'bg-warning' : 'bg-danger'
                                                }`}>
                                                {booking.paymentStatus}
                                            </span>
                                            <span className={`badge ms-2 ${booking.bookingStatus === 'Confirmed' ? 'bg-info' :
                                                    booking.bookingStatus === 'Completed' ? 'bg-success' : 'bg-secondary'
                                                }`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No recent bookings. Start planning your pilgrimage!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
