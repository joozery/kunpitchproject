import axios from 'axios';

// API Configuration - Use production API with HTTPS
const API_BASE_URL = 'https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
  update: (id, propertyData) => {
    return api.put(`/properties/${id}`, propertyData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  
  // Delete property
  delete: (id) => api.delete(`/properties/${id}`),
  
  // Search properties
  search: (params) => api.get('/properties/search', { params }),
  
  // Get all projects (condo projects)
  getProjects: () => api.get('/projects'),
  
  // Get project by ID
  getProjectById: (id) => api.get(`/projects/${id}`),
  
  // Create new project
  createProject: (projectData) => api.post('/projects', projectData),
  
  // Update project
  updateProject: (id, projectData) => {
    return api.put(`/projects/${id}`, projectData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  
  // Delete project
  deleteProject: (id) => api.delete(`/projects/${id}`),
  
  // Get property by ID with fallback data
  getByIdWithFallback: async (id) => {
    try {
      const result = await api.get(`/properties/${id}`)
      return result
    } catch (error) {
      // Return fallback data if API fails
      return {
        success: true,
        data: {
          id: id,
          title: 'คอนโด 2 ห้องนอน พร้อมเฟอร์นิเจอร์',
          address: 'สีลม, กรุงเทพฯ',
          location: 'สีลม, กรุงเทพฯ',
          price: 3500000,
          rent_price: 25000,
          bedrooms: 2,
          bathrooms: 1,
          floor: 15,
          area: 45,
          parking: 1,
          type: 'condo',
          status: 'for_sale',
          description: 'คอนโดสวยงามพร้อมเฟอร์นิเจอร์ ตั้งอยู่ในทำเลทองของสีลม เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน',
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          ],
          amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนสาธารณะ'],
          nearby: ['BTS สีลม', 'MRT สีลม', 'ห้างสรรพสินค้า', 'โรงพยาบาล', 'โรงเรียน']
        }
      }
    }
  }
};

// Condo API
export const condoAPI = {
  // Get all condos
  getAll: (params = {}) => api.get('/condos', { params }),
  
  // Get condo by ID
  getById: (id) => api.get(`/condos/${id}`),
  
  // Create new condo
  create: (condoData) => api.post('/condos', condoData),
  
  // Update condo
  update: (id, condoData) => {
    return api.put(`/condos/${id}`, condoData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  
  // Delete condo
  delete: (id) => api.delete(`/condos/${id}`),
  
  // Toggle featured status
  toggleFeatured: (id) => api.patch(`/condos/${id}/featured`),
  
  // Get all facilities
  getFacilities: () => api.get('/condos/facilities/all'),
  
  // Get statistics
  getStats: () => api.get('/condos/stats/overview'),
};

// House API
export const houseAPI = {
  // Get all houses
  getAll: (params = {}) => api.get('/houses', { params }),
  
  // Get house by ID
  getById: (id) => api.get(`/houses/${id}`),
  
  // Create new house
  create: (houseData) => api.post('/houses', houseData),
  
  // Update house
  update: (id, houseData) => {
    return api.put(`/houses/${id}`, houseData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  
  // Delete house
  delete: (id) => api.delete(`/houses/${id}`),
  
  // Toggle featured status
  toggleFeatured: (id) => api.patch(`/houses/${id}/featured`),
  
  // Get all facilities
  getFacilities: () => api.get('/houses/facilities/all'),
  
  // Get statistics
  getStats: () => api.get('/houses/stats/overview'),
};

// Land API
export const landAPI = {
  // Get all lands
  getAll: (params = {}) => api.get('/lands', { params }),

  // Get land by ID
  getById: (id) => api.get(`/lands/${id}`),

  // Create new land
  create: (landData) => api.post('/lands', landData),

  // Update land
  update: (id, landData) => {
    return api.put(`/lands/${id}`, landData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Delete land
  delete: (id) => api.delete(`/lands/${id}`),
};

// Commercial API
export const commercialAPI = {
  // Get all commercials
  getAll: (params = {}) => api.get('/commercials', { params }),

  // Get commercial by ID
  getById: (id) => api.get(`/commercials/${id}`),

  // Create new commercial
  create: (commercialData) => api.post('/commercials', commercialData),

  // Update commercial
  update: (id, commercialData) => {
    return api.put(`/commercials/${id}`, commercialData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  // Delete commercial
  delete: (id) => api.delete(`/commercials/${id}`),

  // Toggle featured status
  toggleFeatured: (id) => api.patch(`/commercials/${id}/featured`),
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

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

export default {
  propertyAPI,
  condoAPI,
  houseAPI,
  landAPI,
  commercialAPI,
  uploadAPI,
  usersAPI,
  healthCheck,
}; 