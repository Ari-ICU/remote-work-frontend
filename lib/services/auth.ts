import api from '../api';

export const authService = {
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Set a non-HttpOnly cookie for the Middleware to see
            const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const secureFlag = isSecure ? '; Secure' : '';
            document.cookie = `is_authenticated=true; path=/; max-age=604800; SameSite=Lax${secureFlag}`;

            window.dispatchEvent(new CustomEvent("auth-update"));
        }
        return response.data;
    },

    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));

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
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem('user');

        // Clear the auth cookie
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
        const response = await api.post('/auth/refresh', {});

        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Re-sync cookie
            const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const secureFlag = isSecure ? '; Secure' : '';
            document.cookie = `is_authenticated=true; path=/; max-age=604800; SameSite=Lax${secureFlag}`;

            window.dispatchEvent(new CustomEvent("auth-update"));
        }
        return response.data;
    }
};


