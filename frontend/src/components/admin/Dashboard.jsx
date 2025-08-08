import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  DollarSign,
  Eye,
  Calendar,
  MapPin,
  BarChart3,
  Download,
  PieChart,
  Home,
  Store,
  Landmark
} from 'lucide-react'

const Dashboard = () => {
  const kpiCards = [
    {
      title: 'Property ทั้งหมด',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      description: 'เพิ่มขึ้นจากเดือนที่แล้ว',
      icon: Building2,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'ยอดขายเดือนนี้',
      value: '฿45.2M',
      change: '+8.1%',
      changeType: 'positive',
      description: 'ยอดขายอสังหาริมทรัพย์',
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'ลูกค้าใหม่',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      description: 'ลูกค้าที่ลงทะเบียนใหม่',
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'นัดหมายวันนี้',
      value: '24',
      change: 'ตามแผน',
      changeType: 'neutral',
      description: 'การนัดหมายดูบ้าน',
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    }
  ]

  const propertyTypes = [
    { type: 'ที่อยู่อาศัย', count: 89, percentage: 57, icon: Home, color: 'bg-blue-500' },
    { type: 'เชิงพาณิชย์', count: 45, percentage: 29, icon: Store, color: 'bg-green-500' },
    { type: 'ที่ดิน', count: 22, percentage: 14, icon: Landmark, color: 'bg-orange-500' }
  ]

  const recentProperties = [
    {
      id: 1,
      name: 'คอนโดลุมพินี พาร์ค',
      type: 'ที่อยู่อาศัย',
      price: '฿2,500,000',
      location: 'ลุมพินี, กรุงเทพฯ',
      status: 'พร้อมขาย',
      views: 245
    },
    {
      id: 2,
      name: 'สำนักงานสุขุมวิท 71',
      type: 'เชิงพาณิชย์',
      price: '฿8,500,000',
      location: 'สุขุมวิท 71, กรุงเทพฯ',
      status: 'พร้อมขาย',
      views: 189
    },
    {
      id: 3,
      name: 'ที่ดินรัชดา',
      type: 'ที่ดิน',
      price: '฿4,200,000',
      location: 'รัชดา, กรุงเทพฯ',
      status: 'กำลังเจรจา',
      views: 156
    },
    {
      id: 4,
      name: 'บ้านเดี่ยวรัชดา-ห้วยขวาง',
      type: 'ที่อยู่อาศัย',
      price: '฿1,800,000',
      location: 'รัชดา-ห้วยขวาง, กรุงเทพฯ',
      status: 'พร้อมขาย',
      views: 134
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <motion.div 
      className="space-y-6 font-prompt"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <motion.h1 
              className="text-3xl font-bold mb-2 font-prompt"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ยินดีต้อนรับสู่ Whalespace
            </motion.h1>
            <motion.p 
              className="text-blue-100 text-lg font-prompt"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              จัดการระบบอสังหาริมทรัพย์อย่างมีประสิทธิภาพ
            </motion.p>
          </div>
          <motion.div 
            className="flex space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" className="bg-white text-blue-700 hover:bg-gray-100 font-prompt">
                <BarChart3 className="h-4 w-4 mr-2" />
                ดูรายงานสรุป
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 font-prompt">
                <Download className="h-4 w-4 mr-2" />
                ส่งออกข้อมูล
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {Array.isArray(kpiCards) && kpiCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-prompt">{card.title}</p>
                      <motion.p 
                        className="text-3xl font-bold text-gray-900 mt-1 font-prompt"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        {card.value}
                      </motion.p>
                      <p className="text-xs text-gray-500 mt-1 font-prompt">{card.description}</p>
                    </div>
                    <motion.div 
                      className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex items-center mt-4">
                    {card.changeType === 'positive' ? (
                      <motion.div
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      </motion.div>
                    ) : card.changeType === 'negative' ? (
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      </motion.div>
                    ) : null}
                    <span className={`text-sm font-medium font-prompt ${
                      card.changeType === 'positive' ? 'text-green-600' : 
                      card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {/* Property Types Chart */}
        <motion.div variants={cardVariants} whileHover="hover">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center font-prompt">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                </motion.div>
                สัดส่วนประเภท Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(propertyTypes) && propertyTypes.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center">
                        <motion.div 
                          className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mr-3`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </motion.div>
                        <div>
                          <div className="font-medium font-prompt">{item.type}</div>
                          <div className="text-sm text-gray-500 font-prompt">{item.count} properties</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium font-prompt">{item.percentage}%</div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <motion.div 
                            className={`h-2 rounded-full ${item.color.replace('bg-', 'bg-')}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Properties */}
        <motion.div variants={cardVariants} whileHover="hover">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center font-prompt">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Building2 className="h-5 w-5 mr-2 text-green-600" />
                </motion.div>
                Property ล่าสุด
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(recentProperties) && recentProperties.map((property, index) => (
                  <motion.div 
                    key={property.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 font-prompt">{property.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="font-prompt">{property.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600 font-prompt">{property.price}</div>
                      <div className="text-xs text-gray-500 font-prompt">{property.views} วิว</div>
                    </div>
                    <div className="ml-4">
                      <motion.span 
                        className={`px-2 py-1 rounded-full text-xs font-medium font-prompt ${
                          property.status === 'พร้อมขาย' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {property.status}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard 