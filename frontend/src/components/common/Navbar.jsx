import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const navLinkStyle = {
        padding: '0.5rem 1rem',
        color: '#333',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'color 0.3s ease'
    };

    return (
        <nav style={{
            backgroundColor: '#FFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem'
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#FF6B00',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        🕉️
                    </div>
                    <div className="d-none d-sm-block">
                        <div style={{ fontWeight: '700', fontSize: '1.25rem', color: '#333' }}>TirthSeva</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Sacred Pilgrimage Services</div>
                    </div>
                </Link>

                {/* Mobile Hamburger Button */}
                <button
                    className="btn d-lg-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        border: '1px solid #E5E5E5',
                        padding: '0.5rem 0.75rem'
                    }}
                >
                    <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`} style={{ fontSize: '1.5rem' }}></i>
                </button>

                {/* Desktop Navigation Links */}
                <div className="d-none d-lg-flex align-items-center gap-2">
                    <Link to="/" style={navLinkStyle}>
                        <i className="bi bi-house-door"></i>
                        Home
                    </Link>

                    <Link to="/bhaktnivas" style={navLinkStyle}>
                        <i className="bi bi-building"></i>
                        Bhaktnivas
                    </Link>

                    <Link to="/darshan" style={navLinkStyle}>
                        <i className="bi bi-calendar-check"></i>
                        Darshan
                    </Link>



                    <Link to="/location-help" style={navLinkStyle}>
                        <i className="bi bi-geo-alt"></i>
                        Location Help
                    </Link>

                    {/* Authentication - Desktop */}
                    {isAuthenticated() ? (
                        <div className="dropdown">
                            <button
                                style={{
                                    backgroundColor: '#FFF',
                                    border: '1px solid #E5E5E5',
                                    borderRadius: '2rem',
                                    padding: '0.5rem 1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                                data-bs-toggle="dropdown"
                            >
                                <i className="bi bi-person-circle" style={{ fontSize: '1.25rem', color: '#F4A261' }}></i>
                                {user?.name}
                                <i className="bi bi-chevron-down" style={{ fontSize: '0.75rem' }}></i>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end">
                                <li className="px-3 py-2 border-bottom">
                                    <small className="text-muted">Role: <strong>{user?.role}</strong></small>
                                </li>
                                <li>
                                    <Link
                                        to={
                                            user?.role === 'Admin' ? '/admin/dashboard' :
                                                user?.role === 'ServiceProvider' ? '/provider/dashboard' :
                                                    '/user/dashboard'
                                        }
                                        className="dropdown-item"
                                    >
                                        <i className="bi bi-speedometer2 me-2"></i>
                                        Dashboard
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="d-flex gap-2">
                            <Link to="/login" className="btn btn-outline-primary rounded-pill">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary rounded-pill">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="d-lg-none border-top" style={{ backgroundColor: '#FFF' }}>
                    <div className="container py-3">
                        <div className="d-flex flex-column gap-2">
                            <Link to="/" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
                                <i className="bi bi-house-door"></i>
                                Home
                            </Link>

                            <Link to="/bhaktnivas" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
                                <i className="bi bi-building"></i>
                                Bhaktnivas
                            </Link>

                            <Link to="/darshan" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
                                <i className="bi bi-calendar-check"></i>
                                Darshan
                            </Link>



                            <Link to="/location-help" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
                                <i className="bi bi-geo-alt"></i>
                                Location Help
                            </Link>

                            <hr />

                            {isAuthenticated() ? (
                                <>
                                    <div className="px-3 py-2 bg-light rounded">
                                        <small className="text-muted">
                                            Logged in as <strong>{user?.name}</strong> ({user?.role})
                                        </small>
                                    </div>
                                    <Link
                                        to={
                                            user?.role === 'Admin' ? '/admin/dashboard' :
                                                user?.role === 'ServiceProvider' ? '/provider/dashboard' :
                                                    '/user/dashboard'
                                        }
                                        style={navLinkStyle}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <i className="bi bi-speedometer2"></i>
                                        Dashboard
                                    </Link>
                                    <button
                                        style={{ ...navLinkStyle, backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                        onClick={handleLogout}
                                        className="text-danger"
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="d-flex flex-column gap-2 mt-2">
                                    <Link to="/login" className="btn btn-outline-primary rounded-pill" onClick={() => setMobileMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-primary rounded-pill" onClick={() => setMobileMenuOpen(false)}>
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
