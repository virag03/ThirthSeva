import api from './api';

export const templeService = {
    getAll: async () => {
        const response = await api.get('/temples');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/temples/${id}`);
        return response.data;
    },

    search: async (query, state, city) => {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (state) params.append('state', state);
        if (city) params.append('city', city);

        const response = await api.get(`/temples/search?${params.toString()}`);
        return response.data;
    },

    getStates: async () => {
        const response = await api.get('/temples/states');
        return response.data;
    },

    getCitiesByState: async (state) => {
        const response = await api.get(`/temples/cities/${state}`);
        return response.data;
    },

    // Provider-specific methods
    getMyTemples: async () => {
        const response = await api.get('/temples/my-temples');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/temples', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/temples/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/temples/${id}`);
    },
};
