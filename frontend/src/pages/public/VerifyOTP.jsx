import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import './otp-styles.css';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get email from navigation state or URL params
        const emailFromState = location.state?.email;
        const urlParams = new URLSearchParams(location.search);
        const emailFromUrl = urlParams.get('email');

        if (emailFromState) {
            setEmail(emailFromState);
        } else if (emailFromUrl) {
            setEmail(emailFromUrl);
        } else {
            // If no email provided, redirect to register
            navigate('/register');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.verifyOTP(email.trim(), otp.trim());
            setSuccess(true);
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Email verified successfully! You can now login.',
                        email: email
                    }
                });
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid or expired OTP');
        }

        setLoading(false);
    };

    const handleResendOTP = async () => {
        setResending(true);
        setError('');

        try {
            await authService.resendOTP(email);
            setError(''); // Clear any previous errors
            // Show success message temporarily
            const originalError = error;
            setError('New OTP sent to your email!');
            setTimeout(() => setError(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend OTP');
        }

        setResending(false);
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    if (success) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card text-center shadow-lg">
                            <div className="card-body p-5">
                                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                                <h2 className="mt-4 text-success">Email Verified!</h2>
                                <p style={{ fontSize: '1.2rem' }} className="mt-3">
                                    Your email has been verified successfully.
                                </p>
                                <p className="text-muted">Redirecting to login page...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-shield-check text-saffron" style={{ fontSize: '4rem' }}></i>
                                <h1 className="mt-3">Verify Your Email</h1>
                                <p style={{ fontSize: '1.1rem' }}>
                                    We've sent a 6-digit OTP to
                                </p>
                                <p className="fw-bold text-saffron" style={{ fontSize: '1.1rem' }}>
                                    {email}
                                </p>
                            </div>

                            {error && (
                                <div className={`alert ${error.includes('sent') ? 'alert-success' : 'alert-danger'}`} role="alert">
                                    <i className={`bi ${error.includes('sent') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label">
                                        <i className="bi bi-key me-2"></i>
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control text-center otp-input"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="000000"
                                        maxLength="6"
                                        style={{
                                            fontSize: '2rem',
                                            letterSpacing: '0.5rem',
                                            fontWeight: 'bold'
                                        }}
                                        required
                                    />
                                    <small className="text-muted">
                                        Enter the 6-digit code sent to your email
                                    </small>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading || otp.length !== 6}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Verify OTP
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <p style={{ fontSize: '1.1rem' }}>
                                        Didn't receive the code?{' '}
                                        <button
                                            type="button"
                                            className="btn btn-link text-saffron fw-bold p-0"
                                            onClick={handleResendOTP}
                                            disabled={resending}
                                        >
                                            {resending ? 'Sending...' : 'Resend OTP'}
                                        </button>
                                    </p>
                                </div>
                            </form>

                            <div className="alert alert-info mt-4" role="alert">
                                <i className="bi bi-info-circle me-2"></i>
                                <strong>Note:</strong> OTP expires in 10 minutes.
                                Check your spam folder if you don't see the email.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;