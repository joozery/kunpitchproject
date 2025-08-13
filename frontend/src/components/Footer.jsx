import React from 'react'
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'
import logo from '../assets/WHLE-03.png'

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 py-20">
      {/* Professional border top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-slate-200/20" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Whalespace" className="h-12 w-auto" />
              <div>
                <h3 className="text-xl font-bold tracking-wide text-slate-900">WHALE SPACE</h3>
                <p className="text-xs text-slate-500 font-medium">INTERNATIONAL REAL ESTATE</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              Connecting you to the right space, from condos and houses to projects, land and commercial properties
            </p>
            <div className="flex gap-3">
              <a className="p-2.5 rounded-xl bg-white/60 hover:bg-white/80 shadow-sm hover:shadow-md transition-all duration-300 border border-white/20" href="#" aria-label="Facebook">
                <Facebook className="h-4 w-4 text-slate-700" />
              </a>
              <a className="p-2.5 rounded-xl bg-white/60 hover:bg-white/80 shadow-sm hover:shadow-md transition-all duration-300 border border-white/20" href="#" aria-label="Instagram">
                <Instagram className="h-4 w-4 text-slate-700" />
              </a>
              <a className="p-2.5 rounded-xl bg-white/60 hover:bg-white/80 shadow-sm hover:shadow-md transition-all duration-300 border border-white/20" href="#" aria-label="YouTube">
                <Youtube className="h-4 w-4 text-slate-700" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-slate-900">Services</h4>
            <ul className="space-y-3 text-slate-600">
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                Property Search & Sales
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                Rental Services
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                Land Development
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                Investment Consulting
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-slate-900">Company</h4>
            <ul className="space-y-3 text-slate-600">
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                About Us
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                Our Team
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                News & Updates
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors duration-300 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                Contact
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-slate-900">Contact Us</h4>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-blue-500" />
                Bangkok, Thailand
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                +66 2-123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                info@whalespace.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with professional styling */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-8 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Whalespace. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors duration-300 border-b border-transparent hover:border-slate-400 pb-0.5">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors duration-300 border-b border-transparent hover:border-slate-400 pb-0.5">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors duration-300 border-b border-transparent hover:border-slate-400 pb-0.5">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 