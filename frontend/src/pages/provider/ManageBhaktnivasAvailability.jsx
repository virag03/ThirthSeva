import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { toast, ToastContainer } from 'react-toastify';

const ManageBhaktnivasAvailability = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bhaktnivas, setBhaktnivas] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReleaseModal, setShowReleaseModal] = useState(false);

    // Form state
    const [releaseData, setReleaseData] = useState({
        startDate: '',
        endDate: '',
        capacity: 50
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [bhaktnivasData, slotsData] = await Promise.all([
                bhaktnivasService.getById(id),
                bhaktnivasService.getSlots(id)
            ]);
            setBhaktnivas(bhaktnivasData);
            setSlots(slotsData);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load availability details');
        } finally {
            setLoading(false);
        }
    };

    const handleReleaseSlots = async (e) => {
        e.preventDefault();
        try {
            await bhaktnivasService.releaseSlots(id, releaseData);
            toast.success('Capacity released successfully!');
            setShowReleaseModal(false);
            loadData();
        } catch (error) {
            console.error('Failed to release capacity:', error);
            toast.error(error.response?.data?.message || 'Failed to release capacity');
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">Loading availability management...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <button onClick={() => navigate('/provider/listings')} className="btn btn-link p-0 mb-2 text-decoration-none">
                        <i className="bi bi-arrow-left me-1"></i> Back to My Listings
                    </button>
                    <h1>Manage Capacity: {bhaktnivas?.name}</h1>
                    <p className="text-muted">Set daily person-count availability for your property</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowReleaseModal(true)}>
                    <i className="bi bi-calendar-plus me-2"></i> Release Capacity
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Daily Availability Calendar</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Total Capacity</th>
                                <th>Available (Remaining)</th>
                                <th>Occupancy</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slots.length > 0 ? slots.map(slot => (
                                <tr key={slot.id}>
                                    <td>{new Date(slot.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td>{slot.totalCapacity} Persons</td>
                                    <td>
                                        <span className={`fw-bold ${slot.availableCapacity < 5 ? 'text-danger' : 'text-success'}`}>
                                            {slot.availableCapacity} / {slot.totalCapacity}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="progress" style={{ height: '8px', maxWidth: '150px' }}>
                                            <div
                                                className={`progress-bar ${slot.availableCapacity === 0 ? 'bg-danger' : 'bg-primary'}`}
                                                role="progressbar"
                                                style={{ width: `${((slot.totalCapacity - slot.availableCapacity) / slot.totalCapacity) * 100}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(slot.date) < new Date().setHours(0, 0, 0, 0) ?
                                            <span className="badge bg-secondary">Past</span> :
                                            slot.availableCapacity === 0 ?
                                                <span className="badge bg-danger">Full</span> :
                                                <span className="badge bg-success">Active</span>
                                        }
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <i className="bi bi-calendar-x d-block mb-3" style={{ fontSize: '3rem' }}></i>
                                        No availability released yet. Click "Release Capacity" to set your daily person limits.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Release Capacity Modal */}
            {showReleaseModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <form onSubmit={handleReleaseSlots}>
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">Release Daily Capacity</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowReleaseModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="alert alert-info small">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Specify the total number of people who can stay at your property per day.
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Start Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                value={releaseData.startDate}
                                                onChange={e => setReleaseData({ ...releaseData, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">End Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                required
                                                min={releaseData.startDate || new Date().toISOString().split('T')[0]}
                                                value={releaseData.endDate}
                                                onChange={e => setReleaseData({ ...releaseData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Total Person Capacity per Day</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="bi bi-people"></i></span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                required
                                                min="1"
                                                max="1000"
                                                value={releaseData.capacity}
                                                onChange={e => setReleaseData({ ...releaseData, capacity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="form-text">Example: If you have 10 rooms with 4 beds each, enter 40.</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setShowReleaseModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px-4">Initialize Availability</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBhaktnivasAvailability;
