import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        const redirectPath = user.role === 'Admin' ? '/admin/dashboard' :
            user.role === 'ServiceProvider' ? '/provider/dashboard' :
                '/user/dashboard';
        navigate(redirectPath);
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Real-time validation for email
        if (value) {
            const errors = { ...validationErrors };
            if (!validateEmail(value)) {
                errors.email = 'Please enter a valid email address';
            } else {
                errors.email = '';
            }
            setValidationErrors(errors);
        } else if (validationErrors.email) {
            setValidationErrors({ ...validationErrors, email: '' });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (validationErrors.password) {
            setValidationErrors({ ...validationErrors, password: '' });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!validateEmail(email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
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
        const result = await login(email, password);

        if (result.success) {
            const role = result.data.role;
            const redirectPath = role === 'Admin' ? '/admin/dashboard' :
                role === 'ServiceProvider' ? '/provider/dashboard' :
                    '/user/dashboard';
            navigate(redirectPath);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-flower3 text-saffron" style={{ fontSize: '4rem' }}></i>
                                <h1 className="mt-3">Welcome Back</h1>
                                <p style={{ fontSize: '1.1rem' }}>Login to TirthSeva</p>
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
                                        <i className="bi bi-envelope me-2"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                    {validationErrors.email && (
                                        <div className="invalid-feedback">{validationErrors.email}</div>
                                    )}
                                    
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-lock me-2"></i>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter your password"
                                    />
                                    {validationErrors.password && (
                                        <div className="invalid-feedback">{validationErrors.password}</div>
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
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Login
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <p style={{ fontSize: '1.1rem' }}>
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-saffron fw-bold">
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            </form>

                            <hr className="my-4" />

                           {/* <div className="bg-light p-3 rounded">
                                <p className="mb-2 fw-bold">Test Accounts:</p>
                                <small className="d-block">Admin: admin@tirthseva.com / Admin@123</small>
                                <small className="d-block">User: ramesh@example.com / User@123</small>
                                <small className="d-block">Provider: suresh@example.com / Provider@123</small>
                            </div>
                            */}
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
