import axios from 'axios';
// Banner API functions for managing banner slides and settings
// Use a dedicated env for banner backend; fallback to the working Heroku backend
const RAW_BASE = import.meta.env.VITE_BANNER_API_URL || 'https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api'
// Normalize base URL (remove trailing slashes)
const API_BASE_URL = String(RAW_BASE).replace(/\/+$/, '')
console.log('[BannerAPI] Using base URL:', API_BASE_URL)

const authHeaders = (isJson = false) => {
  const headers = {}
  if (isJson) headers['Content-Type'] = 'application/json'
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (token) headers['Authorization'] = `Bearer ${token}`
  } catch {}
  return headers
}

const parseJsonSafe = async (response) => {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return { success: response.ok, message: text || response.statusText }
  }
}

export const bannerApi = {
  // Get all slides
  getSlides: async () => {
    try {
      console.log('🌐 Calling banner API:', `${API_BASE_URL}/banner-slides`);
      const response = await fetch(`${API_BASE_URL}/banner-slides`, { headers: authHeaders(false) })
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      const data = await parseJsonSafe(response)
      console.log('📄 Response data:', data);
      
      if (!data.success) throw new Error(data.message || 'Failed to load slides')
      return data.data
    } catch (error) {
      console.error('❌ Error fetching slides:', error)
      throw error
    }
  },

  // Get settings
  getSettings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner-slides/settings`, { headers: authHeaders(false) })
      const data = await parseJsonSafe(response)
      if (!data.success) throw new Error(data.message || 'Failed to load settings')
      return data.data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  },

  // Upload image to Cloudinary via backend
  uploadImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_BASE_URL}/banner-slides/upload-image`, {
        method: 'POST',
        headers: authHeaders(false),
        body: formData
      })
      const data = await parseJsonSafe(response)
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload image')
      }
      return data.data
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  // Create new slide
  createSlide: async (slideData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner-slides`, {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify(slideData)
      })
      const data = await parseJsonSafe(response)
      if (!data.success) throw new Error(data.message || 'Failed to create slide')
      return data.data
    } catch (error) {
      console.error('Error creating slide:', error)
      throw error
    }
  },

  // Update slide fields (partial update)
  updateSlide: async (id, slideData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner-slides/${id}`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify(slideData)
      })
      const data = await parseJsonSafe(response)
      if (!data.success) throw new Error(data.message || 'Failed to update slide')
      return data.data
    } catch (error) {
      console.error('Error updating slide:', error)
      throw error
    }
  },

  // Update one slide order (optional helper if backend supports it)
  updateSlideOrder: async (id, display_order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner-slides/${id}/order`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({ display_order })
      })
      const data = await parseJsonSafe(response)
      if (!data.success) throw new Error(data.message || 'Failed to update slide order')
      return data.data
    } catch (error) {
      console.error('Error updating slide order:', error)
      throw error
    }
  },

  // Bulk update display orders
  bulkUpdateOrders: async (slides) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner-slides/bulk/order`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({ slides })
      })
      const data = await parseJsonSafe(response)
      if (!data.success) throw new Error(data.message || 'Failed to update display order')
      return data
    } catch (error) {
      console.error('Error bulk updating orders:', error)
      throw error
    }
  },

  // Update settings
  updateSettings: async (settings) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner-slides/settings`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify(settings)
      })
      const data = await parseJsonSafe(response)
      if (!data.success) throw new Error(data.message || 'Failed to update settings')
      return data.data
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  // Delete slide
  deleteSlide: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/banner-slides/${id}`, {
        method: 'DELETE',
        headers: authHeaders(false)
      })
      const data = await parseJsonSafe(response)
      if (!data.success) throw new Error(data.message || 'Failed to delete slide')
      return data
    } catch (error) {
      console.error('Error deleting slide:', error)
      throw error
    }
  }
}