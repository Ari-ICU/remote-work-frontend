import axios from 'axios';
import { loadingStore } from './loading-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000, // 10 seconds timeout
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
            // Prevent infinite loops if refresh endpoint itself fails
            if (originalRequest.url?.includes('/auth/refresh')) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await api.post('/auth/refresh');

                // Retry original request (cookies will be attached automatically)
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default api;
