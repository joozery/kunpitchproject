import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, Clock } from 'lucide-react'

const ContactSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center text-white mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-prompt"
          >
            ติดต่อเรา
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
          >
            พร้อมให้คำปรึกษาและบริการคุณตลอด 24 ชั่วโมง
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-white"
          >
            <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-prompt">โทรศัพท์</h3>
            <p className="text-blue-100 font-prompt text-lg">02-123-4567</p>
            <p className="text-blue-200 font-prompt text-sm">จันทร์-ศุกร์ 9:00-18:00</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-white"
          >
            <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-prompt">อีเมล</h3>
            <p className="text-blue-100 font-prompt text-lg">info@kunpitch.com</p>
            <p className="text-blue-200 font-prompt text-sm">ตอบกลับภายใน 24 ชั่วโมง</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-white"
          >
            <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-prompt">เวลาทำการ</h3>
            <p className="text-blue-100 font-prompt text-lg">จันทร์-ศุกร์ 9:00-18:00</p>
            <p className="text-blue-200 font-prompt text-sm">เสาร์ 9:00-15:00</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            ติดต่อเราเลย
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection 