import React from 'react'
import CondoForm from './CondoForm'

// Simple test component to verify CondoForm works
const CondoFormTest = () => {
  const handleBack = () => {
    console.log('Back clicked')
  }

  const handleSave = (data) => {
    console.log('Saved data:', data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 font-prompt">
            ทดสอบ CondoForm
          </h1>
          <p className="text-gray-600 mt-2">
            แบบฟอร์มสำหรับเพิ่มข้อมูลคอนโดมิเนียม
          </p>
        </div>
        
        <CondoForm
          onBack={handleBack}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}

export default CondoFormTest