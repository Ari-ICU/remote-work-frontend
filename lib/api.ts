import axios from 'axios';

import { loadingStore } from './loading-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // Only show loader if explicitly requested or for non-GET requests by default
        // Or just show it for everything for now to demonstrate global loading
        if (config.headers?.['x-skip-loading'] !== 'true') {
            loadingStore.setIsLoading(true);
        }
        return config;
    },
    (error) => {
        loadingStore.setIsLoading(false);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        loadingStore.setIsLoading(false);
        return response;
    },
    (error) => {
        loadingStore.setIsLoading(false);
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
