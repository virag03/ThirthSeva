import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from '../../components/common/ImageUpload';
import LeafletMap from '../../components/common/LeafletMap';
import { templeService } from '../../services/templeService';

const CreateTemple = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [validationErrors, setValidationErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        city: '',
        state: '',
        description: '',
        imagePath: null,
        latitude: '',
        longitude: ''
    });
    const [loading, setLoading] = useState(false);
    const [loadingTemple, setLoadingTemple] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            loadTemple();
        }
    }, [id]);

    const loadTemple = async () => {
        try {
            const temple = await templeService.getById(id);
            setFormData({
                name: temple.name,
                location: temple.location,
                city: temple.city,
                state: temple.state,
                description: temple.description || '',
                imagePath: temple.imagePath,
                latitude: temple.latitude || '',
                longitude: temple.longitude || ''
            });
        } catch (error) {
            console.error('Failed to load temple:', error);
            alert('Failed to load temple details');
            navigate('/provider/temples');
        } finally {
            setLoadingTemple(false);
        }
    };

    const validateDescription = (description) => {
        return description.length >= 10 && description.length <= 1000;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation for description
        if (name === 'description' && value) {
            const errors = { ...validationErrors };
            if (!validateDescription(value)) {
                errors.description = 'Description must be 10-1000 characters';
            } else {
                errors.description = '';
            }
            setValidationErrors(errors);
        } else if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (formData.description && !validateDescription(formData.description)) {
            errors.description = 'Description must be 10-1000 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageUpload = (imagePath) => {
        setFormData(prev => ({
            ...prev,
            imagePath
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            if (isEditMode) {
                await templeService.update(id, formData);
                alert('Temple updated successfully!');
            } else {
                await templeService.create(formData);
                alert('Temple created successfully!');
            }
            navigate('/provider/temples');
        } catch (error) {
            console.error('Error saving temple:', error);
            alert(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} temple`);
        } finally {
            setLoading(false);
        }
    };

    if (loadingTemple) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Loading temple...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4">
                <i className="bi bi-building me-3"></i>
                {isEditMode ? 'Edit Temple' : 'Create New Temple'}
            </h1>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Temple Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Location/Address *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">City *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">State *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Picker */}
                                <div className="mb-3">
                                    <label className="form-label">Location (Click on map to select)</label>
                                    <div className="card">
                                        <LeafletMap
                                            onLocationSelect={(latlng) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    latitude: latlng.lat,
                                                    longitude: latlng.lng
                                                }));
                                            }}
                                            selectedPosition={
                                                formData.latitude && formData.longitude
                                                    ? { lat: formData.latitude, lng: formData.longitude }
                                                    : null
                                            }
                                            center={[20.5937, 78.9629]}
                                            zoom={4}
                                        />
                                    </div>
                                    {formData.latitude && (
                                        <div className="form-text text-success">
                                            <i className="bi bi-geo-alt-fill me-1"></i>
                                            Location selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                        name="description"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                    {validationErrors.description && (
                                        <div className="invalid-feedback">{validationErrors.description}</div>
                                    )}
                                    <small className="text-muted">Must be 10-1000 characters</small>
                                </div>

                                <ImageUpload
                                    onImageUpload={handleImageUpload}
                                    initialImage={formData.imagePath ? `${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}${formData.imagePath}` : null}
                                />

                                <div className="d-flex gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                {isEditMode ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>
                                                {isEditMode ? 'Update Temple' : 'Create Temple'}
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/provider/temples')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTemple;
