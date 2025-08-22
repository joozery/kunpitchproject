import axios from 'axios';

const API_BASE_URL = 'https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api';

const parseApiJson = async (response) => {
  const json = await response.json();
  if (json && typeof json === 'object' && 'success' in json) {
    if (!json.success) {
      throw new Error(json.message || 'Request failed');
    }
    return json.data;
  }
  return json;
};

// YouTube API service
export const youtubeApi = {
  // Get all active YouTube videos
  async getAllVideos() {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      throw error;
    }
  },

  // Get all videos for admin (including inactive)
  async getAllVideosForAdmin() {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/admin/all`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch all videos');
      }
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error fetching all YouTube videos:', error);
      throw error;
    }
  },

  // Get video by ID
  async getVideoById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/${id}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      throw error;
    }
  },

  // Create new video
  async createVideo(videoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create video');
      }
      
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error creating YouTube video:', error);
      throw error;
    }
  },

  // Update video
  async updateVideo(id, videoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update video');
      }
      
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error updating YouTube video:', error);
      throw error;
    }
  },

  // Delete video (soft delete)
  async deleteVideo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete video');
      }
      
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error deleting YouTube video:', error);
      throw error;
    }
  },

  // Hard delete video
  async hardDeleteVideo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/${id}/hard`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to hard delete video');
      }
      
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error hard deleting YouTube video:', error);
      throw error;
    }
  },

  // Update sort order for multiple videos
  async updateSortOrder(videos) {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/sort/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ videos }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update sort order');
      }
      
      return await parseApiJson(response);
    } catch (error) {
      console.error('Error updating sort order:', error);
      throw error;
    }
  },

  // Extract YouTube video ID from URL
  extractVideoId(url) {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  },

  // Generate YouTube thumbnail URL
  getThumbnailUrl(videoId, quality = 'medium') {
    if (!videoId) return null;
    
    const qualities = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault',
      standard: 'sddefault',
      maxres: 'maxresdefault'
    };
    
    const qualityKey = qualities[quality] || 'mqdefault';
    return `https://img.youtube.com/vi/${videoId}/${qualityKey}.jpg`;
  },

  // Generate YouTube embed URL
  getEmbedUrl(videoId) {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  },

  // Generate YouTube watch URL
  getWatchUrl(videoId) {
    if (!videoId) return null;
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}; 