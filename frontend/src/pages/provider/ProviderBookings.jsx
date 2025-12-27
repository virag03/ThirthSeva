import { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

const ProviderBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await bookingService.getProviderBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId, status) => {
        setUpdatingStatus(bookingId);
        try {
            await bookingService.updateStatus(bookingId, status);
            alert(`Booking ${status.toLowerCase()} successfully!`);
            loadBookings(); // Reload bookings
        } catch (error) {
            console.error('Failed to update booking status:', error);
            alert('Failed to update booking status. Please try again.');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        if (filter === 'confirmed') return booking.bookingStatus === 'Confirmed';
        if (filter === 'completed') return booking.bookingStatus === 'Completed';
        if (filter === 'cancelled') return booking.bookingStatus === 'Cancelled';
        return true;
    });

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4">
                <i className="bi bi-calendar-check me-3"></i>
                Incoming Bookings
            </h1>

            {/* Filter Buttons */}
            <div className="mb-4">
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({bookings.length})
                    </button>
                    <button
                        type="button"
                        className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed ({bookings.filter(b => b.bookingStatus === 'Confirmed').length})
                    </button>
                    <button
                        type="button"
                        className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({bookings.filter(b => b.bookingStatus === 'Completed').length})
                    </button>
                    <button
                        type="button"
                        className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled ({bookings.filter(b => b.bookingStatus === 'Cancelled').length})
                    </button>
                </div>
            </div>

            {filteredBookings.length > 0 ? (
                <div className="row g-4">
                    {filteredBookings.map(booking => (
                        <div key={booking.id} className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h4 className="card-title text-primary mb-2">
                                                        <i className="bi bi-building me-2"></i>
                                                        {booking.bhaktnivasName || 'Darshan Booking'}
                                                    </h4>
                                                    <h5 className="text-muted">
                                                        <i className="bi bi-geo-alt me-2"></i>
                                                        {booking.templeName}
                                                    </h5>
                                                </div>
                                            </div>

                                            <div className="alert alert-light">
                                                <strong>Guest Details:</strong>
                                                <p className="mb-0 mt-2">Booking ID: #{booking.id}</p>
                                            </div>

                                            {booking.checkInDate && (
                                                <>
                                                    <p className="mb-2">
                                                        <i className="bi bi-calendar-range me-2 text-info"></i>
                                                        <strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="mb-2">
                                                        <i className="bi bi-calendar-range me-2 text-info"></i>
                                                        <strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
                                                    </p>
                                                </>
                                            )}

                                            {booking.darshanDate && (
                                                <>
                                                    <p className="mb-2">
                                                        <i className="bi bi-calendar me-2 text-saffron"></i>
                                                        <strong>Darshan Date:</strong> {new Date(booking.darshanDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="mb-2">
                                                        <i className="bi bi-clock me-2 text-saffron"></i>
                                                        <strong>Time:</strong> {booking.darshanTime}
                                                    </p>
                                                </>
                                            )}

                                            <p className="mb-2">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                <strong>Booked on:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="col-md-4 text-md-end">
                                            <h3 className="text-primary mb-3">₹{booking.totalAmount}</h3>

                                            <div className="mb-3">
                                                <span className={`badge me-2 ${booking.paymentStatus === 'Completed' ? 'bg-success' :
                                                    booking.paymentStatus === 'Pending' ? 'bg-warning text-dark' : 'bg-danger'
                                                    }`}>
                                                    Payment: {booking.paymentStatus}
                                                </span>
                                                <br />
                                                <span className={`badge mt-2 ${booking.bookingStatus === 'Confirmed' ? 'bg-info' :
                                                    booking.bookingStatus === 'Completed' ? 'bg-success' : 'bg-secondary'
                                                    }`}>
                                                    Status: {booking.bookingStatus}
                                                </span>
                                            </div>

                                            {booking.bookingStatus === 'Confirmed' && (
                                                <div className="d-grid gap-2">
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleUpdateStatus(booking.id, 'Completed')}
                                                        disabled={updatingStatus === booking.id}
                                                    >
                                                        {updatingStatus === booking.id ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-check-circle me-2"></i>
                                                                Mark as Completed
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}
                                                        disabled={updatingStatus === booking.id}
                                                    >
                                                        <i className="bi bi-x-circle me-2"></i>
                                                        Cancel Booking
                                                    </button>
                                                </div>
                                            )}

                                            {booking.bookingStatus === 'Completed' && (
                                                <div className="alert alert-success mt-3">
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Booking Completed
                                                </div>
                                            )}

                                            {booking.bookingStatus === 'Cancelled' && (
                                                <div className="alert alert-secondary mt-3">
                                                    <i className="bi bi-x-circle-fill me-2"></i>
                                                    Booking Cancelled
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="card-body p-5 text-center">
                        <i className="bi bi-calendar-x text-muted" style={{ fontSize: '5rem' }}></i>
                        <h3 className="mt-4">No {filter !== 'all' && filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings</h3>
                        <p style={{ fontSize: '1.2rem' }}>
                            {filter === 'all'
                                ? "You haven't received any bookings yet for your Bhaktnivas."
                                : `You don't have any ${filter} bookings.`
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderBookings;
