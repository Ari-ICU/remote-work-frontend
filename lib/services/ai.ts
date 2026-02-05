import api from '../api';

export const aiService = {
    chat: async (message: string) => {
        const response = await api.post('/ai/chat', { message });
        return response.data;
    },

    matchJob: async (jobId: string) => {
        const response = await api.post(`/ai/match/${jobId}`);
        return response.data;
    },

    generateDescription: async (title: string, category: string) => {
        const response = await api.post('/ai/generate-description', { title, category });
        return response.data;
    }
};
