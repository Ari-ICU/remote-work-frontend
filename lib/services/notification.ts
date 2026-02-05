import api from '../api';

export const notificationService = {
    getAll: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    }
};
