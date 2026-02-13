import axios from 'axios';
import { loadingStore } from './loading-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

        // Add authorization header if token exists
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
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
    (error) => {
        if (error.config && shouldShowLoading(error.config)) {
            loadingStore.setIsLoading(false);
        } else if (!error.config) {
            loadingStore.setIsLoading(false);
        }

        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                const isAuthPage = ['/login', '/register'].some(p => window.location.pathname.startsWith(p));
                const isHome = window.location.pathname === '/';
                if (!isAuthPage && !isHome) {
                    // Start redirect flow only if we are truly logged out
                    // window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                }
            }
        }
        return Promise.reject(error);
    }
);


export default api;
