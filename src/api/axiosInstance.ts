import axios from 'axios';

const API = axios.create({
  baseURL: 'https://anterc-backend.vercel.app/api', // Backend is running on port 7070
});

// Add a request interceptor to attach the token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
