import React from 'react'
import { TbBuildingSkyscraper, TbBuildingEstate } from 'react-icons/tb'
import { IoHomeOutline } from 'react-icons/io5'
import { SlLocationPin } from 'react-icons/sl'

const CategoryBar = () => {
  const items = [
    { id: 'condo', label: 'Condo/Apartment', Icon: TbBuildingSkyscraper, color: 'bg-green-500' },
    { id: 'house', label: 'House/Townhouse', Icon: IoHomeOutline, color: 'bg-sky-500' },
    { id: 'commercial', label: 'Commercial', Icon: TbBuildingEstate, color: 'bg-purple-500' },
    { id: 'land', label: 'Land', Icon: SlLocationPin, color: 'bg-indigo-500' }
  ]

  return (
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl px-6">
      {/* Desktop / tablet: equal width columns */}
      <div className="hidden md:grid grid-cols-4 gap-5">
        {items.map(({ id, label, Icon, color }) => (
          <button
            key={id}
            className="w-full flex items-center justify-center gap-3 rounded-full px-6 py-2.5 text-white shadow-lg backdrop-blur-sm"
            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))' }}
          >
            <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${color}`}>
              <Icon className="text-white w-5 h-5" />
            </span>
            <span className="font-oswald text-base whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide justify-start">
        {items.map(({ id, label, Icon, color }) => (
          <button
            key={id}
            className="min-w-[220px] flex items-center gap-3 rounded-full px-5 py-2.5 text-white shadow-lg backdrop-blur-sm"
            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))' }}
          >
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${color}`}>
              <Icon className="text-white w-5 h-5" />
            </span>
            <span className="font-oswald text-base whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryBar

