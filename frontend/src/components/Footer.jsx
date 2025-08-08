import React from 'react'
import { Building2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 rounded-lg p-2">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-prompt">Kunpitch</h3>
                <p className="text-xs text-gray-400 font-prompt">Real Estate</p>
              </div>
            </div>
            <p className="text-gray-400 font-prompt leading-relaxed">
              บริษัทอสังหาริมทรัพย์ชั้นนำที่มุ่งมั่นให้บริการลูกค้าด้วยความซื่อสัตย์และเป็นมืออาชีพ
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 font-prompt">บริการ</h4>
            <ul className="space-y-3 text-gray-400 font-prompt">
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">ที่อยู่อาศัย</li>
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">เชิงพาณิชย์</li>
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">ที่ดิน</li>
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">ให้คำปรึกษา</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 font-prompt">บริษัท</h4>
            <ul className="space-y-3 text-gray-400 font-prompt">
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">เกี่ยวกับเรา</li>
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">ทีมงาน</li>
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">ข่าวสาร</li>
              <li className="hover:text-white transition-colors duration-300 cursor-pointer">ติดต่อ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 font-prompt">ติดต่อ</h4>
            <ul className="space-y-3 text-gray-400 font-prompt">
              <li>123 ถนนสุขุมวิท, กรุงเทพฯ</li>
              <li>02-123-4567</li>
              <li>info@kunpitch.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 font-prompt">
          <p>&copy; 2024 Kunpitch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 