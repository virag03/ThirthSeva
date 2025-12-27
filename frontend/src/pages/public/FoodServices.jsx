import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { foodService } from '../../services/foodService';
import { templeService } from '../../services/templeService';
import { bookingService } from '../../services/bookingService';
import { templeDetailsService } from '../../services/templeDetailsService';
import TempleDetailsModal from '../../components/common/TempleDetailsModal';

const FoodServices = () => {
    const navigate = useNavigate();
    const [temples, setTemples] = useState([]);
    const [selectedTempleId, setSelectedTempleId] = useState('');
    const [foodServices, setFoodServices] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [createdBooking, setCreatedBooking] = useState(null);
    const [processing, setProcessing] = useState(false);

    // Temple details modal state
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [templeDetails, setTempleDetails] = useState(null);
    const [selectedTemple, setSelectedTemple] = useState(null);

    useEffect(() => {
        loadTemples();
    }, []);

    useEffect(() => {
        if (selectedTempleId) {
            loadFoodServices();
        }
    }, [selectedTempleId, selectedType]);

    const loadTemples = async () => {
        try {
            const data = await templeService.getAll();
            setTemples(data);
            if (data.length > 0) {
                setSelectedTempleId(data[0].id.toString());
            }
        } catch (error) {
            console.error('Failed to load temples:', error);
            setError('Failed to load temples. Please try again later.');
        }
    };

    const loadFoodServices = async () => {
        if (!selectedTempleId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await foodService.getByTemple(
                parseInt(selectedTempleId),
                selectedType || null
            );
            setFoodServices(data);
        } catch (error) {
            console.error('Failed to load food services:', error);
            setError('Failed to load food services. Please try again later.');
            setFoodServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOrder = (service) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning('Please login to order food');
            navigate('/login');
            return;
        }
        setSelectedService(service);
        setQuantity(1);
    };

    const handleConfirmOrder = async () => {
        if (!selectedService) return;

        setProcessing(true);
        try {
            const booking = {
                templeId: parseInt(selectedTempleId),
                totalAmount: selectedService.averagePrice * quantity,
                specialRequests: `Food Order: ${selectedService.name} (${selectedService.type}) - Quantity: ${quantity}`
            };

            const result = await bookingService.create(booking);
            setCreatedBooking(result);
            setSelectedService(null);
            setShowPaymentModal(true);
            toast.success('Food order created! Please complete payment.');
        } catch (err) {
            console.error('Order failed:', err);
            toast.error(err.response?.data?.message || 'Failed to create order');
        } finally {
            setProcessing(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('🎉 Payment successful! Your food order is confirmed!', {
                position: 'top-center',
                autoClose: 3000,
            });

            setShowPaymentModal(false);

            setTimeout(() => {
                navigate('/user/bookings');
            }, 2000);
        } catch (err) {
            toast.error('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'prasadam':
                return 'bi-heart-fill';
            case 'food':
                return 'bi-cup-hot';
            case 'shop':
                return 'bi-shop';
            default:
                return 'bi-cup-hot';
        }
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'prasadam':
                return '#7B1E1E';
            case 'food':
                return '#FF9933';
            case 'shop':
                return '#138808';
            default:
                return '#7B1E1E';
        }
    };

    const handleViewDetails = async () => {
        if (!selectedTempleId) return;

        const temple = temples.find(t => t.id === parseInt(selectedTempleId));
        if (!temple) return;

        setSelectedTemple(temple);
        setShowModal(true);
        setModalLoading(true);
        setModalError(null);
        setTempleDetails(null);

        try {
            const details = await templeDetailsService.getDetails(
                temple.id,
                temple.name,
                temple.city,
                temple.state
            );
            setTempleDetails(details);
        } catch (error) {
            console.error('Failed to load temple details:', error);
            setModalError('Failed to load temple details. Please try again later.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTempleDetails(null);
        setModalError(null);
        setSelectedTemple(null);
    };

    return (
        <div className="container py-5">
            <ToastContainer />
            <h1 className="mb-4">
                <i className="bi bi-cup-hot me-3"></i>
                Food & Nearby Services
            </h1>

            {/* Temple and Type Selection */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="templeSelect" className="form-label">
                                <i className="bi bi-building me-2"></i>
                                Select Temple
                            </label>
                            <select
                                id="templeSelect"
                                className="form-select form-select-lg"
                                value={selectedTempleId}
                                onChange={(e) => setSelectedTempleId(e.target.value)}
                            >
                                <option value="">-- Select a Temple --</option>
                                {temples.map((temple) => (
                                    <option key={temple.id} value={temple.id}>
                                        {temple.name} - {temple.city}, {temple.state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="typeSelect" className="form-label">
                                <i className="bi bi-funnel me-2"></i>
                                Filter by Type
                            </label>
                            <select
                                id="typeSelect"
                                className="form-select form-select-lg"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="Prasadam">Prasadam</option>
                                <option value="Food">Food</option>
                                <option value="Shop">Shop</option>
                            </select>
                        </div>
                        <div className="col-md-1 d-flex align-items-end">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleViewDetails}
                                disabled={!selectedTempleId}
                                title="View temple details"
                                style={{ minHeight: '48px' }}
                            >
                                <i className="bi bi-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-maroon" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading food services...</p>
                </div>
            )}

            {/* Food Services List */}
            {!loading && selectedTempleId && (
                <>
                    {foodServices.length > 0 ? (
                        <>
                            <h3 className="mb-4">
                                Found {foodServices.length} service{foodServices.length !== 1 ? 's' : ''}
                            </h3>
                            <div className="row g-4">
                                {foodServices.map((service) => (
                                    <div key={service.id} className="col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm hover-card">
                                            <div
                                                className="card-header text-white"
                                                style={{ backgroundColor: getTypeColor(service.type) }}
                                            >
                                                <h5 className="mb-0">
                                                    <i className={`bi ${getTypeIcon(service.type)} me-2`}></i>
                                                    {service.name}
                                                </h5>
                                            </div>
                                            <div className="card-body d-flex flex-column">
                                                <div className="mb-3">
                                                    <span
                                                        className="badge rounded-pill px-3 py-2"
                                                        style={{
                                                            backgroundColor: getTypeColor(service.type),
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        {service.type}
                                                    </span>
                                                </div>

                                                {service.description && (
                                                    <p className="text-muted mb-3">
                                                        {service.description}
                                                    </p>
                                                )}

                                                <div className="d-flex flex-column gap-2 mb-3">
                                                    {service.timing && (
                                                        <div>
                                                            <i className="bi bi-clock text-maroon me-2"></i>
                                                            <strong>Timing:</strong> {service.timing}
                                                        </div>
                                                    )}

                                                    {service.distance && (
                                                        <div>
                                                            <i className="bi bi-geo-alt text-maroon me-2"></i>
                                                            <strong>Distance:</strong> {service.distance}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <i className="bi bi-currency-rupee text-maroon me-2"></i>
                                                        <strong>Avg. Price:</strong> ₹{service.averagePrice}
                                                    </div>
                                                </div>

                                                <button
                                                    className="btn btn-primary mt-auto"
                                                    style={{ backgroundColor: '#FF6B00', border: 'none' }}
                                                    onClick={() => handleOrder(service)}
                                                >
                                                    <i className="bi bi-cart-plus me-2"></i>
                                                    Order Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="card p-5 text-center">
                            <i className="bi bi-cup-hot text-muted" style={{ fontSize: '5rem' }}></i>
                            <h3 className="mt-4">No Food Services Found</h3>
                            <p style={{ fontSize: '1.2rem' }} className="text-muted">
                                {selectedType
                                    ? `No ${selectedType.toLowerCase()} services available for this temple.`
                                    : 'No food services available for this temple yet.'
                                }
                            </p>
                            <p className="text-muted">
                                Please try selecting a different temple or filter option.
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Initial State - No Temple Selected */}
            {!loading && !selectedTempleId && (
                <div className="card p-5 text-center">
                    <i className="bi bi-cup-hot text-maroon" style={{ fontSize: '5rem' }}></i>
                    <h2 className="mt-4">Find Nearby Food & Services</h2>
                    <p style={{ fontSize: '1.2rem' }}>
                        Discover prasadam centers, affordable food options, and nearby shops.
                    </p>
                    <p className="text-muted">
                        Please select a temple above to view available food services.
                    </p>
                </div>
            )}

            {/* Order Modal */}
            {selectedService && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order {selectedService.name}</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedService(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <span className="badge" style={{ backgroundColor: getTypeColor(selectedService.type) }}>
                                        {selectedService.type}
                                    </span>
                                </div>
                                <p className="text-muted">{selectedService.description}</p>

                                <div className="mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max="10"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="alert alert-info">
                                    <strong>Total:</strong> {quantity} × ₹{selectedService.averagePrice} = <strong>₹{selectedService.averagePrice * quantity}</strong>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setSelectedService(null)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleConfirmOrder} disabled={processing}>
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
                                    Food order created! Complete payment to confirm.
                                </div>
                                <h6>Order Summary</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Temple:</td>
                                            <td><strong>{temples.find(t => t.id === parseInt(selectedTempleId))?.name}</strong></td>
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
                                    <label className="form-check-label" htmlFor="upi">UPI / PhonePe / Google Pay</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="card" />
                                    <label className="form-check-label" htmlFor="card">Credit / Debit Card</label>
                                </div>
                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="netbanking" />
                                    <label className="form-check-label" htmlFor="netbanking">Net Banking</label>
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

            {/* Temple Details Modal */}
            {showModal && (
                <TempleDetailsModal
                    temple={selectedTemple}
                    details={templeDetails}
                    isLoading={modalLoading}
                    error={modalError}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default FoodServices;
