import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Building2,
  Globe
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('ขอบคุณสำหรับข้อความ! เราจะติดต่อกลับโดยเร็วที่สุด');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'โทรศัพท์',
      content: '+66 2 123 4567',
      description: 'จันทร์ - ศุกร์ 9:00 - 18:00 น.'
    },
    {
      icon: Mail,
      title: 'อีเมล',
      content: 'info@whalespace.com',
      description: 'ตอบกลับภายใน 24 ชั่วโมง'
    },
    {
      icon: MapPin,
      title: 'ที่อยู่',
      content: '123 ถนนสุขุมวิท, กรุงเทพฯ 10110',
      description: 'สำนักงานใหญ่'
    },
    {
      icon: Clock,
      title: 'เวลาทำการ',
      content: 'จันทร์ - ศุกร์',
      description: '9:00 - 18:00 น.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                ติดต่อเรา
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                เราพร้อมให้คำปรึกษาและบริการเกี่ยวกับอสังหาริมทรัพย์ 
                ติดต่อเราได้ทุกช่องทางที่สะดวก
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-left delay-200">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ส่งข้อความถึงเรา
                </h2>
                <p className="text-gray-600">
                  กรอกข้อมูลด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ชื่อ-นามสกุล"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="081-234-5678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      หัวข้อ *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="หัวข้อที่ต้องการติดต่อ"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข้อความ *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="รายละเอียดที่ต้องการติดต่อ..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังส่ง...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      ส่งข้อความ
                    </>
                  )}
                </button>
                              </form>
              </div>

            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in-right delay-400">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ข้อมูลติดต่อ
                </h2>
                <p className="text-gray-600 mb-8">
                  เราพร้อมให้บริการและคำปรึกษาเกี่ยวกับอสังหาริมทรัพย์ 
                  ติดต่อเราได้ทุกช่องทางที่สะดวก
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg animate-fade-in-up"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-800 font-medium mb-1">
                        {item.content}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                                          </div>
                    </div>
                  ))}
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 animate-fade-in-up delay-1000">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  เกี่ยวกับ Whale Space
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Whale Space เป็นบริษัทอสังหาริมทรัพย์ชั้นนำที่ให้บริการครบวงจร 
                  ตั้งแต่การซื้อขาย เช่า จัดการ และให้คำปรึกษาเกี่ยวกับอสังหาริมทรัพย์ 
                  เรามีประสบการณ์มากกว่า 10 ปี และพร้อมให้บริการลูกค้าทุกคน
                                  </p>
                </div>
              </div>
          </div>

          {/* Map Section */}
          <div className="mt-16 animate-fade-in-up delay-1200">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                ตำแหน่งสำนักงาน
              </h2>
              <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">แผนที่ Google Maps</p>
                  <p className="text-sm">123 ถนนสุขุมวิท, กรุงเทพฯ 10110</p>
                </div>
                              </div>
              </div>
            </div>
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;











