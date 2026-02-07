import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // No longer need to manually add the token from localStorage
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                // Optional: redirect to login
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
