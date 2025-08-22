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
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  TrendingUp as TrendingUpIcon,
  Zap,
  Shield
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import joinBanner from '../assets/joinbanner.png'
import bannerMobile from '../assets/bannermobile.png'

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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Image Only */}
      <section className="relative pt-20">
        <div className="w-full">
          <img 
            src={joinBanner} 
            alt="Join Us Hero" 
            className="hidden md:block w-full h-auto"
          />
          <img 
            src={bannerMobile} 
            alt="Join Us Hero Mobile" 
            className="md:hidden w-full h-auto"
          />
        </div>
      </section>

      {/* WHALESPACE AGENT Content */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center" style={{ fontFamily: "Prompt, sans-serif" }}>
            {/* Heading with Line Button */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative mb-6 md:mb-8"
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6" style={{ color: "#051d40" }}>
                WHALESPACE AGENT
              </h2>
              
              {/* Line Button */}
              <div className="absolute top-0 right-0">
                <button className="bg-green-500 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-bold flex items-center gap-2 md:gap-3 hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base">
                  <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.346 0 .63.285.63.63v4.141h1.756c.345 0 .629.283.629.63 0 .344-.284.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  <span className="hidden sm:inline">Whalespace</span>
                </button>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl mb-3 md:mb-4" 
              style={{ color: "#737373" }}
            >
              Your Opportunity Starts Here | Join Whalespace Today!
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl font-bold mb-6 md:mb-8" 
              style={{ color: "#051d40" }}
            >
              Real Opportunities in Real Estate
            </motion.p>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 md:px-0" 
              style={{ color: "#737373" }}
            >
              Whalespace is now inviting you to join our team. Gain exclusive access to
              property listings, client databases, and real career growth opportunities.
            </motion.p>

            {/* Why Work with Whalespace */}
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" 
              style={{ color: "#051d40" }}
            >
              Why Work with Whalespace?
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="max-w-4xl mx-auto mb-12 md:mb-16 px-4 md:px-0"
            >
              <ul
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 text-left"
                style={{ color: "#545454" }}
              >
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <div className="text-sm md:text-base">
                    <strong>Access to a wide range of properties ready for closing</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}– houses, condominiums, land, and new developments nationwide.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <div className="text-sm md:text-base">
                    <strong>Career growth & income potential</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}– expand your skills and increase your earnings.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <div className="text-sm md:text-base">
                    <strong>Free training & mentorship</strong>
                    <span style={{ fontWeight: "normal" }}> – no fees required.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <div className="text-sm md:text-base">
                    <strong>Step-up commission system</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}– the more you sell, the more you earn.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <div className="text-sm md:text-base">
                    <strong>Flexible working</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}– manage your own schedule while receiving full support.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 md:mt-3 flex-shrink-0"></div>
                  <div className="text-sm md:text-base">
                    <strong>Professional growth</strong>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}– advance your career with Whalespace.
                    </span>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Full Support from Experts */}
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
              style={{ color: "#051d40" }}
            >
              Full Support from Experts
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-base md:text-lg mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4 md:px-0" 
              style={{ color: "#737373" }}
            >
              Our experienced Whalespace team provides complete support, including
              property information, marketing (online and offline), and document
              handling— so you can focus on growing your opportunity efficiently.
            </motion.p>

            {/* Call to Action */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="text-lg md:text-xl font-semibold px-4 md:px-0" 
              style={{ color: "#737373" }}
            >
              Don't miss the chance to kickstart your career as a real estate agent
              with Whalespace. <br />
              <span style={{ color: "#051d40" }}>
                Interested? Apply now and join the Whalespace Agent team!
              </span>
            </motion.p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default Join 