import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission for this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// User API functions
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (address) => api.post('/users/addresses', address),
  updateAddress: (id, address) => api.put(`/users/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

// Product API functions
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getCategories: () => api.get('/products/categories'),
  getByCategory: (category) => api.get(`/products/category/${category}`),
};

// Order API functions
export const orderAPI = {
  checkout: (orderData) => api.post('/orders/checkout', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
  requestReturn: (id, data) => api.post(`/orders/${id}/return-request`, data),
};

// Admin API functions
export const adminAPI = {
  // Orders
  getAllOrders: (params) => api.get('/orders', { params }),
  getOrderStats: (params) => api.get('/orders/stats', { params }),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  bulkUpdateStatus: (data) => api.put('/orders/bulk-status', data),
  processReturn: (id, data) => api.post(`/orders/${id}/return`, data),
  processRefund: (id, data) => api.post(`/orders/${id}/refund`, data),
  generatePackingSlip: (id) => api.get(`/orders/${id}/packing-slip`),
  generateShippingLabel: (id) => api.get(`/orders/${id}/shipping-label`),
  
  // Products
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/products/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Users
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api; 