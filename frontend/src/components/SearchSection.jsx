import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')

  const handleSearch = () => {
    // Handle search functionality
    console.log('Search:', { searchQuery, propertyType, priceRange })
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
          >
            ค้นหา Property ที่ใช่สำหรับคุณ
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg lg:text-xl font-prompt max-w-2xl mx-auto"
          >
            ค้นหาอสังหาริมทรัพย์ที่ตรงใจในราคาที่เหมาะสม พร้อมบริการครบครัน
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 max-w-5xl mx-auto border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาตามชื่อหรือที่อยู่"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <select 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">ประเภท Property</option>
              <option value="residential">ที่อยู่อาศัย</option>
              <option value="commercial">เชิงพาณิชย์</option>
              <option value="land">ที่ดิน</option>
            </select>
            <select 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">ราคา</option>
              <option value="0-1000000">0 - 1,000,000</option>
              <option value="1000000-5000000">1,000,000 - 5,000,000</option>
              <option value="5000000-10000000">5,000,000 - 10,000,000</option>
              <option value="10000000+">10,000,000+</option>
            </select>
            <button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              ค้นหา
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SearchSection 