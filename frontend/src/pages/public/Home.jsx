import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TempleCard from '../../components/common/TempleCard';
import ActionCard from '../../components/common/ActionCard';
import { templeService } from '../../services/templeService';

const Home = () => {
    const [temples, setTemples] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemples();
    }, []);

    const loadTemples = async () => {
        try {
            const data = await templeService.getAll();
            setTemples(data);
        } catch (error) {
            console.error('Failed to load temples:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadTemples();
            return;
        }

        setLoading(true);
        try {
            const data = await templeService.search(searchQuery, null, null);
            setTemples(data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section with Background Image and Overlay */}
            <section style={{
                position: 'relative',
                backgroundImage: 'url(/assets/images/hero-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '500px',
                padding: '4rem 0',
                color: '#FFF'
            }}>
                {/* Dark Overlay with Blur Effect */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(123, 30, 30, 0.75)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                    zIndex: 1
                }}></div>

                {/* Content */}
                <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '2rem', paddingBottom: '2rem' }}>
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            {/* Trust Badge */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '2rem',
                                    fontSize: '14px',
                                    color: '#7B1E1E',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    display: 'inline-block'
                                }}>
                                    <i className="bi bi-people-fill me-2"></i>
                                    Trusted by 60,000+ Devotees
                                </span>
                            </div>

                            <h1 className="display-4 mb-4" style={{
                                color: '#FFF',
                                fontSize: '3rem',
                                fontWeight: '700',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                <i className="bi bi-flower3 me-3"></i>
                                Welcome to TirthSeva
                            </h1>
                            <p className="lead mb-4" style={{
                                fontSize: '1.3rem',
                                color: '#FFF',
                                textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                            }}>
                                Your trusted companion for spiritual journeys across India's sacred temples.
                                Book Bhaktnivas, Darshan slots, and discover nearby services with ease.
                            </p>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch}>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    padding: '0.5rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search temples by name, city, or state..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            fontSize: '1.1rem',
                                            padding: '0.75rem 1rem',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            backgroundColor: '#FFF'
                                        }}
                                    />
                                    <button type="submit" className="btn btn-secondary" style={{
                                        minWidth: '120px',
                                        backgroundColor: '#7B1E1E',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        padding: '0.75rem 1.5rem'
                                    }}>
                                        <i className="bi bi-search me-2"></i>
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '3rem',
                        marginTop: '3rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#FFF',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}>500+</div>
                            <div style={{ color: '#FFE8D9', fontWeight: '500' }}>Temples</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#FFF',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}>1000+</div>
                            <div style={{ color: '#FFE8D9', fontWeight: '500' }}>Bhaktnivas</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#FFF',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}>50K+</div>
                            <div style={{ color: '#FFE8D9', fontWeight: '500' }}>Happy Devotees</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: '#FFF',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}>24/7</div>
                            <div style={{ color: '#FFE8D9', fontWeight: '500' }}>Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Action Cards */}
            <section className="container my-5">
                <h2 className="text-center mb-5">Quick Services</h2>
                <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                        <ActionCard
                            icon="bi-building"
                            title="Bhaktnivas"
                            description="Affordable accommodation near temples (₹50-₹200)"
                            link="/bhaktnivas"
                            bgColor="saffron"
                        />
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <ActionCard
                            icon="bi-calendar-check"
                            title="Darshan Booking"
                            description="Book your temple visit slots in advance"
                            link="/darshan"
                            bgColor="maroon"
                        />
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <ActionCard
                            icon="bi-cup-hot"
                            title="Food & Services"
                            description="Find nearby prasadam and affordable food"
                            link="/food-services"
                            bgColor="saffron"
                        />
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <ActionCard
                            icon="bi-geo-alt"
                            title="Location Help"
                            description="Get directions and real-time navigation"
                            link="/location-help"
                            bgColor="maroon"
                        />
                    </div>
                </div>
            </section>

            {/* Popular Temples */}
            <section className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Popular Pilgrimage Destinations</h2>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner"></div>
                            <p className="mt-3">Loading temples...</p>
                        </div>
                    ) : temples.length > 0 ? (
                        <div className="row g-4">
                            {temples.slice(0, 6).map((temple) => (
                                <div key={temple.id} className="col-md-6 col-lg-4">
                                    <TempleCard temple={temple} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
                            <p className="mt-3" style={{ fontSize: '1.2rem' }}>No temples found</p>
                        </div>
                    )}

                    {temples.length > 6 && (
                        <div className="text-center mt-5">
                            <p style={{ fontSize: '1.2rem' }}>
                                Showing {Math.min(6, temples.length)} of {temples.length} temples
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="container my-5 py-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4">
                        <h2 className="mb-4">Why Choose TirthSeva?</h2>
                        <div className="d-flex align-items-start mb-4">
                            <i className="bi bi-check-circle-fill text-success me-3" style={{ fontSize: '2rem' }}></i>
                            <div>
                                <h4>Affordable Accommodation</h4>
                                <p style={{ fontSize: '1.1rem' }}>Budget-friendly Bhaktnivas starting from ₹50 per night</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-start mb-4">
                            <i className="bi bi-check-circle-fill text-success me-3" style={{ fontSize: '2rem' }}></i>
                            <div>
                                <h4>Easy Darshan Booking</h4>
                                <p style={{ fontSize: '1.1rem' }}>Book temple visit slots in advance and avoid long queues</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-start mb-4">
                            <i className="bi bi-check-circle-fill text-success me-3" style={{ fontSize: '2rem' }}></i>
                            <div>
                                <h4>Complete Information</h4>
                                <p style={{ fontSize: '1.1rem' }}>Find nearby food, prasadam, shops, and directions</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-start">
                            <i className="bi bi-check-circle-fill text-success me-3" style={{ fontSize: '2rem' }}></i>
                            <div>
                                <h4>User Friendly</h4>
                                <p style={{ fontSize: '1.1rem' }}>Simple navigation and easy-to-use interface</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card p-5 text-center" style={{ backgroundColor: '#7B1E1E', color: '#FFF', border: 'none' }}>
                            <i className="bi bi-flower3" style={{ fontSize: '6rem' }}></i>
                            <h3 className="mt-4 text-white">Start Your Spiritual Journey Today</h3>
                            <p style={{ fontSize: '1.2rem' }} className="mt-3">
                                Join thousands of devotees who trust TirthSeva for their pilgrimage needs
                            </p>
                            <Link to="/register" className="btn btn-light btn-lg mt-3">
                                <i className="bi bi-person-plus me-2"></i>
                                Register Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
