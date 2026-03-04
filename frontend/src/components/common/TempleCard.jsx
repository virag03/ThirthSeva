import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';

const TempleCard = ({ temple }) => {
    return (
        <div className="card" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <img
                src={getImageUrl(temple, 'temple')}
                alt={temple.name}
                className="card-img-top"
                style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '1rem 1rem 0 0'
                }}
            />
            <div className="card-body" style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                <h3 className="card-title" style={{
                    fontSize: '1.3rem',
                    minHeight: '2.6rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>{temple.name}</h3>

                <p className="card-text" style={{
                    fontSize: '1rem',
                    marginBottom: '0.75rem'
                }}>
                    <i className="bi bi-geo-alt-fill me-2" style={{ color: '#F4A261' }}></i>
                    <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {temple.city}, {temple.state}
                    </span>
                </p>

                <p className="card-text text-muted" style={{
                    fontSize: '0.95rem',
                    minHeight: '2.8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: 'auto'
                }}>
                    {temple.description || 'Discover this beautiful sacred site and experience divine spirituality.'}
                </p>

                <div className="d-flex gap-2 mt-3">
                    <Link
                        to={`/bhaktnivas?templeId=${temple.id}`}
                        className="btn btn-primary flex-fill"
                        style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                    >
                        <i className="bi bi-building me-1"></i>
                        Bhaktnivas
                    </Link>
                    <Link
                        to={`/darshan?templeId=${temple.id}`}
                        className="btn btn-secondary flex-fill"
                        style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                    >
                        <i className="bi bi-calendar-check me-1"></i>
                        Darshan
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TempleCard;
