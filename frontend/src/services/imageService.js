import api from './api';

export const imageService = {
    upload: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/images/upload', formData, {
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
