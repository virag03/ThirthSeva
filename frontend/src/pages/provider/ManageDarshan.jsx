import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { darshanService } from '../../services/darshanService';
import { templeService } from '../../services/templeService';
import { toast, ToastContainer } from 'react-toastify';

const ManageDarshan = () => {
    const { templeId } = useParams();
    const navigate = useNavigate();
    const [temple, setTemple] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state
    const [newSlot, setNewSlot] = useState({
        date: '',
        startTime: '08:00',
        endTime: '12:00',
        capacity: 50,
        price: 0
    });

    useEffect(() => {
        loadData();
    }, [templeId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [templeData, slotsData] = await Promise.all([
                templeService.getById(templeId),
                darshanService.getSlotsByTemple(templeId)
            ]);
            setTemple(templeData);
            setSlots(slotsData);
        } catch (error) {
            console.error('Failed to load darshan data:', error);
            toast.error('Failed to load darshan details');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        
        // Validate form data
        if (!newSlot.date || !newSlot.startTime || !newSlot.endTime || !newSlot.capacity) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        if (newSlot.startTime >= newSlot.endTime) {
            toast.error('End time must be after start time');
            return;
        }
        
        try {
            const slotToCreate = {
                templeId: parseInt(templeId),
                date: newSlot.date,
                startTime: newSlot.startTime + ":00",
                endTime: newSlot.endTime + ":00",
                capacity: parseInt(newSlot.capacity),
                price: parseFloat(newSlot.price) || 0
            };
            
            console.log('Creating slot with data:', slotToCreate);
            await darshanService.createSlot(slotToCreate);
            toast.success('Darshan slot created successfully!');
            setShowAddModal(false);
            setNewSlot({
                date: '',
                startTime: '08:00',
                endTime: '12:00',
                capacity: 50,
                price: 0
            });
            loadData();
        } catch (error) {
            console.error('Failed to create slot:', error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message || 
                               'Failed to create slot';
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">Loading darshan management...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <button onClick={() => navigate('/provider/temples')} className="btn btn-link p-0 mb-2 text-decoration-none">
                        <i className="bi bi-arrow-left me-1"></i> Back to My Temples
                    </button>
                    <h1>Manage Darshan: {temple?.name}</h1>
                    <p className="text-muted">Release and manage darshan passes for devotees</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-plus-circle me-2"></i> Release New Passes
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Existing Darshan Slots</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Date</th>
                                <th>Time Range</th>
                                <th>Capacity</th>
                                <th>Available</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slots.length > 0 ? slots.map(slot => (
                                <tr key={slot.id}>
                                    <td>{new Date(slot.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td>
                                        <span className="badge bg-info text-dark">
                                            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                        </span>
                                    </td>
                                    <td>{slot.capacity}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <span className="me-2">{slot.availableSlots}</span>
                                            <div className="progress flex-grow-1" style={{ height: '6px', maxWidth: '100px' }}>
                                                <div
                                                    className={`progress-bar ${slot.availableSlots === 0 ? 'bg-danger' : 'bg-success'}`}
                                                    role="progressbar"
                                                    style={{ width: `${(slot.availableSlots / slot.capacity) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{slot.price === 0 ? <span className="text-success fw-bold">Free</span> : `₹${slot.price}`}</td>
                                    <td>
                                        {new Date(slot.date) < new Date().setHours(0, 0, 0, 0) ?
                                            <span className="badge bg-secondary">Expired</span> :
                                            slot.availableSlots === 0 ?
                                                <span className="badge bg-danger">Sold Out</span> :
                                                <span className="badge bg-success">Active</span>
                                        }
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="bi bi-calendar-x d-block mb-3" style={{ fontSize: '3rem' }}></i>
                                        No slots released yet. Click "Release New Passes" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Release Passes Modal */}
            {showAddModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={handleCreateSlot}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Release Darshan Passes</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Select Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            value={newSlot.date}
                                            onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Start Time</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                required
                                                value={newSlot.startTime}
                                                onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">End Time</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                required
                                                value={newSlot.endTime}
                                                onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Total Passes</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                required
                                                min="1"
                                                max="1000"
                                                value={newSlot.capacity}
                                                onChange={e => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Price per Pass (₹)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                required
                                                min="0"
                                                value={newSlot.price}
                                                onChange={e => setNewSlot({ ...newSlot, price: parseFloat(e.target.value) })}
                                            />
                                            <div className="form-text">Set to 0 for Free Darshan</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Slot & Release Passes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDarshan;
