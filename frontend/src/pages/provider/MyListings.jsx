import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { templeService } from '../../services/templeService';

const MyListings = () => {
    const navigate = useNavigate();
    const [bhaktnivasList, setBhaktnivasList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await bhaktnivasService.getMyListings();
            setBhaktnivasList(data);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        navigate(`/provider/listings/edit/${item.id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;

        try {
            await bhaktnivasService.delete(id);
            toast.success('Listing deleted successfully!');
            loadData();
        } catch (error) {
            console.error('Failed to delete listing:', error);
            toast.error('Failed to delete listing');
        }
    };

    return (
        <div className="container py-5">
            <ToastContainer position="top-right" style={{ zIndex: 9999, top: '80px' }} />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-building me-3"></i>
                    My Listings
                </h1>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/provider/listings/create')}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Bhaktnivas
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Loading listings...</p>
                </div>
            ) : (
                <>
                    {/* Bhaktnivas List */}
                    {bhaktnivasList.length > 0 ? (
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
                                            <div className="d-flex flex-wrap gap-2 mt-3">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <i className="bi bi-pencil"></i> Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => navigate(`/provider/listings/${item.id}/availability`)}
                                                >
                                                    <i className="bi bi-calendar-check text-white"></i> Manage Capacity
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
                                <h3 className="mt-4">No Bhaktnivas Listings Yet</h3>
                                <p>Click "Add Bhaktnivas" to create your first listing</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyListings;
