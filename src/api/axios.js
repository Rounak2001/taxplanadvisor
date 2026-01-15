import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

// Track ongoing refresh to prevent concurrent refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor for handling 401s (token expiry)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request already retried, reject immediately
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If we're hitting the refresh endpoint itself and it failed, logout
        if (originalRequest.url.includes('/auth/token/refresh/')) {
            isRefreshing = false;
            // Clear auth state and redirect to login
            console.error('Refresh token expired. Please login again.');
            // You can dispatch a global logout action here if needed
            return Promise.reject(error);
        }

        // If another request is already refreshing, queue this one
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
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
            // Attempt to refresh the token
            await api.post('/auth/token/refresh/');

            // Token refreshed successfully
            isRefreshing = false;
            processQueue(null, true);

            // Retry the original request
            return api(originalRequest);
        } catch (refreshError) {
            // Refresh failed
            isRefreshing = false;
            processQueue(refreshError, null);

            // Clear any auth state and redirect to login
            console.error('Session expired. Please login again.');

            return Promise.reject(refreshError);
        }
    }
);

export default api;
