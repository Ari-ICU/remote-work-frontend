import api from '../api';

export const messagingService = {
    getConversations: async () => {
        const response = await api.get('/messaging/conversations');
        return response.data;
    },

    getMessages: async (otherUserId: string) => {
        const response = await api.get(`/messaging/${otherUserId}`);
        return response.data;
    }
};
