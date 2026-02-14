import api from '../api';

export const authService = {
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            // Set cookies for middleware
            if (response.data.accessToken) {
                document.cookie = `token=${response.data.accessToken}; path=/; max-age=900; SameSite=Lax`; // 15m
            }
            if (response.data.refreshToken) {
                document.cookie = `refresh_token=${response.data.refreshToken}; path=/; max-age=604800; SameSite=Lax`; // 7d
            }

            window.dispatchEvent(new CustomEvent("auth-update"));
        }
        return response.data;
    },

    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            // Set cookies for middleware
            if (response.data.accessToken) {
                document.cookie = `token=${response.data.accessToken}; path=/; max-age=900; SameSite=Lax`; // 15m
            }
            if (response.data.refreshToken) {
                document.cookie = `refresh_token=${response.data.refreshToken}; path=/; max-age=604800; SameSite=Lax`; // 7d
            }

            window.dispatchEvent(new CustomEvent("auth-update"));
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
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');

        // Clear middleware cookies
        document.cookie = `token=; path=/; max-age=0`;
        document.cookie = `refresh_token=; path=/; max-age=0`;
        document.cookie = `is_authenticated=; path=/; max-age=0`;

        window.dispatchEvent(new CustomEvent("auth-update"));
        window.dispatchEvent(new CustomEvent("auth-unauthorized"));
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
    },

    refresh: async () => {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh', { refreshToken });

        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            // Set cookies for middleware
            if (response.data.accessToken) {
                document.cookie = `token=${response.data.accessToken}; path=/; max-age=900; SameSite=Lax`; // 15m
            }
            if (response.data.refreshToken) {
                document.cookie = `refresh_token=${response.data.refreshToken}; path=/; max-age=604800; SameSite=Lax`; // 7d
            }

            window.dispatchEvent(new CustomEvent("auth-update"));
        }
        return response.data;
    }
};
