import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { FaPhone, FaLine, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaInstagram } from 'react-icons/fa'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Consult = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      
      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
      
    } catch (error) {
      console.error('Submission error:', error)
      alert('An error occurred while submitting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      value: '02-123-4567',
      link: 'tel:02-123-4567',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: FaLine,
      title: 'Line',
      value: '@whalespace',
      link: 'https://line.me/ti/p/@whalespace',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: '081-234-5678',
      link: 'https://wa.me/81812345678',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaFacebookMessenger,
      title: 'Messenger',
      value: 'Whale Space',
      link: 'https://m.me/whalespace',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: FaFacebook,
      title: 'Facebook',
      value: 'Whale Space',
      link: 'https://facebook.com/whalespace',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: FaInstagram,
      title: 'Instagram',
      value: '@whalespace',
      link: 'https://instagram.com/whalespace',
      color: 'from-purple-500 via-pink-500 to-orange-500'
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
              <h1 className="text-xl font-bold text-gray-900 mb-4 font-prompt">
                Message Sent Successfully!
              </h1>
              <p className="text-sm text-gray-600 mb-8 font-prompt">
                Thank you for contacting us. Our team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Back to Home
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
              <div className="w-6 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <span className="text-blue-600 font-prompt text-sm md:text-base lg:text-lg uppercase tracking-wider">Contact Us</span>
              <div className="w-6 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 font-prompt text-gray-900"
            >
              Contact Us
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base text-gray-600 max-w-3xl mx-auto font-prompt"
            >
              Have questions or need help with real estate? 
              We're ready to provide consultation and services for you.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6 font-prompt">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="First Name - Last Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                      Email *
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
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="081-234-5678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Want to list condo for sale"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what you need..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-prompt disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 inline mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 mb-6 font-prompt">Contact Channels</h2>
                
                <div className="space-y-4">
                  {contactInfo.map((contact, index) => (
                    <motion.a
                      key={index}
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <contact.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 font-prompt">{contact.title}</h3>
                        <p className="text-gray-600 font-prompt">{contact.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Office Info */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 mb-6 font-prompt">Office Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 font-prompt">Address</h3>
                      <p className="text-gray-600 font-prompt">123 Silom Road, Bangrak, Bangkok 10500</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 font-prompt">Business Hours</h3>
                      <p className="text-gray-600 font-prompt">Monday-Friday: 9:00-18:00</p>
                      <p className="text-gray-600 font-prompt">Saturday: 9:00-15:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Consult 