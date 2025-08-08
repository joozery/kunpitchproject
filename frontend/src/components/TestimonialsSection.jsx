import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'คุณสมชาย ใจดี',
      role: 'เจ้าของธุรกิจ',
      content: 'บริการดีมาก พนักงานเป็นมืออาชีพ ช่วยให้ผมได้บ้านในฝันในราคาที่เหมาะสม',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'คุณสมหญิง รักดี',
      role: 'พนักงานบริษัท',
      content: 'ได้คอนโดในทำเลที่ต้องการ พร้อมสิ่งอำนวยความสะดวกครบครัน ราคาไม่แพง',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'คุณสมศักดิ์ มั่นคง',
      role: 'นักลงทุน',
      content: 'ลงทุนในที่ดินผ่านบริษัทนี้มา 3 ปีแล้ว ผลตอบแทนดีเกินคาด',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
          >
            ความประทับใจจากลูกค้า
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
          >
            ฟังเสียงจากลูกค้าที่ไว้วางใจเราในการหาบ้านในฝัน
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900 font-prompt">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm font-prompt">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 font-prompt leading-relaxed">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection 