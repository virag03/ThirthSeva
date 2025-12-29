import api from './api';

export const authService = {
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (data) => {
        const response = await api.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    verifyOTP: async (email, otp) => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    resendOTP: async (email) => {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};
