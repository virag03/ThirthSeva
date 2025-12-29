import api from './api';

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/users/${id}`);
    },

    updateRole: async (id, role) => {
        const response = await api.put(`/users/${id}/role`, { role });
        return response.data;
    }
};
