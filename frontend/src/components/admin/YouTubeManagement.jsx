import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Move, 
  Save, 
  X, 
  Youtube,
  Play,
  Upload,
  Image
} from 'lucide-react';
import { youtubeApi } from '../../lib/youtubeApi';

const YouTubeManagement = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    video_id: '',
    thumbnail_url: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await youtubeApi.getAllVideosForAdmin();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลวิดีโอ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'กรุณากรอกชื่อวิดีโอ';
    }
    
    if (!formData.video_id.trim()) {
      newErrors.video_id = 'กรุณากรอก Video ID';
    } else {
      // Validate YouTube video ID format
      const videoId = youtubeApi.extractVideoId(formData.video_id);
      if (!videoId) {
        newErrors.video_id = 'กรุณากรอก YouTube URL หรือ video ID ที่ถูกต้อง';
      } else {
        // Update form data with extracted video ID
        setFormData(prev => ({ ...prev, video_id: videoId }));
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingVideo) {
        await youtubeApi.updateVideo(editingVideo.id, formData);
      } else {
        await youtubeApi.createVideo(formData);
      }
      
      setShowForm(false);
      setEditingVideo(null);
      resetForm();
      fetchVideos();
          } catch (error) {
        console.error('Error saving video:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกวิดีโอ: ' + error.message);
      }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      video_id: video.video_id || '',
      thumbnail_url: video.thumbnail_url || '',
      is_active: video.is_active
    });
    setSelectedImage(video.thumbnail_url);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบวิดีโอนี้?')) {
      try {
        await youtubeApi.deleteVideo(id);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('เกิดข้อผิดพลาดในการลบวิดีโอ: ' + error.message);
      }
    }
  };

  const handleHardDelete = async (id) => {
    if (window.confirm('การดำเนินการนี้จะลบวิดีโออย่างถาวร คุณแน่ใจหรือไม่?')) {
      try {
        await youtubeApi.hardDeleteVideo(id);
        fetchVideos();
      } catch (error) {
        console.error('Error hard deleting video:', error);
        alert('เกิดข้อผิดพลาดในการลบวิดีโออย่างถาวร: ' + error.message);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await youtubeApi.updateVideo(id, { is_active: !currentStatus });
      fetchVideos();
          } catch (error) {
        console.error('Error toggling video status:', error);
        alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะวิดีโอ: ' + error.message);
      }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      video_id: '',
      thumbnail_url: '',
      is_active: true
    });
    setErrors({});
    setSelectedImage(null);
  };

  const handleDragStart = (e, index) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    setIsDragging(false);
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const newVideos = [...videos];
    const [draggedVideo] = newVideos.splice(dragIndex, 1);
    newVideos.splice(dropIndex, 0, draggedVideo);

    // Update sort order
    const updatedVideos = newVideos.map((video, index) => ({
      ...video,
      sort_order: index + 1
    }));

    setVideos(updatedVideos);

          try {
        await youtubeApi.updateSortOrder(updatedVideos.map(v => ({ id: v.id, sort_order: v.sort_order })));
      } catch (error) {
        console.error('Error updating sort order:', error);
        alert('เกิดข้อผิดพลาดในการอัปเดตลำดับ: ' + error.message);
        fetchVideos(); // Revert on error
      }
  };

  const openForm = () => {
    setShowForm(true);
    setEditingVideo(null);
    resetForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVideo(null);
    resetForm();
    setSelectedImage(null);
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:1991/api'}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      setFormData(prev => ({ ...prev, thumbnail_url: data.url }));
      setSelectedImage(data.url);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      handleImageUpload(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 font-prompt">
                <Youtube className="h-8 w-8 text-red-600" />
                จัดการ YouTube
              </h1>
              <p className="text-gray-600 mt-2 font-prompt">จัดการ YouTube videos ในหน้า home</p>
            </div>
                          <button
                onClick={openForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors font-prompt"
              >
                <Plus className="h-5 w-5" />
                เพิ่มวิดีโอ
              </button>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white rounded-xl shadow-md overflow-hidden cursor-move ${
                isDragging ? 'opacity-50' : ''
              }`}
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Youtube className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold font-prompt ${
                    video.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {video.is_active ? 'แสดงผล' : 'ซ่อน'}
                  </span>
                </div>

                {/* Video ID */}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold font-prompt">
                    #{video.id}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 font-prompt">
                  {video.title}
                </h3>
                
                                  <div className="space-y-2 text-sm text-gray-600 mb-4 font-prompt">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      <span>Video ID: {video.video_id}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      <span>รูปภาพ: {video.thumbnail_url ? 'มี' : 'ไม่มี'}</span>
                    </div>
                  </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors font-prompt"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    แก้ไข
                  </button>
                  
                  <button
                    onClick={() => handleToggleActive(video.id, video.is_active)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors font-prompt ${
                      video.is_active
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {video.is_active ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        ซ่อน
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        แสดง
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors font-prompt"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-12">
            <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 font-prompt">ยังไม่มีวิดีโอ</h3>
            <p className="text-gray-600 mb-4 font-prompt">เริ่มต้นโดยการเพิ่ม YouTube video แรกของคุณ</p>
            <button
              onClick={openForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold font-prompt"
            >
              เพิ่มวิดีโอแรก
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-prompt">
                  {editingVideo ? 'แก้ไขวิดีโอ' : 'เพิ่มวิดีโอใหม่'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      ชื่อวิดีโอ *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-prompt ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ชื่อวิดีโอ"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1 font-prompt">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      YouTube URL หรือ Video ID *
                    </label>
                    <input
                      type="text"
                      name="video_id"
                      value={formData.video_id}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-prompt ${
                        errors.video_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://youtube.com/watch?v=... หรือ video ID"
                    />
                    {errors.video_id && (
                      <p className="text-red-500 text-sm mt-1 font-prompt">{errors.video_id}</p>
                    )}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    รูปภาพวิดีโอ
                  </label>
                  
                  {/* Image Preview */}
                  {(selectedImage || formData.thumbnail_url) && (
                    <div className="mb-4">
                      <img 
                        src={selectedImage || formData.thumbnail_url} 
                        alt="Preview" 
                        className="w-32 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 font-prompt">
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? 'กำลังอัพโหลด...' : 'อัพโหลดรูปภาพ'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                    
                    {formData.thumbnail_url && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, thumbnail_url: '' }));
                          setSelectedImage(null);
                        }}
                        className="text-red-600 hover:text-red-700 font-prompt"
                      >
                        ลบรูปภาพ
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2 font-prompt">
                    อัพโหลดรูปภาพหรือปล่อยว่างเพื่อใช้รูปภาพเริ่มต้นของ YouTube
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900 font-prompt">
                    แสดงผล (มองเห็นบนเว็บไซต์)
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 font-prompt"
                  >
                    <Save className="h-5 w-5" />
                    {editingVideo ? 'อัปเดตวิดีโอ' : 'เพิ่มวิดีโอ'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors font-prompt"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default YouTubeManagement; 