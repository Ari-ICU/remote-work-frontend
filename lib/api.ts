import axios from 'axios';
import { loadingStore } from './loading-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

if (typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    API_URL.includes('localhost')) {
    console.warn("⚠️ [Auth Warning] Your frontend is on Vercel but API_URL is still localhost. API calls will fail.");
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
});

// Helper to track if we should show loading for this request
const shouldShowLoading = (config: any) => {
    if (config.headers?.['x-skip-loading'] === 'true') return false;
    return true;
};

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        if (shouldShowLoading(config)) {
            loadingStore.setIsLoading(true);
        }

        // Attach Authorization header if token exists in localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token && token !== 'undefined' && token !== 'null') {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        if (shouldShowLoading(response.config)) {
            loadingStore.setIsLoading(false);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.config && shouldShowLoading(error.config)) {
            loadingStore.setIsLoading(false);
        } else if (!error.config) {
            loadingStore.setIsLoading(false);
        }

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip auth refresh for public endpoints (e.g., AI chat without login)
            if (originalRequest.headers?.['x-skip-auth'] === 'true') {
                return Promise.reject(error);
            }

            // Prevent infinite loops if refresh endpoint itself fails
            if (originalRequest.url?.includes('/auth/refresh')) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('accessToken');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                let refreshToken = null;
                if (typeof window !== 'undefined') {
                    refreshToken = localStorage.getItem('refreshToken');
                }

                if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
                    console.warn('No refresh token available in localStorage');
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('user');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('accessToken');
                        window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                    }
                    return Promise.reject(new Error('No refresh token available'));
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });

                const { accessToken, refreshToken: newRefreshToken, user } = response.data;

                // Update localStorage with new tokens
                if (typeof window !== 'undefined') {
                    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
                    if (accessToken) localStorage.setItem('accessToken', accessToken);
                    if (user) localStorage.setItem('user', JSON.stringify(user));

                    // Also update cookies for middleware
                    document.cookie = `token=${accessToken}; path=/; max-age=900; SameSite=Lax`;
                    if (newRefreshToken) {
                        document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=604800; SameSite=Lax`;
                    }
                }

                // Update the Authorization header for the original request
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed
                console.error('Token refresh failed:', refreshError);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('accessToken');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);



export default api;
