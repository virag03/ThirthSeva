import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { templeService } from '../../services/templeService';
import BhaktnivasImageUpload from '../../components/common/BhaktnivasImageUpload';

const CreateListing = () => {
    const navigate = useNavigate();
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bhaktnivasForm, setBhaktnivasForm] = useState({
        name: '',
        templeId: '',
        description: '',
        pricePerNight: '',
        capacity: '',
        amenities: '',
        contactPhone: '',
        isAvailable: true,
        imageUrl: ''
    });

    useEffect(() => {
        loadTemples();
    }, []);

    const loadTemples = async () => {
        try {
            const templesData = await templeService.getAll();
            setTemples(templesData);
        } catch (error) {
            console.error('Failed to load temples:', error);
            toast.error('Failed to load temples');
        }
    };

    const handleImageUpload = (imagePath) => {
        setBhaktnivasForm({ ...bhaktnivasForm, imageUrl: imagePath || '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                ...bhaktnivasForm,
                templeId: parseInt(bhaktnivasForm.templeId),
                pricePerNight: parseFloat(bhaktnivasForm.pricePerNight),
                capacity: parseInt(bhaktnivasForm.capacity)
            };

            await bhaktnivasService.create(data);
            toast.success('Bhaktnivas added successfully!');
            setTimeout(() => {
                navigate('/provider/listings');
            }, 1500);
        } catch (error) {
            console.error('Failed to save bhaktnivas:', error);
            toast.error(error.response?.data?.message || 'Failed to save bhaktnivas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <ToastContainer position="top-right" style={{ zIndex: 9999, top: '80px' }} />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-plus-circle me-3"></i>
                    Create New Bhaktnivas Listing
                </h1>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/provider/listings')}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Listings
                </button>
            </div>

            <div className="card">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={bhaktnivasForm.name}
                                onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Temple *</label>
                            <select
                                className="form-select"
                                value={bhaktnivasForm.templeId}
                                onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, templeId: e.target.value })}
                                required
                            >
                                <option value="">Select Temple</option>
                                {temples.map(temple => (
                                    <option key={temple.id} value={temple.id}>
                                        {temple.name} - {temple.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <BhaktnivasImageUpload 
                            onImageUpload={handleImageUpload}
                            initialImage={bhaktnivasForm.imageUrl}
                        />
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Price Per Night (₹) *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={bhaktnivasForm.pricePerNight}
                                    onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, pricePerNight: e.target.value })}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Capacity (persons) *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={bhaktnivasForm.capacity}
                                    onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, capacity: e.target.value })}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={bhaktnivasForm.description}
                                onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, description: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Amenities (comma-separated)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="WiFi, AC, TV, Hot Water"
                                value={bhaktnivasForm.amenities}
                                onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, amenities: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contact Phone</label>
                            <input
                                type="tel"
                                className="form-control"
                                value={bhaktnivasForm.contactPhone}
                                onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, contactPhone: e.target.value })}
                            />
                        </div>
                        <div className="form-check mb-4">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isAvailable"
                                checked={bhaktnivasForm.isAvailable}
                                onChange={(e) => setBhaktnivasForm({ ...bhaktnivasForm, isAvailable: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="isAvailable">
                                Available for booking
                            </label>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                type="submit" 
                                className="btn btn-primary flex-grow-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Bhaktnivas'
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/provider/listings')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
