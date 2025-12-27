import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { foodService } from '../../services/darshanService'; // foodService is exported from here
import { templeService } from '../../services/templeService';

const MyListings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bhaktnivas');
    const [bhaktnivasList, setBhaktnivasList] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Bhaktnivas form data
    const [bhaktnivasForm, setBhaktnivasForm] = useState({
        name: '',
        templeId: '',
        description: '',
        pricePerNight: '',
        capacity: '',
        amenities: '',
        contactPhone: '',
        isAvailable: true
    });

    // Food service form data
    const [foodForm, setFoodForm] = useState({
        name: '',
        templeId: '',
        description: '',
        type: 'Prasadam',
        timing: '',
        averagePrice: '',
        distance: ''
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const templesData = await templeService.getAll();
            setTemples(templesData);

            if (activeTab === 'bhaktnivas') {
                const data = await bhaktnivasService.getMyListings();
                setBhaktnivasList(data);
            } else {
                // TODO: Load provider's food services when backend endpoint is ready
                setFoodList([]);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBhaktnivas = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...bhaktnivasForm,
                templeId: parseInt(bhaktnivasForm.templeId),
                pricePerNight: parseFloat(bhaktnivasForm.pricePerNight),
                capacity: parseInt(bhaktnivasForm.capacity)
            };

            if (editingItem) {
                await bhaktnivasService.update(editingItem.id, data);
                toast.success('Bhaktnivas updated successfully!');
            } else {
                await bhaktnivasService.create(data);
                toast.success('Bhaktnivas added successfully!');
            }

            setShowAddModal(false);
            resetBhaktnivasForm();
            loadData();
        } catch (error) {
            console.error('Failed to save bhaktnivas:', error);
            toast.error(error.response?.data?.message || 'Failed to save bhaktnivas');
        }
    };

    const handleAddFoodService = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...foodForm,
                templeId: parseInt(foodForm.templeId),
                averagePrice: parseFloat(foodForm.averagePrice)
            };

            await foodService.create(data);
            toast.success('Food service added successfully!');
            setShowAddModal(false);
            resetFoodForm();
            loadData();
        } catch (error) {
            console.error('Failed to save food service:', error);
            toast.error(error.response?.data?.message || 'Failed to save food service');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'bhaktnivas') {
            setBhaktnivasForm({
                name: item.name,
                templeId: item.templeId.toString(),
                description: item.description || '',
                pricePerNight: item.pricePerNight.toString(),
                capacity: item.capacity.toString(),
                amenities: item.amenities || '',
                contactPhone: item.contactPhone || '',
                isAvailable: item.isAvailable
            });
        }
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;

        try {
            if (activeTab === 'bhaktnivas') {
                await bhaktnivasService.delete(id);
            } else {
                await foodService.delete(id);
            }
            toast.success('Listing deleted successfully!');
            loadData();
        } catch (error) {
            console.error('Failed to delete listing:', error);
            toast.error('Failed to delete listing');
        }
    };

    const resetBhaktnivasForm = () => {
        setBhaktnivasForm({
            name: '',
            templeId: '',
            description: '',
            pricePerNight: '',
            capacity: '',
            amenities: '',
            contactPhone: '',
            isAvailable: true
        });
        setEditingItem(null);
    };

    const resetFoodForm = () => {
        setFoodForm({
            name: '',
            templeId: '',
            description: '',
            type: 'Prasadam',
            timing: '',
            averagePrice: '',
            distance: ''
        });
        setEditingItem(null);
    };

    return (
        <div className="container py-5">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-building me-3"></i>
                    My Listings
                </h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingItem(null);
                        activeTab === 'bhaktnivas' ? resetBhaktnivasForm() : resetFoodForm();
                        setShowAddModal(true);
                    }}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add {activeTab === 'bhaktnivas' ? 'Bhaktnivas' : 'Food Service'}
                </button>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'bhaktnivas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bhaktnivas')}
                    >
                        <i className="bi bi-building me-2"></i>
                        Bhaktnivas ({bhaktnivasList.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'food' ? 'active' : ''}`}
                        onClick={() => setActiveTab('food')}
                    >
                        <i className="bi bi-cup-hot me-2"></i>
                        Food Services ({foodList.length})
                    </button>
                </li>
            </ul>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Loading listings...</p>
                </div>
            ) : (
                <>
                    {/* Bhaktnivas Tab */}
                    {activeTab === 'bhaktnivas' && (
                        bhaktnivasList.length > 0 ? (
                            <div className="row g-4">
                                {bhaktnivasList.map(item => (
                                    <div key={item.id} className="col-md-6 col-lg-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="card-title">{item.name}</h5>
                                                    <span className={`badge ${item.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                                                        {item.isAvailable ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </div>
                                                <p className="text-muted mb-2">
                                                    <i className="bi bi-geo-alt me-1"></i>
                                                    {item.templeName}
                                                </p>
                                                <p className="mb-2">
                                                    <strong>₹{item.pricePerNight}</strong> per night
                                                </p>
                                                <p className="mb-2">
                                                    <i className="bi bi-people me-1"></i>
                                                    Capacity: {item.capacity}
                                                </p>
                                                {item.description && (
                                                    <p className="text-muted small">{item.description.substring(0, 100)}...</p>
                                                )}
                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <i className="bi bi-trash"></i> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card">
                                <div className="card-body text-center py-5">
                                    <i className="bi bi-building text-muted" style={{ fontSize: '5rem' }}></i>
                                    <h3 className="mt-4">No Bhaktn ivas Listings Yet</h3>
                                    <p>Click "Add Bhaktnivas" to create your first listing</p>
                                </div>
                            </div>
                        )
                    )}

                    {/* Food Services Tab */}
                    {activeTab === 'food' && (
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <i className="bi bi-cup-hot text-muted" style={{ fontSize: '5rem' }}></i>
                                <h3 className="mt-4">No Food Service Listings Yet</h3>
                                <p>Click "Add Food Service" to create your first listing</p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingItem ? 'Edit' : 'Add'} {activeTab === 'bhaktnivas' ? 'Bhaktnivas' : 'Food Service'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingItem(null);
                                        activeTab === 'bhaktnivas' ? resetBhaktnivasForm() : resetFoodForm();
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {activeTab === 'bhaktnivas' ? (
                                    <form onSubmit={handleAddBhaktnivas}>
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
                                        <div className="form-check mb-3">
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
                                            <button type="submit" className="btn btn-primary flex-grow-1">
                                                {editingItem ? 'Update' : 'Add'} Bhaktnivas
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setShowAddModal(false);
                                                    resetBhaktnivasForm();
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleAddFoodService}>
                                        <div className="mb-3">
                                            <label className="form-label">Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={foodForm.name}
                                                onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Temple *</label>
                                            <select
                                                className="form-select"
                                                value={foodForm.templeId}
                                                onChange={(e) => setFoodForm({ ...foodForm, templeId: e.target.value })}
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
                                        <div className="mb-3">
                                            <label className="form-label">Type *</label>
                                            <select
                                                className="form-select"
                                                value={foodForm.type}
                                                onChange={(e) => setFoodForm({ ...foodForm, type: e.target.value })}
                                                required
                                            >
                                                <option value="Prasadam">Prasadam</option>
                                                <option value="Food">Food</option>
                                                <option value="Shop">Shop</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={foodForm.description}
                                                onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Timing</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="6:00 AM - 10:00 PM"
                                                    value={foodForm.timing}
                                                    onChange={(e) => setFoodForm({ ...foodForm, timing: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Average Price (₹) *</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={foodForm.averagePrice}
                                                    onChange={(e) => setFoodForm({ ...foodForm, averagePrice: e.target.value })}
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Distance from Temple</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Within premises / 500m"
                                                value={foodForm.distance}
                                                onChange={(e) => setFoodForm({ ...foodForm, distance: e.target.value })}
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary flex-grow-1">
                                                Add Food Service
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => {
                                                    setShowAddModal(false);
                                                    resetFoodForm();
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyListings;
