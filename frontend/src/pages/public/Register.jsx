import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User', // User or ServiceProvider
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    if (user) {
        navigate('/');
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        const result = await register(formData.name, formData.email, formData.password, formData.role);

        if (result.success) {
            // Redirect to OTP verification page
            navigate('/verify-otp', { 
                state: { 
                    email: formData.email,
                    message: 'Registration successful! Please check your email for the OTP.' 
                } 
            });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-person-plus-fill text-saffron" style={{ fontSize: '4rem' }}></i>
                                <h1 className="mt-3">Join TirthSeva</h1>
                                <p style={{ fontSize: '1.1rem' }}>Create your account</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-person me-2"></i>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-envelope me-2"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-shield-check me-2"></i>
                                        Account Type
                                    </label>
                                    <select
                                        className="form-select"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="User">User (Pilgrim)</option>
                                        <option value="ServiceProvider">Service Provider (Bhaktnivas Owner)</option>
                                    </select>
                                    <small className="text-muted">
                                        Choose "Service Provider" if you want to list Bhaktnivas for rent
                                    </small>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-lock me-2"></i>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Create a password (min 6 characters)"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-lock-fill me-2"></i>
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Re-enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Register
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <p style={{ fontSize: '1.1rem' }}>
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-saffron fw-bold">
                                            Login here
                                        </Link>
                                    </p>
                                </div>
                            </form>

                            <div className="alert alert-info mt-4" role="alert">
                                <i className="bi bi-info-circle me-2"></i>
                                <strong>Note:</strong> You'll receive an OTP via email after registration for verification.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
