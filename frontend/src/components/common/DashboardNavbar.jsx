import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const navLinkStyle = (isActive) => ({
        padding: '0.5rem 1rem',
        color: isActive ? '#FF6B00' : '#333',
        textDecoration: 'none',
        fontWeight: isActive ? '600' : '500',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'color 0.3s ease',
        borderBottom: isActive ? '2px solid #FF6B00' : 'none'
    });

    // User role links
    const userLinks = [
        { to: '/user/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { to: '/user/bookings', label: 'My Bookings', icon: 'bi-calendar-check' },
    ];

    // Service Provider role links
    const providerLinks = [
        { to: '/provider/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { to: '/provider/temples', label: 'My Temples', icon: 'bi-building' },
        { to: '/provider/listings', label: 'My Listings', icon: 'bi-house-door' },
        { to: '/provider/bookings', label: 'Bookings', icon: 'bi-calendar-check' },
    ];

    // Admin role links
    const adminLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-shield-lock' },
        // { to: '/admin/bhaktnivas', label: 'Bhaktnivas', icon: 'bi-house' },
        // { to: '/admin/bookings', label: 'All Bookings', icon: 'bi-calendar-check' },
        //{ to: '/admin/users', label: 'Users', icon: 'bi-people' },
    ];

    // Get links based on user role
    let roleLinks = [];
    if (user?.role === 'User') roleLinks = userLinks;
    else if (user?.role === 'ServiceProvider') roleLinks = providerLinks;
    else if (user?.role === 'Admin') roleLinks = adminLinks;

    const dashboardPath = user?.role === 'Admin' ? '/admin/dashboard' :
        user?.role === 'ServiceProvider' ? '/provider/dashboard' :
            '/user/dashboard';

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
                {/* Logo - Routes to respective dashboard */}
                <Link to={dashboardPath} style={{
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

                {/* Desktop Role-based Navigation Links */}
                <div className="d-none d-lg-flex align-items-center gap-2">
                    {roleLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            style={navLinkStyle(location.pathname === link.to)}
                        >
                            <i className={`bi ${link.icon}`}></i>
                            {link.label}
                        </Link>
                    ))}

                    {/* User Profile Dropdown */}
                    <div className="dropdown ms-3">
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
                            <span className="d-none d-xl-inline">{user?.name}</span>
                            <i className="bi bi-chevron-down" style={{ fontSize: '0.75rem' }}></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li className="px-3 py-2 border-bottom">
                                <small className="text-muted d-xl-none">Logged in as <strong>{user?.name}</strong></small>
                                <small className="text-muted">Role: <strong>{user?.role}</strong></small>
                            </li>
                            <li>
                                <Link to="/" className="dropdown-item">
                                    <i className="bi bi-house-door me-2"></i>
                                    Home
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
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="d-lg-none border-top" style={{ backgroundColor: '#FFF' }}>
                    <div className="container py-3">
                        <div className="d-flex flex-column gap-2">
                            <div className="px-3 py-2 bg-light rounded mb-2">
                                <small className="text-muted">
                                    <strong>{user?.name}</strong> ({user?.role})
                                </small>
                            </div>

                            {roleLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={navLinkStyle(location.pathname === link.to)}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <i className={`bi ${link.icon}`}></i>
                                    {link.label}
                                </Link>
                            ))}

                            <hr />

                            <Link to="/" style={navLinkStyle(false)} onClick={() => setMobileMenuOpen(false)}>
                                <i className="bi bi-house-door"></i>
                                Home
                            </Link>

                            <button
                                style={{ ...navLinkStyle(false), backgroundColor: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
                                onClick={handleLogout}
                                className="text-danger"
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default DashboardNavbar;
