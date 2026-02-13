import api from '../api';

export const messagingService = {
    getConversations: async () => {
        const response = await api.get('/messaging/conversations');
        return response.data;
    },

    getUnreadCount: async (config?: any) => {
        const response = await api.get('/messaging/unread-count', config);
        return response.data;
    },


    getMessages: async (otherUserId: string) => {
        const response = await api.get(`/messaging/${otherUserId}`);
        return response.data;
    },

    uploadAttachment: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/messaging/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
