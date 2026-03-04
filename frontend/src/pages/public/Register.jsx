import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User',
    });
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate('/');
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Real-time validation for email
        if (name === 'email' && value) {
            const errors = { ...validationErrors };
            if (!validateEmail(value)) {
                errors.email = 'Please enter a valid email address';
            } else {
                errors.email = '';
            }
            setValidationErrors(errors);
        } else if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!validateName(formData.name)) {
            errors.name = 'Name must be 2-50 characters and contain only letters';
        }
        
        if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!validatePassword(formData.password)) {
            errors.password = 'Password must be 8+ characters with uppercase, lowercase, number and special character';
        }
        
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        const result = await register(formData.name, formData.email, formData.password, formData.role);

        if (result.success) {
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
                                        className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                    {validationErrors.name && (
                                        <div className="invalid-feedback">{validationErrors.name}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-envelope me-2"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                    {validationErrors.email && (
                                        <div className="invalid-feedback">{validationErrors.email}</div>
                                    )}
                                    {/*<small className="text-muted">Must be a valid email format (e.g., user@example.com)</small>*/}
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
                                        className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Create a password"
                                    />
                                    {validationErrors.password && (
                                        <div className="invalid-feedback">{validationErrors.password}</div>
                                    )}
                                    
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-lock-fill me-2"></i>
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Re-enter your password"
                                    />
                                    {validationErrors.confirmPassword && (
                                        <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                                    )}
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
