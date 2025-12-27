import api from './api';

export const foodService = {
    getByTemple: async (templeId, type = null) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        
        const url = `/foodservices/temple/${templeId}${type ? `?${params.toString()}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/foodservices/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/foodservices', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/foodservices/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/foodservices/${id}`);
    },
};
