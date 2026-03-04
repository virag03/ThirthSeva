import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templeService } from '../../services/templeService';

const MyTemples = () => {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemples();
    }, []);

    const loadTemples = async () => {
        try {
            const data = await templeService.getMyTemples();
            setTemples(data);
        } catch (error) {
            console.error('Failed to load temples:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this temple?')) {
            return;
        }

        try {
            await templeService.delete(id);
            alert('Temple deleted successfully');
            loadTemples();
        } catch (error) {
            console.error('Failed to delete temple:', error);
            alert(error.response?.data?.message || 'Failed to delete temple');
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Loading temples...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>
                    <i className="bi bi-building me-3"></i>
                    My Temples
                </h1>
                <Link to="/provider/temples/create" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Temple
                </Link>
            </div>

            {temples.length > 0 ? (
                <div className="row g-4">
                    {temples.map(temple => (
                        <div key={temple.id} className="col-md-6 col-lg-4">
                            <div className="card h-100">
                                {temple.imagePath && (
                                    <img
                                        src={`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}${temple.imagePath}`}
                                        alt={temple.name}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{temple.name}</h5>
                                    <p className="text-muted mb-2">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {temple.city}, {temple.state}
                                    </p>
                                    <p className="card-text">
                                        {temple.description ?
                                            temple.description.substring(0, 100) + (temple.description.length > 100 ? '...' : '')
                                            : 'No description available'}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex gap-2">
                                            <Link
                                                to={`/provider/temples/edit/${temple.id}`}
                                                className="btn btn-sm btn-outline-primary flex-fill"
                                            >
                                                <i className="bi bi-pencil me-1"></i>
                                                Edit
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger flex-fill"
                                                onClick={() => handleDelete(temple.id)}
                                            >
                                                <i className="bi bi-trash me-1"></i>
                                                Delete
                                            </button>
                                        </div>
                                        <Link
                                            to={`/provider/temples/${temple.id}/darshan`}
                                            className="btn btn-sm btn-primary w-100"
                                        >
                                            <i className="bi bi-calendar-check me-1"></i>
                                            Manage Darshan Slots
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <div className="card-body p-5 text-center">
                        <i className="bi bi-building text-muted" style={{ fontSize: '5rem' }}></i>
                        <h3 className="mt-4">No Temples Yet</h3>
                        <p style={{ fontSize: '1.2rem' }}>
                            You haven't created any temples yet. Add your first temple to get started!
                        </p>
                        <Link to="/provider/temples/create" className="btn btn-primary mt-3">
                            <i className="bi bi-plus-circle me-2"></i>
                            Create Your First Temple
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTemples;
