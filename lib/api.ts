import axios from 'axios';
import { loadingStore } from './loading-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
                // Get refresh token from localStorage if available
                let refreshToken = null;
                if (typeof window !== 'undefined') {
                    refreshToken = localStorage.getItem('refreshToken');
                }

                // If no refresh token is available, redirect to login
                if (!refreshToken) {
                    console.warn('No refresh token available in localStorage');
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('user');
                        localStorage.removeItem('refreshToken');
                        window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                    }
                    return Promise.reject(new Error('No refresh token available'));
                }

                const response = await api.post('/auth/refresh', { refreshToken });

                // Update localStorage with new tokens
                if (response.data.refreshToken && typeof window !== 'undefined') {
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }
                if (response.data.user && typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }

                // Retry original request (cookies will be attached automatically)
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed
                console.error('Token refresh failed:', refreshError);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('refreshToken');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default api;
