import api from '../api';

export const authService = {
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data) {
            // Check if response contains nested user object (common in JWT auth)
            const userToStore = response.data.user || response.data;
            localStorage.setItem('user', JSON.stringify(userToStore));
        }
        return response.data;
    },

    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr || userStr === 'undefined') return null;
                return JSON.parse(userStr);
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                return null;
            }
        }
        return null;
    }
};
