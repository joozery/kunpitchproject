const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1991/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Projects API
export const projectApi = {
  // Get all projects with pagination and filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.project_type) queryParams.append('project_type', params.project_type);
    if (params.developer) queryParams.append('developer', params.developer);
    if (params.district) queryParams.append('district', params.district);
    if (params.province) queryParams.append('province', params.province);

    const queryString = queryParams.toString();
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`;
    
    return apiCall(endpoint);
  },

  // Get project by ID
  getById: async (id) => {
    return apiCall(`/projects/${id}`);
  },

  // Create new project
  create: async (projectData) => {
    return apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Update project
  update: async (id, projectData) => {
    return apiCall(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  // Delete project
  delete: async (id) => {
    return apiCall(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Upload project image
  uploadImage: async (projectId, imageFile, options = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    if (options.is_cover !== undefined) {
      formData.append('is_cover', options.is_cover);
    }
    if (options.image_order !== undefined) {
      formData.append('image_order', options.image_order);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Image Upload Error:', error);
      throw error;
    }
  },

  // Delete project image
  deleteImage: async (projectId, imageId) => {
    return apiCall(`/projects/${projectId}/images/${imageId}`, {
      method: 'DELETE',
    });
  },

  // Get facilities list
  getFacilities: async () => {
    return apiCall('/projects/facilities/list');
  },
};

// Export default for convenience
export default projectApi; 