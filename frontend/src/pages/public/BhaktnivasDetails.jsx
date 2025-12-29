import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { templeService } from '../../services/templeService';
import { bookingService } from '../../services/bookingService';

const BhaktnivasDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bhaktnivas, setBhaktnivas] = useState(null);
    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1
    });
    const [createdBooking, setCreatedBooking] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadBhaktnivasDetails();
    }, [id]);

    const loadBhaktnivasDetails = async () => {
        try {
            setLoading(true);
            const data = await bhaktnivasService.getById(id);
            setBhaktnivas(data);

            if (data.templeId) {
                const templeData = await templeService.getById(data.templeId);
                setTemple(templeData);
            }
        } catch (err) {
            console.error('Failed to load bhaktnivas:', err);
            setError('Failed to load bhaktnivas details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNowClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning('Please login to book');
            navigate('/login', { state: { from: `/bhaktnivas/${id}` } });
            return;
        }
        setShowBookingModal(true);
    };

    const calculateNights = () => {
        if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateTotalPrice = () => {
        const nights = calculateNights();
        return nights * bhaktnivas.pricePerNight;
    };

    const handleCreateBooking = async () => {
        if (!bookingData.checkInDate || !bookingData.checkOutDate) {
            toast.error('Please select check-in and check-out dates');
            return;
        }

        if (new Date(bookingData.checkOutDate) <= new Date(bookingData.checkInDate)) {
            toast.error('Check-out date must be after check-in date');
            return;
        }

        if (bookingData.numberOfGuests > bhaktnivas.capacity) {
            toast.error(`Maximum capacity is ${bhaktnivas.capacity} guests`);
            return;
        }

        setProcessing(true);
        try {
            const booking = {
                templeId: bhaktnivas.templeId,
                bhaktnivasId: parseInt(id),
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                totalAmount: calculateTotalPrice()
            };

            const result = await bookingService.create(booking);
            setCreatedBooking(result);
            setShowBookingModal(false);
            setShowPaymentModal(true);
            toast.success('Booking created! Please complete payment to confirm.');
        } catch (err) {
            console.error('Booking failed:', err);
            toast.error(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('🎉 Payment successful! Your booking is confirmed!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            setShowPaymentModal(false);

            // Redirect to bookings after a short delay
            setTimeout(() => {
                navigate('/user/bookings');
            }, 2000);
        } catch (err) {
            toast.error('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">Loading bhaktnivas details...</p>
            </div>
        );
    }

    if (error || !bhaktnivas) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error || 'Bhaktnivas not found'}</div>
                <Link to="/bhaktnivas" className="btn btn-primary">Back to Listings</Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#FFF9F5', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <ToastContainer />
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/bhaktnivas">Bhaktnivas</Link></li>
                        <li className="breadcrumb-item active">{bhaktnivas.name}</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card mb-4">
                            <div style={{
                                height: '400px',
                                backgroundColor: '#E5E5E5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                {bhaktnivas.imageUrl && (bhaktnivas.imageUrl.startsWith('/uploads/')) ? (
                                    <img src={`https://localhost:7001${bhaktnivas.imageUrl}`} alt={bhaktnivas.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <i className="bi bi-building" style={{ fontSize: '5rem', color: '#999' }}></i>
                                )}
                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <h1 className="h2 mb-3">{bhaktnivas.name}</h1>
                                {temple && (
                                    <div className="mb-3">
                                        <i className="bi bi-geo-alt text-danger me-2"></i>
                                        <strong>Temple:</strong> {temple.name}, {temple.city}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <i className="bi bi-pin-map me-2"></i>
                                    <strong>Distance from Temple:</strong> {bhaktnivas.distanceFromTemple}
                                </div>
                                <div className="mb-3">
                                    <i className="bi bi-people me-2"></i>
                                    <strong>Capacity:</strong> {bhaktnivas.capacity} persons
                                </div>
                                <div className="mb-3">
                                    <span className={`badge ${bhaktnivas.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                                        {bhaktnivas.isAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                                <hr />
                                <h5>Description</h5>
                                <p className="text-muted">{bhaktnivas.description || 'No description available.'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card sticky-top" style={{ top: '2rem' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="mb-0">₹{bhaktnivas.pricePerNight}</h3>
                                    <span className="text-muted">/ night</span>
                                </div>
                                <hr />
                                {bhaktnivas.isAvailable ? (
                                    <>
                                        <button
                                            className="btn btn-primary w-100 mb-3"
                                            style={{ backgroundColor: '#FF6B00', border: 'none' }}
                                            onClick={handleBookNowClick}
                                        >
                                            <i className="bi bi-calendar-check me-2"></i>
                                            Book Now
                                        </button>
                                        <p className="text-center text-muted small mb-0">
                                            You won't be charged yet
                                        </p>
                                    </>
                                ) : (
                                    <button className="btn btn-secondary w-100" disabled>
                                        Currently Unavailable
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Book {bhaktnivas.name}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowBookingModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Check-in Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={bookingData.checkInDate}
                                        onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Check-out Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                                        value={bookingData.checkOutDate}
                                        onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Number of Guests</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max={bhaktnivas.capacity}
                                        value={bookingData.numberOfGuests}
                                        onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
                                    />
                                    <small className="text-muted">Max capacity: {bhaktnivas.capacity}</small>
                                </div>
                                {calculateNights() > 0 && (
                                    <div className="alert alert-info">
                                        <strong>Total:</strong> {calculateNights()} night(s) × ₹{bhaktnivas.pricePerNight} = <strong>₹{calculateTotalPrice()}</strong>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleCreateBooking} disabled={processing}>
                                    {processing ? 'Processing...' : 'Continue to Payment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && createdBooking && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Complete Payment</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-success mb-3">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Booking created successfully! Complete payment to confirm.
                                </div>
                                <h6>Booking Summary</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Property:</td>
                                            <td><strong>{bhaktnivas.name}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Check-in:</td>
                                            <td>{bookingData.checkInDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Check-out:</td>
                                            <td>{bookingData.checkOutDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Guests:</td>
                                            <td>{bookingData.numberOfGuests}</td>
                                        </tr>
                                        <tr className="table-active">
                                            <td><strong>Total Amount:</strong></td>
                                            <td><strong>₹{createdBooking.totalAmount}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr />
                                <h6>Payment Method</h6>
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="upi" defaultChecked />
                                    <label className="form-check-label" htmlFor="upi">
                                        UPI / PhonePe / Google Pay
                                    </label>
                                </div>
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="card" />
                                    <label className="form-check-label" htmlFor="card">
                                        Credit / Debit Card
                                    </label>
                                </div>
                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="netbanking" />
                                    <label className="form-check-label" htmlFor="netbanking">
                                        Net Banking
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={handlePayment} disabled={processing}>
                                    {processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-credit-card me-2"></i>
                                            Pay ₹{createdBooking.totalAmount}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BhaktnivasDetails;
