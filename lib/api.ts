import axios from 'axios';
import { loadingStore } from './loading-store';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log(`🚀 [API] Using URL: ${API_URL}`);

if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && API_URL.includes('localhost')) {
        console.error("⛔ [Auth Error] Your frontend is on Vercel but API_URL is still localhost. This WILL cause 401/Connect errors. Please set NEXT_PUBLIC_API_URL in Vercel.");
    }
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

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

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
            // Skip auth refresh for public endpoints
            if (originalRequest.headers?.['x-skip-auth'] === 'true') {
                return Promise.reject(error);
            }

            // Prevent infinite loops if refresh endpoint itself fails
            if (originalRequest.url?.includes('/auth/refresh')) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('refreshToken');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh tokens via cookies OR body fallback
                console.log('🔄 [Auth] Attempting token refresh...');
                const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

                const refreshResponse = await axios.post(`${API_URL}/auth/refresh`,
                    { refreshToken: storedRefreshToken },
                    { withCredentials: true }
                );

                console.log('✅ [Auth] Token refresh successful');

                const { accessToken, refreshToken, user } = refreshResponse.data;

                // Update storage
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                if (user) localStorage.setItem('user', JSON.stringify(user));

                processQueue(null, accessToken);
                return api(originalRequest);
            } catch (refreshError: any) {
                console.error('❌ [Auth Error] Token refresh failed:', {
                    status: refreshError.response?.status,
                    message: refreshError.response?.data?.message || refreshError.message
                });

                processQueue(refreshError, null);

                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('refreshToken');
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);





export default api;
