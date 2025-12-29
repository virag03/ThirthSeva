import api from './api';

export const imageService = {
    upload: async (file, type = 'temple') => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post(`/images/upload?type=${type}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (imagePath) => {
        await api.delete('/images/delete', {
            params: { imagePath },
        });
    },
};
