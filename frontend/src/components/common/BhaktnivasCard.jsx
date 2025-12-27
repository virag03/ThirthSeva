import { Link } from 'react-router-dom';

const BhaktnivasCard = ({ bhaktnivas }) => {
    return (
        <div className="card">
            <div className="position-relative">
                <img
                    src={bhaktnivas.imageUrl || '/images/bhaktnivas-placeholder.jpg'}
                    alt={bhaktnivas.name}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
                />
                {bhaktnivas.isAvailable ? (
                    <span className="badge bg-success position-absolute top-0 end-0 m-3" style={{ fontSize: '1rem' }}>
                        Available
                    </span>
                ) : (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-3" style={{ fontSize: '1rem' }}>
                        Not Available
                    </span>
                )}
            </div>

            <div className="card-body">
                <h3 className="card-title">{bhaktnivas.name}</h3>
                <p className="card-text">
                    <i className="bi bi-building text-saffron me-2"></i>
                    {bhaktnivas.templeName}
                </p>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="text-saffron mb-0">₹{bhaktnivas.pricePerNight}</h2>
                        <small className="text-muted">per night</small>
                    </div>
                    <div className="text-end">
                        <p className="mb-0">
                            <i className="bi bi-people-fill text-saffron me-1"></i>
                            Up to {bhaktnivas.capacity} people
                        </p>
                        <p className="mb-0 text-muted">
                            <i className="bi bi-pin-map me-1"></i>
                            {bhaktnivas.distanceFromTemple}
                        </p>
                    </div>
                </div>

                <Link
                    to={`/bhaktnivas/${bhaktnivas.id}`}
                    className={`btn ${bhaktnivas.isAvailable ? 'btn-primary' : 'btn-secondary'} w-100`}
                    style={{ pointerEvents: bhaktnivas.isAvailable ? 'auto' : 'none' }}
                >
                    <i className="bi bi-eye me-2"></i>
                    {bhaktnivas.isAvailable ? 'View Details & Book' : 'Unavailable'}
                </Link>
            </div>
        </div>
    );
};

export default BhaktnivasCard;
