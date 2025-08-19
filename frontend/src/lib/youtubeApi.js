const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1991/api';

// YouTube API service
export const youtubeApi = {
  // Get all active YouTube videos
  async getAllVideos() {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      throw error;
    }
  },

  // Get all videos for admin (including inactive)
  async getAllVideosForAdmin() {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/admin/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch all videos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all YouTube videos:', error);
      throw error;
    }
  },

  // Get video by ID
  async getVideoById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/youtube/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      return await response.json();
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
        },
        body: JSON.stringify(videoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create video');
      }
      
      return await response.json();
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
        },
        body: JSON.stringify(videoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update video');
      }
      
      return await response.json();
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
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete video');
      }
      
      return await response.json();
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
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to hard delete video');
      }
      
      return await response.json();
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
        },
        body: JSON.stringify({ videos }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update sort order');
      }
      
      return await response.json();
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