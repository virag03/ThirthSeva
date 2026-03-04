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

    createSlot: async (slotData) => {
        try {
            console.log('Sending slot data to API:', slotData);
            const response = await api.post('/darshan', slotData);
            return response.data;
        } catch (error) {
            console.error('API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },
};


