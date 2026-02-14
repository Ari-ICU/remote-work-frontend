import api from '../api';

export const authService = {
    register: async (userData: any) => {
        // Clear potential stale data
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');

        const response = await api.post('/auth/register', userData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            // Set a non-HttpOnly cookie for the Middleware to see
            const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const secureFlag = isSecure ? '; Secure' : '';
            document.cookie = `is_authenticated=true; path=/; max-age=604800; SameSite=Lax${secureFlag}`;

            window.dispatchEvent(new CustomEvent("auth-update"));
        }
        return response.data;
    },

    login: async (credentials: any) => {
        // Clear potential stale data
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');

        const response = await api.post('/auth/login', credentials);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            // Set a non-HttpOnly cookie for the Middleware to see
            const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const secureFlag = isSecure ? '; Secure' : '';
            document.cookie = `is_authenticated=true; path=/; max-age=604800; SameSite=Lax${secureFlag}`;

            window.dispatchEvent(new CustomEvent("auth-update"));
        }
        return response.data;
    },

    logout: async () => {
        try {
            // Use x-skip-auth to avoid triggering a refresh loop during logout
            await api.post('/auth/logout', {}, { headers: { 'x-skip-auth': 'true' } });
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');

        // Clear the auth cookie
        document.cookie = `is_authenticated=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

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
        const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        const response = await api.post('/auth/refresh', { refreshToken: storedRefreshToken });

        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            // Re-sync cookie
            const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const secureFlag = isSecure ? '; Secure' : '';
            document.cookie = `is_authenticated=true; path=/; max-age=604800; SameSite=Lax${secureFlag}`;

            window.dispatchEvent(new CustomEvent("auth-update"));
        }
        return response.data;
    }
};


