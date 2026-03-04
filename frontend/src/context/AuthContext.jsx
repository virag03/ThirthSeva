import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = authService.getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            setUser(data);
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };


    const register = async (name, email, password, role) => {
        try {
            const data = await authService.register({ name, email, password, role });
            // Don't auto-login after registration - user must login manually
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };


    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const verifyEmail = async (token) => {
        try {
            await authService.verifyEmail(token);
            // Update user email verification status
            if (user) {
                const updatedUser = { ...user, isEmailVerified: true };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Email verification failed'
            };
        }
    };

    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        isAuthenticated,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
