import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const ProjectFormDebug = () => {
  const [formData, setFormData] = useState({
    building_type: []
  });

  // ฟังก์ชันจัดการการเลือกประเภทอาคาร
  const handleBuildingTypeToggle = (type) => {
    console.log('🔍 Toggling building type:', type);
    
    setFormData(prev => {
      const currentTypes = prev.building_type && Array.isArray(prev.building_type) ? prev.building_type : [];
      console.log('🔍 Current building types:', currentTypes);
      
      let newTypes;
      if (currentTypes.includes(type)) {
        newTypes = currentTypes.filter(t => t !== type);
        console.log('🔍 Removing type, new types:', newTypes);
      } else {
        newTypes = [...currentTypes, type];
        console.log('🔍 Adding type, new types:', newTypes);
      }
      
      const updatedFormData = {
        ...prev,
        building_type: newTypes
      };
      
      console.log('🔍 Updated form data building_type:', updatedFormData.building_type);
      return updatedFormData;
    });
  };

  // ฟังก์ชันตรวจสอบประเภทอาคารที่เลือก
  const isBuildingTypeSelected = (type) => {
    const isSelected = formData.building_type && Array.isArray(formData.building_type) && formData.building_type.includes(type);
    console.log(`🔍 Building type ${type} selected:`, isSelected, 'Available types:', formData.building_type);
    return isSelected;
  };

  // ฟังก์ชันทดสอบการส่งข้อมูล
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔍 Submitting form data:', formData);
    
    // สร้าง FormData
    const formDataToSend = new FormData();
    
    // เพิ่มประเภทอาคาร
    if (formData.building_type && Array.isArray(formData.building_type) && formData.building_type.length > 0) {
      formData.building_type.forEach(type => {
        formDataToSend.append('building_type', type);
        console.log('🔍 Appending building_type:', type);
      });
    } else {
      formDataToSend.append('building_type', '[]');
      console.log('🔍 Appending empty building_type array');
    }
    
    // แสดงข้อมูลที่จะส่ง
    console.log('🔍 FormData entries:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }
  };

  // Debug: ดูการเปลี่ยนแปลงของ building_type
  useEffect(() => {
    console.log('🔍 formData.building_type changed:', formData.building_type);
  }, [formData.building_type]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ทดสอบการจัดการ Building Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ประเภทอาคาร */}
            <div className="space-y-3">
              <Label>ประเภทอาคาร</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBuildingTypeToggle('high-rise')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isBuildingTypeSelected('high-rise')
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">High-rise</div>
                    <div className="text-xs opacity-75">อาคารสูง</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleBuildingTypeToggle('low-rise')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isBuildingTypeSelected('low-rise')
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">Low-rise</div>
                    <div className="text-xs opacity-75">อาคารต่ำ</div>
                  </div>
                </button>
              </div>
              
              {/* แสดงประเภทที่เลือก */}
              {formData.building_type && Array.isArray(formData.building_type) && formData.building_type.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 mb-2">ประเภทอาคารที่เลือก:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.building_type.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {type}
                        <button
                          type="button"
                          onClick={() => handleBuildingTypeToggle(type)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Debug Info */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-medium mb-2">Debug Information:</h3>
              <pre className="text-sm text-gray-700">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="submit">
                ทดสอบการส่งข้อมูล
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectFormDebug;
