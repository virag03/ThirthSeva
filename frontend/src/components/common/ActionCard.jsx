import { Link } from 'react-router-dom';

const ActionCard = ({ icon, title, description, link, bgColor = 'saffron' }) => {
    return (
        <Link to={link} className="text-decoration-none" style={{ height: '100%' }}>
            <div
                className={`card text-center bg-${bgColor === 'saffron' ? 'white' : 'light'}`}
                style={{
                    height: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease'
                }}
            >
                <div className="card-body py-4" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div className={`text-${bgColor === 'saffron' ? 'saffron' : 'maroon'} mb-3`}>
                            <i className={`bi ${icon}`} style={{ fontSize: '3.5rem' }}></i>
                        </div>
                        <h3 className="card-title mb-3" style={{
                            fontSize: '1.3rem',
                            minHeight: '2.6rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>{title}</h3>
                        <p className="card-text" style={{
                            fontSize: '1rem',
                            minHeight: '3rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: '#6B6B6B'
                        }}>
                            {description}
                        </p>
                    </div>

                    {/* Arrow below text, centered */}
                    <div className="mt-3">
                        <i className={`bi bi-arrow-right-circle-fill text-${bgColor}`} style={{ fontSize: '2rem' }}></i>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ActionCard;
