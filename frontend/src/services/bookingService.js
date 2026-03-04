import api from './api';

export const bookingService = {
    validateAvailability: async (data) => {
        const response = await api.post('/bookings/validate', data);
        return response.data;
    },

    confirmPaymentAndBook: async (data, transactionId) => {
        const response = await api.post(`/bookings/confirm-and-book?transactionId=${transactionId}`, data);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/bookings', data);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await api.get('/bookings/my-bookings');
        return response.data;
    },

    getProviderBookings: async () => {
        const response = await api.get('/bookings/provider-bookings');
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/bookings/all');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    cancel: async (id) => {
        await api.delete(`/bookings/${id}`);
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/bookings/${id}/status`, { bookingStatus: status });
        return response.data;
    },

    confirmPayment: async (bookingId, transactionId) => {
        const response = await api.post(`/bookings/${bookingId}/confirm-payment`, { transactionId });
        return response.data;
    }
};

export const paymentService = {
    process: async (bookingId, paymentMethod = 'Mock') => {
        const response = await api.post('/payments/process', { bookingId, paymentMethod });
        return response.data;
    },

    verify: async (transactionId) => {
        const response = await api.post('/payments/verify', { transactionId });
        return response.data;
    },

    getHistory: async () => {
        const response = await api.get('/payments/history');
        return response.data;
    },

    getByBooking: async (bookingId) => {
        const response = await api.get(`/payments/booking/${bookingId}`);
        return response.data;
    },
};
