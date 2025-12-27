import api from './api';

export const templeDetailsService = {
    getDetails: async (templeId, templeName, city, state) => {
        const params = new URLSearchParams();
        params.append('templeName', templeName);
        params.append('city', city);
        params.append('state', state);

        const response = await api.get(`/templedetails/${templeId}?${params.toString()}`);
        return response.data;
    },
};
