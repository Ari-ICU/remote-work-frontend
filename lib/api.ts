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

// Shared refresh promise to prevent concurrent refresh calls
let refreshPromise: Promise<any> | null = null;

/**
 * Shared function to handle token refresh logic
 * This can be called from both the interceptor and directly from services
 */
export const refreshTokens = async () => {
    // If a refresh is already in progress, return the existing promise
    if (refreshPromise) {
        console.log('⏳ [Auth] Using existing refresh promise');
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

            // Don't even try if no token exists or if it's an invalid string
            if (!storedRefreshToken || storedRefreshToken === 'undefined' || storedRefreshToken === 'null') {
                console.warn('⚠️ [Auth] No valid refresh token found in storage, skipping request');
                throw new Error('No valid refresh token');
            }

            console.log(`🔄 [Auth] Attempting token refresh (Token length: ${storedRefreshToken.length})`);

            // Use direct axios to avoid interceptor loop
            const response = await axios.post(`${API_URL}/auth/refresh`,
                { refreshToken: storedRefreshToken },
                { withCredentials: true }
            );

            console.log('✅ [Auth] Token refresh successful');

            const { accessToken, refreshToken, user } = response.data;

            // Update storage
            if (typeof window !== 'undefined') {
                if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    // Re-sync the auth cookie
                    const isSecure = window.location.protocol === 'https:';
                    document.cookie = `is_authenticated=true; path=/; max-age=604800; SameSite=Lax${isSecure ? '; Secure' : ''}`;
                    window.dispatchEvent(new CustomEvent("auth-update"));
                }
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ [Auth Error] Token refresh failed:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });

            // Only clear storage if it's a definitive auth failure (401 or 403)
            // Network errors shouldn't necessarily log the user out
            if (error.response?.status === 401 || error.response?.status === 403 || error.message === 'No valid refresh token') {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('refreshToken');
                    document.cookie = `is_authenticated=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
                }
            }
            throw error;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
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
            // Skip auth refresh for public endpoints or if already retried
            if (originalRequest.headers?.['x-skip-auth'] === 'true') {
                return Promise.reject(error);
            }

            // Prevent infinite loops if refresh endpoint itself fails
            if (originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                await refreshTokens();
                // After successful refresh, retry the original request
                return api(originalRequest);
            } catch (refreshError: any) {
                // If refresh fails, just reject the original request
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);





export default api;
