import React from 'react'
import { FaWhatsapp, FaLine, FaFacebook, FaInstagram } from 'react-icons/fa'
import logo from '../assets/icon2.png'

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Upper Section - Main Footer Content */}
      <div className="bg-[#051d40] text-white py-16 font-prompt">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Logo Section (Far Left) */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="Whalespace" className="h-28 w-auto" />
              </div>
            </div>

            {/* Property Types Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white font-taviraj">Condo/Apartment</h4>
              <ul className="space-y-2 text-gray-300 font-taviraj">
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Sale</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Rent</li>
              </ul>
              <h4 className="text-lg font-semibold mb-4 text-white mt-6 font-taviraj">House/Townhouse</h4>
              <ul className="space-y-2 text-gray-300 font-taviraj">
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Sale</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Rent</li>
              </ul>
            </div>

            {/* Get Exclusive Deals & Updates Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white font-taviraj">Get Exclusive Deals & Updates</h4>
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-taviraj"
                />
                <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 font-taviraj">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Services Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white font-taviraj">Services</h4>
              <ul className="space-y-2 text-gray-300 font-taviraj">
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Property Search & Sales</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Rental Services</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Land Development</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Investment Consulting</li>
              </ul>
            </div>

            {/* Contact us Section */}
            <div className="lg:col-span-1 min-w-0">
              <h4 className="text-lg font-semibold mb-4 text-white font-taviraj">Contact us</h4>
              <ul className="space-y-3 text-gray-300 font-taviraj">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp className="h-4 w-4 text-white" />
                  </div>
                  <span className="truncate">+66 92 877 9143</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaLine className="h-4 w-4 text-white" />
                  </div>
                  <span className="truncate">@whalespaceth</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaFacebook className="h-4 w-4 text-white" />
                  </div>
                  <span className="truncate">facebook.com/whalespaceinter</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaInstagram className="h-4 w-4 text-white" />
                  </div>
                  <span className="truncate">whalespaceth</span>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white font-taviraj">Company</h4>
              <ul className="space-y-2 text-gray-300 font-taviraj">
                <li className="hover:text-white cursor-pointer transition-colors duration-300">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Our Team</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">News & Update</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - Copyright and Legal Links */}
      <div className="bg-gray-100 text-gray-700 py-6 font-prompt">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-taviraj">© 2025 Whalespace. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-taviraj">
              <a href="#" className="hover:text-gray-900 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer