import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { templeService } from '../../services/templeService';
import { darshanService } from '../../services/darshanService';
import { bookingService } from '../../services/bookingService';
import { RAZORPAY_CONFIG } from '../../config';

const DarshanBooking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [temples, setTemples] = useState([]);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [visitors, setVisitors] = useState(1);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [darshanSlots, setDarshanSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadTemples();
    }, []);

    useEffect(() => {
        if (selectedTemple && selectedDate) {
            loadDarshanSlots();
        }
    }, [selectedTemple, selectedDate]);

    const loadTemples = async () => {
        try {
            const data = await templeService.getAll();
            setTemples(data);
        } catch (error) {
            console.error('Failed to load temples:', error);
            toast.error('Failed to load temples');
        } finally {
            setLoading(false);
        }
    };

    const loadDarshanSlots = async () => {
        try {
            setLoadingSlots(true);
            const slots = await darshanService.getAvailableSlots(selectedTemple.id, selectedDate);
            setDarshanSlots(slots);
        } catch (error) {
            console.error('Failed to load darshan slots:', error);
            toast.error('Failed to load available slots');
            setDarshanSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning('Please login to book darshan');
            navigate('/login');
            return;
        }

        setProcessing(true);
        try {
            const booking = {
                templeId: selectedTemple.id,
                darshanSlotId: selectedSlot.id,
                numberOfPersons: visitors,
                totalAmount: (selectedSlot.price || 0) * visitors
            };

            // Validate availability before showing payment
            await bookingService.validateAvailability(booking);
            setBookingData(booking);
            setShowPaymentModal(true);
            toast.success('Slot is available! Please complete payment to confirm booking.');
        } catch (err) {
            console.error('Validation failed:', err);
            toast.error(err.response?.data?.message || 'Slot is no longer available');
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (!window.Razorpay) {
            toast.error('Razorpay SDK failed to load. Please refresh the page.');
            return;
        }

        if (!bookingData || !bookingData.totalAmount) {
            toast.error('Invalid booking data.');
            return;
        }

        setProcessing(true);
        try {
            const options = {
                key: RAZORPAY_CONFIG.KEY_ID,
                amount: Math.round(bookingData.totalAmount * 100),
                currency: "INR",
                name: "TirthSeva",
                description: `Darshan Pass for ${selectedTemple?.name || 'Temple'}`,
                handler: async function (response) {
                    try {
                        setProcessing(true);
                        const result = await bookingService.confirmPaymentAndBook(bookingData, response.razorpay_payment_id);
                        toast.success('🎉 Payment successful! Your darshan is confirmed!');
                        setTimeout(() => navigate('/user/bookings'), 2000);
                    } catch (err) {
                        console.error('Booking creation failed:', err);
                        toast.error(err.response?.data?.message || 'Failed to create booking after payment.');
                    } finally {
                        setProcessing(false);
                    }
                },
                theme: { color: "#FF6B00" },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Razorpay failed:', err);
            toast.error('Gateway initialization failed.');
            setProcessing(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#FFF9F5', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <ToastContainer />
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' }}>
                        Book Darshan Pass
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Reserve your darshan time slot in advance and skip the long queues
                    </p>
                </div>

                {/* Step Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem',
                        borderRadius: '2rem', backgroundColor: step >= 1 ? '#FF6B00' : '#FFF',
                        color: step >= 1 ? '#FFF' : '#666', fontWeight: '600',
                        border: step >= 1 ? 'none' : '1px solid #E5E5E5'
                    }}>
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            backgroundColor: step >= 1 ? '#FFF' : '#E5E5E5',
                            color: step >= 1 ? '#FF6B00' : '#666',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '700'
                        }}>1</span>
                        Select Temple
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem',
                        borderRadius: '2rem', backgroundColor: step >= 2 ? '#FF6B00' : '#FFF',
                        color: step >= 2 ? '#FFF' : '#666', fontWeight: '600',
                        border: step >= 2 ? 'none' : '1px solid #E5E5E5'
                    }}>
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            backgroundColor: step >= 2 ? '#FFF' : '#E5E5E5',
                            color: step >= 2 ? '#FF6B00' : '#666',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '700'
                        }}>2</span>
                        Select Date
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem',
                        borderRadius: '2rem', backgroundColor: step >= 3 ? '#FF6B00' : '#FFF',
                        color: step >= 3 ? '#FFF' : '#666', fontWeight: '600',
                        border: step >= 3 ? 'none' : '1px solid #E5E5E5'
                    }}>
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            backgroundColor: step >= 3 ? '#FFF' : '#E5E5E5',
                            color: step >= 3 ? '#FF6B00' : '#666',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '700'
                        }}>3</span>
                        Select Time Slot
                    </div>
                </div>

                {/* Step 1: Select Temple */}
                {step === 1 && (
                    <div style={{ backgroundColor: '#FFF', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                            <span style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: '#FF6B00', color: '#FFF',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                marginRight: '0.75rem', fontWeight: '700'
                            }}>1</span>
                            Select Temple
                        </h3>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {temples.slice(0, 10).map((temple) => (
                                <div
                                    key={temple.id}
                                    onClick={() => {
                                        setSelectedTemple(temple);
                                        setStep(2);
                                    }}
                                    style={{
                                        padding: '1.25rem', border: '2px solid',
                                        borderColor: selectedTemple?.id === temple.id ? '#FF6B00' : '#E5E5E5',
                                        borderRadius: '0.75rem', cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: selectedTemple?.id === temple.id ? '#FFF9F5' : '#FFF'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '0.25rem', color: '#333' }}>{temple.name}</h4>
                                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                                                <i className="bi bi-geo-alt me-1"></i>
                                                {temple.city}, {temple.state}
                                            </p>
                                        </div>
                                        <i className="bi bi-chevron-right" style={{ color: '#FF6B00', fontSize: '1.5rem' }}></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select Date */}
                {step === 2 && (
                    <div style={{ backgroundColor: '#FFF', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                            <span style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: '#FF6B00', color: '#FFF',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                marginRight: '0.75rem', fontWeight: '700'
                            }}>2</span>
                            Select Date
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                <i className="bi bi-calendar3 me-2"></i>
                                Darshan Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                style={{
                                    width: '100%', padding: '0.75rem',
                                    border: '1px solid #E5E5E5', borderRadius: '0.5rem',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setStep(1)}
                                style={{
                                    flex: 1, padding: '0.75rem',
                                    border: '1px solid #E5E5E5', borderRadius: '0.5rem',
                                    backgroundColor: '#FFF', color: '#333',
                                    fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedDate}
                                style={{
                                    flex: 1, padding: '0.75rem',
                                    border: 'none', borderRadius: '0.5rem',
                                    backgroundColor: selectedDate ? '#FF6B00' : '#E5E5E5',
                                    color: selectedDate ? '#FFF' : '#999',
                                    fontWeight: '600',
                                    cursor: selectedDate ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Select Time Slot */}
                {step === 3 && (
                    <div style={{ backgroundColor: '#FFF', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                            <span style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                backgroundColor: '#FF6B00', color: '#FFF',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                marginRight: '0.75rem', fontWeight: '700'
                            }}>3</span>
                            Select Time Slot
                        </h3>

                        {loadingSlots ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2">Loading available slots...</p>
                            </div>
                        ) : darshanSlots.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                {darshanSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        style={{
                                            padding: '1.25rem', border: '2px solid',
                                            borderColor: selectedSlot?.id === slot.id ? '#FF6B00' : '#E5E5E5',
                                            borderRadius: '0.75rem', cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            backgroundColor: selectedSlot?.id === slot.id ? '#FFF9F5' : '#FFF'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <i className="bi bi-clock" style={{ color: '#FF6B00', fontSize: '1.5rem' }}></i>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '1rem',
                                                backgroundColor: slot.price === 0 ? '#34C759' : '#FF6B00',
                                                color: '#FFF', fontSize: '13px', fontWeight: '600'
                                            }}>
                                                {slot.price === 0 ? 'FREE' : `₹${slot.price}`}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                                            {slot.startTime} - {slot.endTime}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                            Available: {slot.availableSlots} / {slot.capacity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info">No darshan slots available for this date</div>
                        )}

                        {darshanSlots.length > 0 && selectedSlot && (
                            <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#F8F9FA', borderRadius: '0.75rem' }}>
                                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: '#333' }}>
                                    <i className="bi bi-people me-2"></i>
                                    Number of Visitors (Max 4)
                                </label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setVisitors(num)}
                                            style={{
                                                width: '50px', height: '50px', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '2px solid',
                                                borderColor: visitors === num ? '#FF6B00' : '#E5E5E5',
                                                backgroundColor: visitors === num ? '#FF6B00' : '#FFF',
                                                color: visitors === num ? '#FFF' : '#333',
                                                fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <div style={{ fontSize: '14px', color: '#666' }}>Total Amount</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FF6B00' }}>
                                            ₹{(selectedSlot.price || 0) * visitors}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setStep(2)}
                                style={{
                                    flex: 1, padding: '0.75rem',
                                    border: '1px solid #E5E5E5', borderRadius: '0.5rem',
                                    backgroundColor: '#FFF', color: '#333',
                                    fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleBooking}
                                disabled={!selectedSlot || processing}
                                style={{
                                    flex: 1, padding: '0.75rem',
                                    border: 'none', borderRadius: '0.5rem',
                                    backgroundColor: selectedSlot ? '#FF6B00' : '#E5E5E5',
                                    color: selectedSlot ? '#FFF' : '#999',
                                    fontWeight: '600',
                                    cursor: selectedSlot ? 'pointer' : 'not-allowed'
                                }}
                            >
                                {processing ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && bookingData && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Complete Payment</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info mb-3">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Complete payment to confirm your darshan booking.
                                </div>
                                <h6>Booking Summary</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Temple:</td>
                                            <td><strong>{selectedTemple?.name}</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Date:</td>
                                            <td>{selectedDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Time:</td>
                                            <td>
                                                {selectedSlot.startTime} - {selectedSlot.endTime}
                                            </td>
                                        </tr>
                                        <tr className="table-active">
                                            <td><strong>Total Amount:</strong></td>
                                            <td><strong>₹{bookingData.totalAmount}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="alert alert-light border small">
                                    <i className="bi bi-shield-check me-2 text-success"></i>
                                    Secure payment powered by Razorpay
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
                                            Pay ₹{bookingData.totalAmount}
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

export default DarshanBooking;
