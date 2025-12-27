import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { bookingService } from '../../services/bookingService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        temples: 0,
        bhaktnivas: 0,
        users: 0,
        bookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // Fetch all data
            const [bhaktnivasData, bookingsData] = await Promise.all([
                bhaktnivasService.getAll(),
                bookingService.getAll()
            ]);

            setStats({
                temples: 0, // Removed - providers manage temples now
                bhaktnivas: bhaktnivasData.length,
                users: 0, // Would need a users API endpoint
                bookings: bookingsData.length
            });
        } catch (error) {
            console.error('Failed to load statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4">
                <i className="bi bi-shield-lock me-3"></i>
                Admin Dashboard
            </h1>
            <p className="lead">Welcome, {user?.name}!</p>

            <div className="row g-4 mt-3">
                <div className="col-md-4">
                    <div className="card text-center bg-maroon text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{loading ? '...' : stats.bhaktnivas}</h2>
                            <p style={{ fontSize: '1.2rem' }}>Bhaktnivas</p>
                            <Link to="/admin/bhaktnivas" className="btn btn-light">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center bg-success text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{loading ? '...' : stats.users}</h2>
                            <p style={{ fontSize: '1.2rem' }}>Users</p>
                            <Link to="/admin/users" className="btn btn-light">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card text-center bg-info text-white">
                        <div className="card-body py-4">
                            <h2 className="display-4">{loading ? '...' : stats.bookings}</h2>
                            <p style={{ fontSize: '1.2rem' }}>Bookings</p>
                            <Link to="/admin/bookings" className="btn btn-light">
                                View All
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
