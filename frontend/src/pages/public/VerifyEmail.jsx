import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        const verify = async () => {
            const result = await verifyEmail(token);

            if (result.success) {
                setStatus('success');
                setMessage('Email verified successfully! You can now login.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus('error');
                setMessage(result.error || 'Email verification failed');
            }
        };

        verify();
    }, [searchParams, verifyEmail, navigate]);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card text-center shadow-lg">
                        <div className="card-body p-5">
                            {status === 'verifying' && (
                                <>
                                    <div className="spinner mb-4"></div>
                                    <h2>Verifying Email...</h2>
                                    <p style={{ fontSize: '1.1rem' }}>Please wait while we verify your email address.</p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                                    <h2 className="mt-4 text-success">Email Verified!</h2>
                                    <p style={{ fontSize: '1.2rem' }} className="mt-3">{message}</p>
                                    <p className="text-muted">Redirecting to login page...</p>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
                                    <h2 className="mt-4 text-danger">Verification Failed</h2>
                                    <p style={{ fontSize: '1.2rem' }} className="mt-3">{message}</p>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => navigate('/login')}
                                    >
                                        Go to Login
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
