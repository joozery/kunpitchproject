import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, CheckCircle, Users } from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'ความน่าเชื่อถือ',
      description: 'ประสบการณ์มากกว่า 10 ปี ในวงการอสังหาริมทรัพย์'
    },
    {
      icon: Award,
      title: 'รางวัลการันตี',
      description: 'ได้รับรางวัลบริษัทอสังหาริมทรัพย์ยอดเยี่ยม 3 ปีซ้อน'
    },
    {
      icon: CheckCircle,
      title: 'บริการครบครัน',
      description: 'ให้คำปรึกษา ดูแลทุกขั้นตอน จนถึงการโอนกรรมสิทธิ์'
    },
    {
      icon: Users,
      title: 'ทีมงานมืออาชีพ',
      description: 'พนักงานที่มีประสบการณ์และความรู้ด้านอสังหาริมทรัพย์'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
          >
            ทำไมต้องเลือกเรา
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
          >
            ประสบการณ์และความน่าเชื่อถือที่ลูกค้าไว้วางใจมากกว่า 10 ปี
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-prompt">{feature.title}</h3>
                <p className="text-gray-600 font-prompt">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection 