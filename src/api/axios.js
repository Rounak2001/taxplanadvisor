import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

// Request interceptor (not strictly needed for cookies, but good for other headers)
api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for handling 401s (token expiry)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Logic for redirecting to login or refreshing token
            console.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
    }
);

export default api;
