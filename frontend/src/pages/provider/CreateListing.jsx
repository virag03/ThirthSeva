import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { templeService } from '../../services/templeService';
import BhaktnivasImageUpload from '../../components/common/BhaktnivasImageUpload';
import LeafletMap from '../../components/common/LeafletMap';

const CreateListing = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEditMode);
    const [validationErrors, setValidationErrors] = useState({});
    const [bhaktnivasForm, setBhaktnivasForm] = useState({
        name: '',
        templeId: '',
        description: '',
        pricePerNight: '',
        capacity: '',
        amenities: '',
        contactPhone: '',
        isAvailable: true,
        imageUrl: '',
        latitude: '',
        longitude: ''
    });

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]{3,100}$/;
        return nameRegex.test(name);
    };

    const validateDescription = (description) => {
        return description.length >= 10 && description.length <= 500;
    };

    const validateContactPhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleFormChange = (field, value) => {
        setBhaktnivasForm({ ...bhaktnivasForm, [field]: value });
        
        // Real-time validation
        const errors = { ...validationErrors };
        if (field === 'name' && value) {
            if (!validateName(value)) {
                errors.name = 'Name must be 3-100 characters and contain only letters';
            } else {
                errors.name = '';
            }
        } else if (field === 'description' && value) {
            if (!validateDescription(value)) {
                errors.description = 'Description must be 10-500 characters';
            } else {
                errors.description = '';
            }
        } else if (field === 'contactPhone' && value) {
            if (!validateContactPhone(value)) {
                errors.contactPhone = 'Enter valid 10-digit mobile number starting with 6-9';
            } else {
                errors.contactPhone = '';
            }
        }
        setValidationErrors(errors);
    };

    const validateForm = () => {
        const errors = {};
        
        if (!validateName(bhaktnivasForm.name)) {
            errors.name = 'Name must be 3-100 characters and contain only letters';
        }
        
        if (bhaktnivasForm.description && !validateDescription(bhaktnivasForm.description)) {
            errors.description = 'Description must be 10-500 characters';
        }
        
        if (bhaktnivasForm.contactPhone && !validateContactPhone(bhaktnivasForm.contactPhone)) {
            errors.contactPhone = 'Enter valid 10-digit mobile number starting with 6-9';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        loadTemples();
        if (isEditMode) {
            loadListing();
        }
    }, [id]);

    const loadListing = async () => {
        try {
            const data = await bhaktnivasService.getById(id);
            setBhaktnivasForm({
                name: data.name,
                templeId: data.templeId.toString(),
                description: data.description || '',
                pricePerNight: data.pricePerNight.toString(),
                capacity: data.capacity.toString(),
                amenities: data.amenities || '',
                contactPhone: data.contactPhone || '',
                isAvailable: data.isAvailable,
                imageUrl: data.imageUrl || '',
                latitude: data.latitude || '',
                longitude: data.longitude || ''
            });
        } catch (error) {
            console.error('Failed to load listing:', error);
            toast.error('Failed to load listing details');
            navigate('/provider/listings');
        } finally {
            setLoadingData(false);
        }
    };

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
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            const data = {
                ...bhaktnivasForm,
                templeId: parseInt(bhaktnivasForm.templeId),
                pricePerNight: parseFloat(bhaktnivasForm.pricePerNight),
                capacity: parseInt(bhaktnivasForm.capacity),
                latitude: bhaktnivasForm.latitude ? parseFloat(bhaktnivasForm.latitude) : null,
                longitude: bhaktnivasForm.longitude ? parseFloat(bhaktnivasForm.longitude) : null
            };

            if (isEditMode) {
                await bhaktnivasService.update(id, data);
                toast.success('Bhaktnivas updated successfully!');
            } else {
                await bhaktnivasService.create(data);
                toast.success('Bhaktnivas added successfully!');
            }
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

    if (loadingData) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">Loading listing details...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <ToastContainer position="top-right" style={{ zIndex: 9999, top: '80px' }} />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-plus-circle me-3"></i>
                    {isEditMode ? 'Edit Bhaktnivas Listing' : 'Create New Bhaktnivas Listing'}
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
                                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                value={bhaktnivasForm.name}
                                onChange={(e) => handleFormChange('name', e.target.value)}
                                required
                            />
                            {validationErrors.name && (
                                <div className="invalid-feedback">{validationErrors.name}</div>
                            )}
                            
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
                                className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                rows="3"
                                value={bhaktnivasForm.description}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                            ></textarea>
                            {validationErrors.description && (
                                <div className="invalid-feedback">{validationErrors.description}</div>
                            )}
                            
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
                                className={`form-control ${validationErrors.contactPhone ? 'is-invalid' : ''}`}
                                value={bhaktnivasForm.contactPhone}
                                onChange={(e) => handleFormChange('contactPhone', e.target.value)}
                            />
                            {validationErrors.contactPhone && (
                                <div className="invalid-feedback">{validationErrors.contactPhone}</div>
                            )}
                            
                        </div>

                        {/* Location Picker */}
                        <div className="mb-3">
                            <label className="form-label">Location (Click on map to select)</label>
                            <div className="card">
                                <LeafletMap
                                    onLocationSelect={(latlng) => {
                                        setBhaktnivasForm({
                                            ...bhaktnivasForm,
                                            latitude: latlng.lat,
                                            longitude: latlng.lng
                                        });
                                    }}
                                    selectedPosition={
                                        bhaktnivasForm.latitude && bhaktnivasForm.longitude
                                            ? { lat: bhaktnivasForm.latitude, lng: bhaktnivasForm.longitude }
                                            : null
                                    }
                                    center={[20.5937, 78.9629]}
                                    zoom={4}
                                />
                            </div>
                            {bhaktnivasForm.latitude && (
                                <div className="form-text text-success">
                                    <i className="bi bi-geo-alt-fill me-1"></i>
                                    Location selected: {bhaktnivasForm.latitude.toFixed(6)}, {bhaktnivasForm.longitude.toFixed(6)}
                                </div>
                            )}
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
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    isEditMode ? 'Update Bhaktnivas' : 'Create Bhaktnivas'
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
