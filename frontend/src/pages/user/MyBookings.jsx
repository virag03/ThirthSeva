import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bookingService, paymentService } from '../../services/bookingService';
import { RAZORPAY_CONFIG } from '../../config';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [processingPayment, setProcessingPayment] = useState(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await bookingService.cancel(bookingId);
            alert('Booking cancelled successfully');
            loadBookings(); // Reload bookings
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            alert('Failed to cancel booking. Please try again.');
        }
    };

    const handleProcessPayment = async (bookingId) => {
        if (!window.Razorpay) {
            toast.error('Razorpay SDK failed to load.');
            return;
        }

        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        setProcessingPayment(bookingId);
        try {
            const options = {
                key: RAZORPAY_CONFIG.KEY_ID,
                amount: Math.round(booking.totalAmount * 100),
                currency: "INR",
                name: "TirthSeva",
                description: "Payment for Pending Booking",
                handler: async function (response) {
                    try {
                        setProcessingPayment(bookingId);
                        await bookingService.confirmPayment(bookingId, response.razorpay_payment_id);
                        toast.success('🎉 Payment successful! Your booking is confirmed!');
                        loadBookings();
                    } catch (err) {
                        console.error('Confirmation failed:', err);
                        toast.error('Failed to confirm payment on server.');
                    } finally {
                        setProcessingPayment(null);
                    }
                },
                theme: { color: "#FF6B00" },
                modal: {
                    ondismiss: function () {
                        setProcessingPayment(null);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Failed to process payment:', error);
            toast.error('Payment initialization failed.');
            setProcessingPayment(null);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') return booking.bookingStatus === 'Confirmed';
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
            <ToastContainer />
            <h1 className="mb-4">
                <i className="bi bi-calendar-check me-3"></i>
                My Bookings
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
                        className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming ({bookings.filter(b => b.bookingStatus === 'Confirmed').length})
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
                                            <h4 className="card-title text-primary">
                                                <i className="bi bi-geo-alt me-2"></i>
                                                {booking.templeName}
                                            </h4>

                                            {booking.bhaktnivasName && (
                                                <p className="mb-2">
                                                    <i className="bi bi-building me-2 text-maroon"></i>
                                                    <strong>Bhaktnivas:</strong> {booking.bhaktnivasName}
                                                </p>
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

                                            {booking.paymentStatus === 'Pending' && booking.bookingStatus !== 'Cancelled' && (
                                                <button
                                                    className="btn btn-success btn-sm mb-2 w-100"
                                                    onClick={() => handleProcessPayment(booking.id)}
                                                    disabled={processingPayment === booking.id}
                                                >
                                                    {processingPayment === booking.id ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-credit-card me-2"></i>
                                                            Pay Now
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            {booking.bookingStatus === 'Confirmed' && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm w-100"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    <i className="bi bi-x-circle me-2"></i>
                                                    Cancel Booking
                                                </button>
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
                                ? "You haven't made any bookings yet. Start your spiritual journey today!"
                                : `You don't have any ${filter} bookings.`
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
