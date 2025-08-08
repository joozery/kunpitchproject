import axios from 'axios';

// API Configuration - Use production API
const API_BASE_URL = 'https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API call failed:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } else {
      // Something else happened
      throw new Error(error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
  }
);

// Property API
export const propertyAPI = {
  // Get all properties
  getAll: () => api.get('/properties'),
  
  // Get property by ID
  getById: (id) => api.get(`/properties/${id}`),
  
  // Create new property
  create: (propertyData) => api.post('/properties', propertyData),
  
  // Update property
  update: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  
  // Delete property
  delete: (id) => api.delete(`/properties/${id}`),
  
  // Search properties
  search: (params) => api.get('/properties/search', { params }),
};

// Upload API
export const uploadAPI = {
  // Upload single image
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Upload multiple images
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete image
  delete: (publicId) => api.delete(`/upload/${publicId}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default {
  propertyAPI,
  uploadAPI,
  healthCheck,
}; 