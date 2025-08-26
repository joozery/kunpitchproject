import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

// Import images
import ekkamaiImg from '../assets/popular/ekkamai.jpg'
import langsuanImg from '../assets/popular/langsuan.jpg'
import bangnaImg from '../assets/popular/bangna.jpeg'
import silomImg from '../assets/popular/silom.jpg'
import iconsiamImg from '../assets/popular/iconsiam.jpg'
import asokImg from '../assets/popular/asok.png'

const PopularArea = () => {
  const popularAreas = [
    {
      id: 1,
      name: 'PhromPhong ThongLo Ekkamai',
      image: ekkamaiImg
    },
    {
      id: 2,
      name: 'Nana Asoke HuaiKhwang Rama 9',
      image: asokImg
    },
    {
      id: 3,
      name: 'Silom Sathorn ChongNonsi',
      image: silomImg
    },
    {
      id: 4,
      name: 'Chidlom Ploenchit LangSuan',
      image: langsuanImg
    },
    {
      id: 5,
      name: 'Bang Na Punnawithi UdomSuk',
      image: bangnaImg
    },
    {
      id: 6,
      name: 'ICONSIAM Riverside',
      image: iconsiamImg
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header - Same style as Featured Properties */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">Popular Area</span>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontWeight: "bold", color: "#545454" }} className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald text-center"
          >
            Popular Areas
          </motion.h2>

          {/* Sparkles Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <Sparkles className="h-8 w-8 text-blue-500" />
          </motion.div>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularAreas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-48"
              whileHover={{ scale: 1.02 }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>
              </div>

              {/* Text Content */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <h3 className="text-white text-xl md:text-2xl font-bold text-center font-prompt leading-tight drop-shadow-lg group-hover:text-blue-200 transition-colors duration-300">
                  {area.name}
                </h3>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularArea