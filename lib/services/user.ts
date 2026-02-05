import api from '../api';

export const userService = {
    getProfile: async (id?: string) => {
        const url = id ? `/users/${id}` : '/users/profile/me';
        const response = await api.get(url);
        return response.data;
    },

    updateProfile: async (userData: any) => {
        const response = await api.patch('/users/profile', userData);
        return response.data;
    }
};
