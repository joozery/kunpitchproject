import React from 'react'
import { motion } from 'framer-motion'
import { Home as HomeIcon, Users, Star, DollarSign } from 'lucide-react'

const StatsSection = () => {
  const stats = [
    { icon: HomeIcon, value: '500+', label: 'Property' },
    { icon: Users, value: '1000+', label: 'ลูกค้าพึงพอใจ' },
    { icon: Star, value: '4.8', label: 'คะแนนความพึงพอใจ' },
    { icon: DollarSign, value: '฿2.5B+', label: 'มูลค่าการขาย' }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <stat.icon className="h-8 w-8" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{stat.value}</div>
              <div className="text-blue-100 font-prompt text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection 