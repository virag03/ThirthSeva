import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ backgroundColor: '#7B1E1E', color: '#FFF', padding: '2rem 0', marginTop: '3rem' }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <h3 className="text-white mb-3">
                            <i className="bi bi-flower3 me-2"></i>
                            TirthSeva
                        </h3>
                        <p style={{ fontSize: '1.1rem', color: '#FFE8D9' }}>
                            Your trusted companion for spiritual journeys across India's sacred sites.
                        </p>
                    </div>

                    <div className="col-md-4 mb-4">
                        <h4 className="mb-3" style={{ color: '#FFF', fontWeight: '600' }}>Quick Links</h4>
                        <ul className="list-unstyled" style={{ fontSize: '1.1rem' }}>
                            <li className="mb-2">
                                <Link to="/" style={{ color: '#FFE8D9', textDecoration: 'none', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                    onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                    <i className="bi bi-chevron-right me-2"></i>
                                    Home
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/bhaktnivas" style={{ color: '#FFE8D9', textDecoration: 'none', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                    onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                    <i className="bi bi-chevron-right me-2"></i>
                                    Bhaktnivas Listings
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/darshan" style={{ color: '#FFE8D9', textDecoration: 'none', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                    onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                    <i className="bi bi-chevron-right me-2"></i>
                                    Darshan Booking
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/food-services" style={{ color: '#FFE8D9', textDecoration: 'none', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                    onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                    <i className="bi bi-chevron-right me-2"></i>
                                    Food & Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-4">
                        <h4 className="mb-3" style={{ color: '#FFF', fontWeight: '600' }}>Contact Us</h4>
                        <p style={{ fontSize: '1.1rem', color: '#FFE8D9' }}>
                            <i className="bi bi-envelope me-2"></i>
                            support@tirthseva.com
                        </p>
                        <p style={{ fontSize: '1.1rem', color: '#FFE8D9' }}>
                            <i className="bi bi-telephone me-2"></i>
                            1800-XXX-XXXX (Toll Free)
                        </p>
                        <div className="mt-3">
                            <a href="#" style={{ color: '#FFE8D9', marginRight: '1rem', fontSize: '1.5rem', transition: 'color 0.3s' }}
                                onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" style={{ color: '#FFE8D9', marginRight: '1rem', fontSize: '1.5rem', transition: 'color 0.3s' }}
                                onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="#" style={{ color: '#FFE8D9', marginRight: '1rem', fontSize: '1.5rem', transition: 'color 0.3s' }}
                                onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" style={{ color: '#FFE8D9', fontSize: '1.5rem', transition: 'color 0.3s' }}
                                onMouseEnter={(e) => e.target.style.color = '#F4A261'}
                                onMouseLeave={(e) => e.target.style.color = '#FFE8D9'}>
                                <i className="bi bi-youtube"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />

                <div className="row">
                    <div className="col-12 text-center">
                        <p style={{ fontSize: '1rem', color: '#FFE8D9' }}>
                            © {currentYear} TirthSeva. All rights reserved. | Serving pilgrims with devotion.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
