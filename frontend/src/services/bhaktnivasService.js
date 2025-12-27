import api from './api';

export const bhaktnivasService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.templeId) params.append('templeId', filters.templeId);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.isAvailable !== undefined) params.append('isAvailable', filters.isAvailable);

        const response = await api.get(`/bhaktnivas?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/bhaktnivas/${id}`);
        return response.data;
    },

    getMyListings: async () => {
        const response = await api.get('/bhaktnivas/my-listings');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/bhaktnivas', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/bhaktnivas/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/bhaktnivas/${id}`);
    },

    updateAvailability: async (id, isAvailable) => {
        const response = await api.patch(`/bhaktnivas/${id}/availability`, isAvailable);
        return response.data;
    },
};
