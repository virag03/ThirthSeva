import api from './api';

export const darshanService = {
    getSlotsByTemple: async (templeId, fromDate, toDate) => {
        const params = new URLSearchParams({ templeId: templeId.toString() });
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);

        const response = await api.get(`/darshan/temple/${templeId}?${params.toString()}`);
        return response.data;
    },

    getAvailableSlots: async (templeId, date) => {
        const params = new URLSearchParams({
            templeId: templeId.toString(),
            date: date,
        });

        const response = await api.get(`/darshan/available?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/darshan/${id}`);
        return response.data;
    },
};

export const foodService = {
    getByTemple: async (templeId, type = null) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);

        const response = await api.get(`/food-services/temple/${templeId}?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/food-services/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/food-services', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/food-services/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/food-services/${id}`);
    },
};
