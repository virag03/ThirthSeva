import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';




const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Data States
    const [stats, setStats] = useState({
        bhaktnivas: 0,
        users: 0,
        bookings: 0
    });
    const [users, setUsers] = useState([]);
    const [bhaktnivas, setBhaktnivas] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [bhaktnivasData, bookingsData, usersData] = await Promise.all([
                bhaktnivasService.getAll(),
                bookingService.getAll(),
                userService.getAll()
            ]);

            setBhaktnivas(bhaktnivasData);
            setBookings(bookingsData);
            setUsers(usersData);

            setStats({
                bhaktnivas: bhaktnivasData.length,
                users: usersData.length,
                bookings: bookingsData.length
            });
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleUserRoleUpdate = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        try {
            await userService.updateRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            alert('User role updated successfully');
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Failed to update role');
        }
    };

    const handleUserDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await userService.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    const handleBhaktnivasDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await bhaktnivasService.delete(id);
            setBhaktnivas(bhaktnivas.filter(b => b.id !== id));
            alert('Bhaktnivas deleted successfully');
        } catch (error) {
            console.error('Failed to delete bhaktnivas:', error);
            alert('Failed to delete bhaktnivas');
        }
    };

    const handleBookingStatusUpdate = async (id, status) => {
        if (!window.confirm(`Change booking status to ${status}?`)) return;
        try {
            await bookingService.updateStatus(id, status);
            setBookings(bookings.map(b => b.id === id ? { ...b, bookingStatus: status } : b));
            // Reload to refresh dependent data if needed, or just update local state
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    const handleBookingCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancel(id);
            setBookings(bookings.map(b => b.id === id ? { ...b, bookingStatus: 'Cancelled' } : b));
            alert('Booking cancelled successfully');
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            alert('Failed to cancel booking');
        }
    };

    // --- Render Helpers ---

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-maroon" role="status"><span className="visually-hidden">Loading...</span></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-0">
                        <i className="bi bi-shield-lock me-3 text-maroon"></i>
                        Admin Dashboard
                    </h1>
                    <p className="text-muted mt-2">Manage Users, Properties, and Bookings</p>
                </div>
                <button className="btn btn-outline-maroon" onClick={loadData}>
                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh Data
                </button>
            </div>

            {/* Tabs */}

            <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'overview' ? 'active bg-maroon' : 'text-maroon'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'users' ? 'active bg-maroon' : 'text-maroon'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'bhaktnivas' ? 'active bg-maroon' : 'text-maroon'}`}
                        onClick={() => setActiveTab('bhaktnivas')}
                    >
                        Bhaktnivas
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'bookings' ? 'active bg-maroon' : 'text-maroon'}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Bookings
                    </button>
                </li>
            </ul>



            {/* Content */}
            <div className="tab-content">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card text-center h-100 border-0 shadow-sm">
                                <div className="card-body py-4">
                                    <div className="display-4 text-maroon mb-2">{stats.bhaktnivas}</div>
                                    <h5 className="text-muted">Total Properties</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center h-100 border-0 shadow-sm">
                                <div className="card-body py-4">
                                    <div className="display-4 text-success mb-2">{stats.users}</div>
                                    <h5 className="text-muted">Total Users</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-center h-100 border-0 shadow-sm">
                                <div className="card-body py-4">
                                    <div className="display-4 text-info mb-2">{stats.bookings}</div>
                                    <h5 className="text-muted">Total Bookings</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Verified</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.id}</td>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{ width: '150px' }}
                                                        value={u.role}
                                                        onChange={(e) => handleUserRoleUpdate(u.id, e.target.value)}
                                                    >
                                                        <option value="User">User</option>
                                                        <option value="ServiceProvider">Service Provider</option>
                                                        <option value="Admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    {u.isEmailVerified ?
                                                        <span className="badge bg-success">Yes</span> :
                                                        <span className="badge bg-warning text-dark">No</span>
                                                    }
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleUserDelete(u.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bhaktnivas Tab */}
                {activeTab === 'bhaktnivas' && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Temple</th>
                                            <th>Provider</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bhaktnivas.map(b => (
                                            <tr key={b.id}>
                                                <td>{b.id}</td>
                                                <td>
                                                    <img
                                                        src={b.imageUrl || 'https://placehold.co/50x50'}
                                                        alt={b.name}
                                                        className="rounded"
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td>{b.name}</td>
                                                <td>{b.templeName}</td>
                                                <td>{b.serviceProviderName}</td>
                                                <td>₹{b.pricePerNight}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleBhaktnivasDelete(b.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>User</th>
                                            <th>Property</th>
                                            <th>Dates</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(b => (
                                            <tr key={b.id}>
                                                <td>{b.id}</td>
                                                <td>
                                                    <div>{b.userName}</div>
                                                    <small className="text-muted">{b.userEmail}</small>
                                                </td>
                                                <td>{b.bhaktnivasName}</td>
                                                <td>
                                                    <div>In: {new Date(b.checkInDate).toLocaleDateString()}</div>
                                                    <div>Out: {new Date(b.checkOutDate).toLocaleDateString()}</div>
                                                </td>
                                                <td>₹{b.totalAmount}</td>
                                                <td>
                                                    <span className={`badge ${b.bookingStatus === 'Confirmed' ? 'bg-success' :
                                                        b.bookingStatus === 'Cancelled' ? 'bg-danger' :
                                                            b.bookingStatus === 'Completed' ? 'bg-primary' : 'bg-secondary'
                                                        }`}>
                                                        {b.bookingStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    {b.bookingStatus !== 'Cancelled' && (
                                                        <div className="btn-group">
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Cancel Booking"
                                                                onClick={() => handleBookingCancel(b.id)}
                                                            >
                                                                <i className="bi bi-x-circle"></i>
                                                            </button>
                                                            {b.bookingStatus === 'Confirmed' && (
                                                                <button
                                                                    className="btn btn-sm btn-outline-success"
                                                                    title="Mark Completed"
                                                                    onClick={() => handleBookingStatusUpdate(b.id, 'Completed')}
                                                                >
                                                                    <i className="bi bi-check-circle"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
