import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  Eye as EyeIcon,
  Tag,
  Star,
  FileText,
  ArrowRight,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { PermissionGuard } from '../../lib/permissions';
import { PERMISSIONS } from '../../lib/permissions';

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: '',
    tags: '',
    author: '',
    status: 'draft',
    featured: false,
    read_time: 5
  });

  const categories = [
    'market-trends',
    'buying-guide', 
    'investment',
    'legal',
    'tips',
    'news',
    'general'
  ];

  const statuses = ['draft', 'published', 'archived'];

  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api/articles?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setArticles(data.articles);
        setTotalPages(data.pagination.pages);
      } else {
        console.error('Failed to fetch articles:', data.error);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingArticle 
        ? `https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api/articles/${editingArticle.id}`
        : 'https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key].split(',').map(tag => tag.trim())));
        } else if (key === 'featured') {
          formDataToSend.append(key, formData[key] ? '1' : '0');
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        setShowForm(false);
        setEditingArticle(null);
        setFormData({
          title: '',
          subtitle: '',
          content: '',
          category: '',
          tags: '',
          author: '',
          status: 'draft',
          featured: false,
          read_time: 5
        });
        fetchArticles();
      } else {
        const errorData = await response.json();
        console.error('Failed to save article:', errorData.error);
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      subtitle: article.subtitle || '',
      content: article.content || '',
      category: article.category || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      author: article.author || '',
      status: article.status || 'draft',
      featured: article.featured || false,
      read_time: article.read_time || 5
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบบทความนี้หรือไม่?')) {
      try {
        const response = await fetch(`https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api/articles/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchArticles();
        } else {
          console.error('Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'market-trends': 'เทรนด์ตลาด',
      'buying-guide': 'คู่มือการซื้อ',
      'investment': 'การลงทุน',
      'legal': 'กฎหมาย',
      'tips': 'เคล็ดลับ',
      'news': 'ข่าวสาร',
      'general': 'ทั่วไป'
    };
    return categoryMap[category] || category;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'draft': 'bg-gray-100 text-gray-800',
      'published': 'bg-green-100 text-green-800',
      'archived': 'bg-yellow-100 text-yellow-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get featured articles for the hero section
  const featuredArticles = articles.filter(article => article.featured).slice(0, 1);
  const recentArticles = articles.filter(article => !article.featured).slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">จัดการบทความ</h1>
              <p className="mt-2 text-gray-600">สร้างและจัดการบทความสำหรับเว็บไซต์</p>
            </div>
            <PermissionGuard permission={PERMISSIONS.ARTICLE_CREATE}>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                สร้างบทความใหม่
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ค้นหาบทความ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">ทุกสถานะ</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'draft' ? 'ร่าง' : status === 'published' ? 'เผยแพร่' : 'เก็บถาวร'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Article Section */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">ไม่มีรูปภาพ</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-medium">บทความแนะนำ</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  {featuredArticles[0].title}
                </h2>
                <p className="text-gray-200 text-lg mb-6 max-w-3xl">
                  {featuredArticles[0].subtitle}
                </p>
                <div className="flex items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredArticles[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(featuredArticles[0].created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticles[0].read_time} นาที</span>
                  </div>
                </div>
              </div>
              <button className="absolute top-1/2 right-8 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <ArrowRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Recent Articles Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">บทความล่าสุด</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(article.status)}>
                      {article.status === 'draft' ? 'ร่าง' : article.status === 'published' ? 'เผยแพร่' : 'เก็บถาวร'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(article.category)}
                    </Badge>
                    {article.featured && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.subtitle}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.read_time} นาที</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PermissionGuard permission={PERMISSIONS.ARTICLE_UPDATE}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </PermissionGuard>
                      <PermissionGuard permission={PERMISSIONS.ARTICLE_DELETE}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </Button>
            <span className="px-4 py-2 text-gray-600">
              หน้า {currentPage} จาก {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </Button>
          </div>
        )}
      </div>

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingArticle ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หัวข้อ</label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {getCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                <Input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เนื้อหา</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ผู้เขียน</label>
                  <Input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เวลาอ่าน (นาที)</label>
                  <Input
                    type="number"
                    value={formData.read_time}
                    onChange={(e) => setFormData({...formData, read_time: parseInt(e.target.value)})}
                    min="1"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'draft' ? 'ร่าง' : status === 'published' ? 'เผยแพร่' : 'เก็บถาวร'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">แท็ก (คั่นด้วยเครื่องหมายจุลภาค)</label>
                <Input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="แท็ก1, แท็ก2, แท็ก3"
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  บทความแนะนำ
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingArticle(null);
                    setFormData({
                      title: '',
                      subtitle: '',
                      content: '',
                      category: '',
                      tags: '',
                      author: '',
                      status: 'draft',
                      featured: false,
                      read_time: 5
                    });
                  }}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingArticle ? 'อัปเดต' : 'สร้าง'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesManagement;
