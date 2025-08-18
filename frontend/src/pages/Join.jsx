import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Building2, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Send,
  Star,
  Award,
  Briefcase,
  Globe
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Join = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success
      setSubmitted(true)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', position: '', experience: '', message: '' })
      
      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
      
    } catch (error) {
      console.error('Submission error:', error)
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const positions = [
    {
      title: 'Real Estate Agent',
      description: 'นายหน้าอสังหาริมทรัพย์',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      requirements: ['ประสบการณ์ 2+ ปี', 'มีใบอนุญาต', 'ทักษะการขาย', 'ความรู้ด้านอสังหาฯ']
    },
    {
      title: 'Marketing Specialist',
      description: 'ผู้เชี่ยวชาญการตลาด',
      icon: Target,
      color: 'from-green-500 to-green-600',
      requirements: ['ประสบการณ์ 3+ ปี', 'ความรู้ Digital Marketing', 'ทักษะการวิเคราะห์', 'ความคิดสร้างสรรค์']
    },
    {
      title: 'Property Consultant',
      description: 'ที่ปรึกษาอสังหาริมทรัพย์',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      requirements: ['ประสบการณ์ 5+ ปี', 'ความรู้ลึกด้านอสังหาฯ', 'ทักษะการเจรจา', 'เครือข่ายกว้าง']
    },
    {
      title: 'Sales Manager',
      description: 'ผู้จัดการฝ่ายขาย',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      requirements: ['ประสบการณ์ 7+ ปี', 'ทักษะการจัดการทีม', 'ผลงานการขายสูง', 'ภาวะผู้นำ']
    }
  ]

  const benefits = [
    {
      icon: Star,
      title: 'โอกาสเติบโตสูง',
      description: 'โอกาสก้าวหน้าในสายงานและตำแหน่งที่สูงขึ้น'
    },
    {
      icon: Award,
      title: 'ค่าคอมมิชชั่นสูง',
      description: 'ค่าตอบแทนที่สูงกว่าตลาดทั่วไป'
    },
    {
      icon: Briefcase,
      title: 'งานที่ยืดหยุ่น',
      description: 'เวลาทำงานที่ยืดหยุ่นและอิสระ'
    },
    {
      icon: Globe,
      title: 'เครือข่ายกว้าง',
      description: 'โอกาสสร้างเครือข่ายในวงการอสังหาฯ'
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-12 shadow-xl"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-oswald">
                ส่งใบสมัครสำเร็จ!
              </h1>
              <p className="text-lg text-gray-600 mb-8 font-prompt">
                ขอบคุณสำหรับการสนใจร่วมงานกับเรา ทีมงานจะติดต่อกลับภายใน 3-5 วันทำการ
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                กลับหน้าหลัก
              </button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <span className="text-blue-600 font-oswald text-base md:text-lg lg:text-xl uppercase tracking-wider">Join Our Team</span>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-oswald text-gray-900"
            >
              ร่วมงานกับเรา
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto font-prompt"
            >
              มาสร้างอนาคตที่สดใสไปพร้อมกับ Whale Space 
              เราเปิดรับบุคคลากรที่มีความสามารถและความมุ่งมั่น
            </motion.p>
          </motion.div>

          {/* Available Positions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-oswald">
              ตำแหน่งที่เปิดรับ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {positions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${position.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <position.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 font-prompt">
                        {position.title}
                      </h3>
                      <p className="text-gray-600 mb-4 font-prompt">
                        {position.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800 font-prompt">คุณสมบัติ:</h4>
                        {position.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="font-prompt">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-oswald">
              สิทธิประโยชน์
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-prompt">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm font-prompt">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-oswald">
                สมัครงาน
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      ชื่อ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ชื่อ"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      นามสกุล *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="นามสกุล"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="081-234-5678"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      ตำแหน่งที่สนใจ *
                    </label>
                    <select
                      required
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">เลือกตำแหน่ง</option>
                      <option value="real_estate_agent">Real Estate Agent</option>
                      <option value="marketing_specialist">Marketing Specialist</option>
                      <option value="property_consultant">Property Consultant</option>
                      <option value="sales_manager">Sales Manager</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      ประสบการณ์ (ปี) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="เช่น 3"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    ข้อความเพิ่มเติม
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="บอกเราเพิ่มเติมเกี่ยวกับตัวคุณ ประสบการณ์ หรือเหตุผลที่อยากร่วมงานกับเรา..."
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-prompt disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline mr-2"></div>
                        กำลังส่งใบสมัคร...
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6 inline mr-2" />
                        ส่งใบสมัคร
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 font-prompt"
            >
              <ArrowLeft className="h-5 w-5" />
              กลับหน้าหลัก
            </button>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Join 