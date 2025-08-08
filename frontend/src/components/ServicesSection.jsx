import React from 'react'
import { motion } from 'framer-motion'
import { Home as HomeIcon, Building2, Landmark, CheckCircle } from 'lucide-react'

const ServicesSection = () => {
  const services = [
    {
      icon: HomeIcon,
      title: 'ที่อยู่อาศัย',
      description: 'บ้าน คอนโด ทาวน์เฮาส์ ในทำเลทอง พร้อมสิ่งอำนวยความสะดวกครบครัน',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      features: ['ทำเลทอง', 'สิ่งอำนวยความสะดวกครบครัน', 'ความปลอดภัยสูง']
    },
    {
      icon: Building2,
      title: 'เชิงพาณิชย์',
      description: 'สำนักงาน ร้านค้า โรงแรม ในทำเลธุรกิจชั้นนำ',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      features: ['ทำเลธุรกิจชั้นนำ', 'โอกาสการลงทุนสูง', 'ผลตอบแทนดี']
    },
    {
      icon: Landmark,
      title: 'ที่ดิน',
      description: 'ที่ดินเปล่า ไร่นา สวน พร้อมศักยภาพการพัฒนา',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      features: ['ศักยภาพการพัฒนา', 'โอกาสการลงทุน', 'มูลค่าเพิ่มสูง']
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
          >
            บริการของเรา
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
          >
            เรามีบริการครบครันสำหรับทุกความต้องการ พร้อมทีมงานมืออาชีพให้คำปรึกษา
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-20 h-20 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
                <service.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-prompt text-center">{service.title}</h3>
              <p className="text-gray-600 font-prompt text-center mb-6">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-gray-700 font-prompt">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection 