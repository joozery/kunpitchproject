import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import Swal from 'sweetalert2';
import { 
  FaBuilding, FaCar, FaShieldAlt, FaHeart, FaBriefcase, FaUtensils, 
  FaArrowUp, FaLock, FaMotorcycle, FaShuttleVan, FaBolt,
  FaVideo, FaUsers, FaDumbbell, FaSwimmingPool, FaBath,
  FaFutbol, FaTrophy, FaChild, FaFilm, FaPaw, FaTv, FaWineBottle,
  FaHandshake, FaLaptop, FaHamburger, FaCoffee,
  FaDoorOpen, FaCouch, FaHome, FaStore, FaBook, FaTshirt, FaSeedling, FaWifi
} from 'react-icons/fa';
// Additional icon packs for more accurate amenities icons
import { MdKitchen, MdMicrowave, MdLocalLaundryService, MdHotTub, MdBalcony, MdCheckroom, MdElevator } from 'react-icons/md';
import { RiHomeWifiLine, RiFilterLine } from 'react-icons/ri';
import { PiCookingPot, PiThermometerHot, PiOven } from 'react-icons/pi';
import { TbAirConditioning } from 'react-icons/tb';
import { LuFan } from 'react-icons/lu';

const ProjectForm = ({ project = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    name_th: '',
    name_en: '',
    project_type: '',
    developer: '',
    completion_year: '',
    status: '',
    
    // ขนาดและจำนวน
    area_range: '',
    total_units: '',
    total_buildings: '',
    floors_info: '',
    
    // ที่ตั้ง
    nearby_bts: '',
    address: '',
    district: '',
    province: '',
    postal_code: '',
    google_map_embed: '',
    
    // จุดเด่น
    location_highlights: '',
    
    // สิ่งอำนวยความสะดวก
    facilities: [],
    
    // สิ่งอำนวยความสะดวกภายในห้อง (Amenities)
    amenities: [],
    
    // สื่อ
    video_review: '',
    official_website: '',
    
    // รูปภาพ
    cover_image: null,
    project_images: []
  });

  const [facilitiesList, setFacilitiesList] = useState([
    // Transport
    { id: 'passengerLift', label: 'Passenger Lift', category: 'transport', icon: 'lift' },
    { id: 'privateLift', label: 'Private Lift', category: 'transport', icon: 'private-lift' },
    { id: 'parking', label: 'Parking', category: 'transport', icon: 'parking' },
    { id: 'motorcycleParking', label: 'Motorcycle Parking', category: 'transport', icon: 'motorcycle' },
    { id: 'shuttleService', label: 'Shuttle Service', category: 'transport', icon: 'shuttle' },
    { id: 'evCharger', label: 'EV Charger', category: 'transport', icon: 'ev-charger' },
    
    // Security
    { id: 'security24h', label: '24-hour security with CCTV', category: 'security', icon: 'cctv' },
    { id: 'accessControl', label: 'Access control (Fingerprint / Keycard)', category: 'security', icon: 'access-control' },
    
    // Recreation
    { id: 'fitness', label: 'Fitness / Gym', category: 'recreation', icon: 'gym' },
    { id: 'swimmingPool', label: 'Swimming Pool', category: 'recreation', icon: 'pool' },
    { id: 'privatePool', label: 'Private Pool', category: 'recreation', icon: 'private-pool' },
    { id: 'sauna', label: 'Sauna', category: 'recreation', icon: 'sauna' },
    { id: 'steamRoom', label: 'Steam Room', category: 'recreation', icon: 'steam' },
    { id: 'jacuzzi', label: 'Jacuzzi', category: 'recreation', icon: 'jacuzzi' },
    { id: 'sportArea', label: 'Sport Area', category: 'recreation', icon: 'sport' },
    { id: 'golfSimulator', label: 'Golf simulator', category: 'recreation', icon: 'golf' },
    { id: 'stadium', label: 'Stadium', category: 'recreation', icon: 'stadium' },
    { id: 'kidsPlayground', label: 'Kids Playground', category: 'recreation', icon: 'playground' },
    { id: 'cinemaRoom', label: 'Cinema Room / Theatre', category: 'recreation', icon: 'cinema' },
    
    // Pet & Business
    { id: 'allowPet', label: 'Allow Pet', category: 'business', icon: 'pet' },
    { id: 'meetingRoom', label: 'Meeting Room', category: 'business', icon: 'meeting' },
    { id: 'coWorkingSpace', label: 'Co-Working Space', category: 'business', icon: 'coworking' },
    
    // Dining
    { id: 'restaurant', label: 'Restaurant', category: 'dining', icon: 'restaurant' },
    { id: 'cafe', label: 'Cafe', category: 'dining', icon: 'cafe' },
    { id: 'privateDiningRoom', label: 'Private Dining Room / Party Room', category: 'dining', icon: 'dining-room' },
    { id: 'coKitchen', label: 'Co-Kitchen', category: 'dining', icon: 'kitchen' },
    
    // Common
    { id: 'lobby', label: 'Lobby', category: 'common', icon: 'lobby' },
    { id: 'loungeArea', label: 'Lounge Area', category: 'common', icon: 'lounge' },
    { id: 'clubhouse', label: 'Clubhouse', category: 'common', icon: 'clubhouse' },
    { id: 'convenienceStore', label: 'Convenience Store / Minimart', category: 'common', icon: 'store' },
    { id: 'library', label: 'Library', category: 'common', icon: 'library' },
    { id: 'laundry', label: 'Laundry', category: 'common', icon: 'laundry' },
    { id: 'garden', label: 'Garden', category: 'environment', icon: 'garden' },
    { id: 'wifi', label: 'WIFI', category: 'environment', icon: 'wifi' }
  ]);

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // รายการสิ่งอำนวยความสะดวกภายในห้อง (Amenities)
  const [amenitiesList] = useState([
    { id: 'fullyFurnished', label: 'Fully Furnished', category: 'furniture', icon: 'furniture' },
    { id: 'airConditioner', label: 'Air Conditioner', category: 'appliance', icon: 'ac' },
    { id: 'television', label: 'Television', category: 'appliance', icon: 'tv' },
    { id: 'refrigerator', label: 'Refrigerator', category: 'appliance', icon: 'fridge' },
    { id: 'microwave', label: 'Microwave', category: 'appliance', icon: 'microwave' },
    { id: 'electricStove', label: 'Electric Stove', category: 'appliance', icon: 'stove' },
    { id: 'rangeHood', label: 'Range Hood', category: 'appliance', icon: 'hood' },
    { id: 'washingMachine', label: 'Washing Machine', category: 'appliance', icon: 'washing' },
    { id: 'waterHeater', label: 'Water Heater', category: 'appliance', icon: 'heater' },
    { id: 'oven', label: 'Oven', category: 'appliance', icon: 'oven' },
    { id: 'bathtub', label: 'Bathtub', category: 'bathroom', icon: 'bathtub' },
    { id: 'digitalDoorLock', label: 'Digital Door Lock', category: 'security', icon: 'lock' },
    { id: 'internetWifi', label: 'Internet / Wi-Fi', category: 'technology', icon: 'wifi' },
    { id: 'garage', label: 'Garage', category: 'parking', icon: 'garage' },
    { id: 'smartHomeSystem', label: 'Smart Home System', category: 'technology', icon: 'smart' },
    { id: 'jacuzzi', label: 'Jacuzzi', category: 'luxury', icon: 'jacuzzi' },
    { id: 'parking', label: 'Parking', category: 'parking', icon: 'parking' },
    { id: 'balcony', label: 'Balcony', category: 'structure', icon: 'balcony' },
    { id: 'dishwasher', label: 'Dishwasher', category: 'appliance', icon: 'dishwasher' },
    { id: 'walkInCloset', label: 'Walk-in Closet', category: 'storage', icon: 'closet' },
    { id: 'privateElevator', label: 'Private Elevator', category: 'luxury', icon: 'elevator' },
    { id: 'privatePool', label: 'Private Pool', category: 'luxury', icon: 'pool' },
    { id: 'waterFiltration', label: 'Water Filtration System', category: 'utility', icon: 'filter' },
    { id: 'privateGarden', label: 'Private Garden', category: 'outdoor', icon: 'garden' },
    { id: 'wineCooler', label: 'Wine Cooler / Wine Cellar', category: 'luxury', icon: 'wine' },
    { id: 'builtInWardrobe', label: 'Built-in Wardrobe', category: 'storage', icon: 'wardrobe' }
  ]);

  // ฟังก์ชันสำหรับแสดง React Icons
  const getFacilityIcon = (iconName) => {
    const iconMap = {
      // Transport
      'lift': <FaArrowUp className="w-5 h-5" />,
      'private-lift': <FaLock className="w-5 h-5" />,
      'parking': <FaCar className="w-5 h-5" />,
      'motorcycle': <FaMotorcycle className="w-5 h-5" />,
      'shuttle': <FaShuttleVan className="w-5 h-5" />,
      'ev-charger': <FaBolt className="w-5 h-5" />,
      
      // Security
      'cctv': <FaVideo className="w-5 h-5" />,
      'access-control': <FaLock className="w-5 h-5" />,
      
      // Recreation
      'gym': <FaDumbbell className="w-5 h-5" />,
      'pool': <FaSwimmingPool className="w-5 h-5" />,
      'private-pool': <FaBath className="w-5 h-5" />,
      'sauna': <FaBath className="w-5 h-5" />,
      'steam': <FaBath className="w-5 h-5" />,
      'jacuzzi': <FaBath className="w-5 h-5" />,
      'sport': <FaFutbol className="w-5 h-5" />,
      'golf': <FaTrophy className="w-5 h-5" />,
      'stadium': <FaTrophy className="w-5 h-5" />,
      'playground': <FaChild className="w-5 h-5" />,
      'cinema': <FaFilm className="w-5 h-5" />,
      
      // Pet & Business
      'pet': <FaPaw className="w-5 h-5" />,
      'meeting': <FaUsers className="w-5 h-5" />,
      'coworking': <FaLaptop className="w-5 h-5" />,
      
      // Dining
      'restaurant': <FaHamburger className="w-5 h-5" />,
      'cafe': <FaCoffee className="w-5 h-5" />,
      'dining-room': <FaCoffee className="w-5 h-5" />,
      'kitchen': <FaUtensils className="w-5 h-5" />,
      
      // Common
      'lobby': <FaDoorOpen className="w-5 h-5" />,
      'lounge': <FaCouch className="w-5 h-5" />,
      'clubhouse': <FaHome className="w-5 h-5" />,
      'store': <FaStore className="w-5 h-5" />,
      'library': <FaBook className="w-5 h-5" />,
      'laundry': <FaTshirt className="w-5 h-5" />,
      'garden': <FaSeedling className="w-5 h-5" />,
      'wifi': <FaWifi className="w-5 h-5" />,
      
      // Amenities (more accurate icons)
      'furniture': <FaCouch className="w-5 h-5" />,                 // Fully Furnished
      'ac': <TbAirConditioning className="w-5 h-5" />,               // Air Conditioner
      'tv': <FaTv className="w-5 h-5" />,                            // Television
      'fridge': <MdKitchen className="w-5 h-5" />,                   // Refrigerator
      'microwave': <MdMicrowave className="w-5 h-5" />,              // Microwave
      'stove': <PiCookingPot className="w-5 h-5" />,                 // Electric Stove
      'hood': <LuFan className="w-5 h-5" />,                         // Range Hood
      'washing': <MdLocalLaundryService className="w-5 h-5" />,      // Washing Machine
      'heater': <PiThermometerHot className="w-5 h-5" />,           // Water Heater
      'oven': <PiOven className="w-5 h-5" />,                        // Oven
      'bathtub': <FaBath className="w-5 h-5" />,                     // Bathtub
      'lock': <FaLock className="w-5 h-5" />,                        // Digital Door Lock
      'garage': <FaCar className="w-5 h-5" />,                       // Garage
      'smart': <RiHomeWifiLine className="w-5 h-5" />,               // Smart Home System
      'jacuzzi': <MdHotTub className="w-5 h-5" />,                   // Jacuzzi
      'parking': <FaCar className="w-5 h-5" />,                      // Parking
      'balcony': <MdBalcony className="w-5 h-5" />,                  // Balcony
      'dishwasher': <FaUtensils className="w-5 h-5" />,              // Dishwasher
      'closet': <MdCheckroom className="w-5 h-5" />,                 // Walk-in Closet
      'elevator': <MdElevator className="w-5 h-5" />,                // Private Elevator
      'filter': <RiFilterLine className="w-5 h-5" />,                // Water Filtration System
      'garden': <FaSeedling className="w-5 h-5" />,                  // Private Garden
      'wine': <FaWineBottle className="w-5 h-5" />,                  // Wine Cooler / Cellar
      'wardrobe': <MdCheckroom className="w-5 h-5" />                // Built-in Wardrobe
    };
    
    return iconMap[iconName] || <FaBuilding className="w-5 h-5" />;
  };

  // โหลดข้อมูล project ถ้ามี
  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        project_images: project.project_images || [],
        cover_image: project.cover_image || null,
        facilities: project.facilities || [],
        amenities: project.amenities || []
      });
      
      // จัดการ facilities
      let projectFacilities = project.facilities;
      
      // ตรวจสอบว่า facilities เป็น string (JSON) หรือไม่
      if (typeof projectFacilities === 'string') {
        try {
          projectFacilities = JSON.parse(projectFacilities);
        } catch (e) {
          projectFacilities = [];
        }
      }
      
      // ตั้งค่า selected facilities
      if (projectFacilities && Array.isArray(projectFacilities)) {
        setSelectedFacilities(projectFacilities);
      } else {
        setSelectedFacilities([]);
      }

      // จัดการ amenities
      let projectAmenities = project.amenities;
      
      // ตรวจสอบว่า amenities เป็น string (JSON) หรือไม่
      if (typeof projectAmenities === 'string') {
        try {
          projectAmenities = JSON.parse(projectAmenities);
        } catch (e) {
          projectAmenities = [];
        }
      }
      
      // ตั้งค่า selected amenities
      if (projectAmenities && Array.isArray(projectAmenities)) {
        setSelectedAmenities(projectAmenities);
      } else {
        setSelectedAmenities([]);
      }
    }
  }, [project]);

  // อัปเดต formData.facilities เมื่อ selectedFacilities เปลี่ยน
  useEffect(() => {
    if (selectedFacilities && Array.isArray(selectedFacilities)) {
      setFormData(prev => ({
        ...prev,
        facilities: selectedFacilities
      }));
    }
  }, [selectedFacilities]);

  // อัปเดต formData.amenities เมื่อ selectedAmenities เปลี่ยน
  useEffect(() => {
    if (selectedAmenities && Array.isArray(selectedAmenities)) {
      setFormData(prev => ({
        ...prev,
        amenities: selectedAmenities
      }));
    }
  }, [selectedAmenities]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFacilityToggle = (facilityId) => {
    setSelectedFacilities(prev => {
      const currentFacilities = prev && Array.isArray(prev) ? prev : [];
      
      if (currentFacilities.includes(facilityId)) {
        return currentFacilities.filter(id => id !== facilityId);
      } else {
        return [...currentFacilities, facilityId];
      }
    });
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities(prev => {
      const currentAmenities = prev && Array.isArray(prev) ? prev : [];
      
      if (currentAmenities.includes(amenityId)) {
        return currentAmenities.filter(id => id !== amenityId);
      } else {
        return [...currentAmenities, amenityId];
      }
    });
  };

  // File upload handlers
  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cover_image: file
      }));
    }
  };

  const handleProjectImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 100) {
      Swal.fire({
        title: 'รูปภาพเกินจำนวนที่กำหนด',
        text: 'อัปโหลดรูปภาพได้ไม่เกิน 100 รูป',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
      return;
    }
    setFormData(prev => ({
      ...prev,
      project_images: [...(prev.project_images || []), ...files]
    }));
  };

  const removeProjectImage = (index) => {
    Swal.fire({
      title: 'ลบรูปภาพ',
      text: `คุณต้องการลบรูปภาพที่ ${index + 1} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(prev => ({
          ...prev,
          project_images: (prev.project_images || []).filter((_, i) => i !== index)
        }));
      }
    });
  };

  const removeCoverImage = () => {
    Swal.fire({
      title: 'ลบรูปปก',
      text: 'คุณต้องการลบรูปปกหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(prev => ({
          ...prev,
          cover_image: null
        }));
      }
    });
  };

  const removeAllProjectImages = () => {
    Swal.fire({
      title: 'ลบรูปภาพทั้งหมด',
      text: 'คุณต้องการลบรูปภาพโครงการทั้งหมดหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(prev => ({
          ...prev,
          project_images: []
        }));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // สร้าง FormData สำหรับส่งรูปภาพ
    const formDataToSend = new FormData();
    
    // เพิ่มข้อมูลพื้นฐาน
    formDataToSend.append('name_th', formData.name_th);
    formDataToSend.append('name_en', formData.name_en || '');
    formDataToSend.append('project_type', formData.project_type);
    formDataToSend.append('developer', formData.developer);
    formDataToSend.append('completion_year', formData.completion_year || '');
    formDataToSend.append('status', formData.status || 'active');
    formDataToSend.append('area_range', formData.area_range || '');
    formDataToSend.append('total_units', formData.total_units || '');
    formDataToSend.append('total_buildings', formData.total_buildings || '');
    formDataToSend.append('floors_info', formData.floors_info || '');
    formDataToSend.append('nearby_bts', formData.nearby_bts || '');
    formDataToSend.append('address', formData.address || '');
    formDataToSend.append('district', formData.district || '');
    formDataToSend.append('province', formData.province || '');
    formDataToSend.append('postal_code', formData.postal_code || '');
    formDataToSend.append('google_map_embed', formData.google_map_embed || '');
    formDataToSend.append('location_highlights', formData.location_highlights || '');
    formDataToSend.append('video_review', formData.video_review || '');
    formDataToSend.append('official_website', formData.official_website || '');
    
    // เพิ่ม facilities
    if (selectedFacilities && Array.isArray(selectedFacilities) && selectedFacilities.length > 0) {
      selectedFacilities.forEach(facility => {
        formDataToSend.append('facilities', facility);
      });
    } else {
      // ส่ง array ว่างถ้าไม่มี facilities
      formDataToSend.append('facilities', '[]');
    }

    // เพิ่ม amenities
    if (selectedAmenities && Array.isArray(selectedAmenities) && selectedAmenities.length > 0) {
      selectedAmenities.forEach(amenity => {
        formDataToSend.append('amenities', amenity);
      });
    } else {
      // ส่ง array ว่างถ้าไม่มี amenities
      formDataToSend.append('amenities', '[]');
    }
    
    // เพิ่มรูปปก (ถ้ามี)
    if (formData.cover_image) {
      formDataToSend.append('cover_image', formData.cover_image);
    }
    
    // เพิ่มรูปภาพโครงการ (ถ้ามี)
    if (formData.project_images && formData.project_images.length > 0) {
      formData.project_images.forEach((image, index) => {
        formDataToSend.append('project_images', image);
      });
    }
    
    // เพิ่มรูปภาพเดิม (ถ้ามี) เพื่อให้ API รู้ว่าต้องเก็บไว้
    if (project && project.project_images && project.project_images.length > 0) {
      project.project_images.forEach((image, index) => {
        formDataToSend.append('existing_project_images', JSON.stringify(image));
      });
    }
    

    
    // แสดง SweetAlert2 สำหรับข้อมูลที่จะส่ง
    Swal.fire({
      title: 'กำลังส่งข้อมูลโครงการ...',
      html: `
        <div class="text-left">
          <p><strong>ชื่อโครงการ:</strong> ${formData.name_th}</p>
          <p><strong>ประเภท:</strong> ${formData.project_type}</p>
          <p><strong>ผู้พัฒนา:</strong> ${formData.developer}</p>
          <p><strong>รูปปก:</strong> ${formData.cover_image ? 'มี' : 'ไม่มี'}</p>
          <p><strong>รูปภาพโครงการ:</strong> ${formData.project_images ? formData.project_images.length : 0} รูป</p>
          <p><strong>สิ่งอำนวยความสะดวก:</strong> ${selectedFacilities && Array.isArray(selectedFacilities) ? selectedFacilities.length : 0} รายการ</p>
        </div>
      `,
      icon: 'info',
      showConfirmButton: true,
      confirmButtonText: 'ส่งข้อมูล',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        // ส่งข้อมูลไปยัง API
        onSubmit(formDataToSend);
      }
    });
  };

  const projectTypes = [
    'คอนโดมิเนียม',
    'บ้านเดี่ยว',
    'ทาวน์โฮม',
    'วิลล่า',
    'อพาร์ตเมนท์',
    'โรงแรม',
    'สำนักงาน',
    'ร้านค้า',
    'อื่นๆ'
  ];

  const projectStatuses = [
    'กำลังก่อสร้าง',
    'พร้อมอยู่',
    'Pre-sale',
    'เปิดจอง',
    'ขายแล้วเสร็จ'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {project ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ข้อมูลพื้นฐาน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name_th">ชื่อโครงการ (ภาษาไทย) *</Label>
                <Input
                  id="name_th"
                  value={formData.name_th}
                  onChange={(e) => handleInputChange('name_th', e.target.value)}
                  placeholder="ชื่อโครงการภาษาไทย"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name_en">ชื่อโครงการ (ภาษาอังกฤษ)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  placeholder="Project Name in English"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project_type">ประเภทโครงการ *</Label>
                <select
                  id="project_type"
                  value={formData.project_type}
                  onChange={(e) => handleInputChange('project_type', e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">เลือกประเภทโครงการ</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="developer">เจ้าของโครงการ / ผู้พัฒนา *</Label>
                <Input
                  id="developer"
                  value={formData.developer}
                  onChange={(e) => handleInputChange('developer', e.target.value)}
                  placeholder="ชื่อบริษัทผู้พัฒนา"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="completion_year">ปีที่สร้างแล้วเสร็จ</Label>
                <Input
                  id="completion_year"
                  type="number"
                  value={formData.completion_year}
                  onChange={(e) => handleInputChange('completion_year', e.target.value)}
                  placeholder="2024"
                  min="1900"
                  max="2100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">สถานะโครงการ *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">เลือกสถานะโครงการ</option>
                  {projectStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ขนาดและจำนวน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="area_range">ขนาดพื้นที่ใช้สอย</Label>
                <Input
                  id="area_range"
                  value={formData.area_range}
                  onChange={(e) => handleInputChange('area_range', e.target.value)}
                  placeholder="25-255 ตารางเมตร"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total_units">จำนวนยูนิตทั้งหมด</Label>
                <Input
                  id="total_units"
                  type="number"
                  value={formData.total_units}
                  onChange={(e) => handleInputChange('total_units', e.target.value)}
                  placeholder="500"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="total_buildings">จำนวนอาคาร</Label>
                <Input
                  id="total_buildings"
                  type="number"
                  value={formData.total_buildings}
                  onChange={(e) => handleInputChange('total_buildings', e.target.value)}
                  placeholder="3"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="floors_info">จำนวนชั้น (รายละเอียด)</Label>
                <Textarea
                  id="floors_info"
                  value={formData.floors_info}
                  onChange={(e) => handleInputChange('floors_info', e.target.value)}
                  placeholder="Tower A: 30 ชั้น, Tower B: 35 ชั้น"
                  rows={3}
                />
              </div>
            </div>

            {/* ที่ตั้ง */}
            <div className="space-y-2">
              <Label htmlFor="nearby_bts">ที่ตั้งรถไฟฟ้า</Label>
              <Input
                id="nearby_bts"
                value={formData.nearby_bts}
                onChange={(e) => handleInputChange('nearby_bts', e.target.value)}
                placeholder="BTS อโศก, MRT สุขุมวิท"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="district">เขต</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="วัฒนา"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  placeholder="กรุงเทพมหานคร"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postal_code">รหัสไปรษณีย์</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="10110"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">ที่อยู่เต็ม *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="ที่อยู่เต็มของโครงการ"
                rows={3}
                required
              />
            </div>

            {/* Google Maps Link */}
            <div className="space-y-2">
              <Label htmlFor="google_map_embed">ลิงก์ Google Maps</Label>
              <Input
                id="google_map_embed"
                type="url"
                value={formData.google_map_embed}
                onChange={(e) => handleInputChange('google_map_embed', e.target.value)}
                placeholder="https://www.google.com/maps/search/?api=1&query=..."
                className="font-mono text-sm"
              />
              <div className="flex items-start space-x-2 text-sm text-gray-500">
                <span className="text-blue-600">💡</span>
                <div>
                  <p className="font-medium">วิธีสร้างลิงก์ Google Maps:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1 text-xs">
                    <li>ไปที่ Google Maps และค้นหาที่อยู่โครงการ</li>
                    <li>คลิกปุ่ม "Share" หรือ "แชร์"</li>
                    <li>เลือก "Copy link" หรือ "คัดลอกลิงก์"</li>
                    <li>วางลิงก์ในช่องด้านบน</li>
                  </ol>
                  <p className="mt-2 text-xs">
                    <strong>ตัวอย่าง:</strong> https://www.google.com/maps/search/?api=1&query=บุรษิริ+พญานากา
                  </p>
                </div>
              </div>
            </div>

            {/* จุดเด่นทำเล */}
            <div className="space-y-2">
              <Label htmlFor="location_highlights">จุดเด่นทำเล</Label>
              <Textarea
                id="location_highlights"
                value={formData.location_highlights}
                onChange={(e) => handleInputChange('location_highlights', e.target.value)}
                placeholder="ใกล้อะไรบ้าง เช่น ห้าง, โรงเรียน, โรงพยาบาล"
                rows={3}
              />
            </div>

            {/* สิ่งอำนวยความสะดวก - แบบ Card Selection */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaBuilding className="w-4 h-4 text-blue-600" />
                </div>
                <Label className="text-lg font-semibold">สิ่งอำนวยความสะดวกในโครงการ</Label>
              </div>
              
              {/* แสดง facilities ที่เลือกแล้ว */}
              {selectedFacilities && Array.isArray(selectedFacilities) && selectedFacilities.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-green-800">
                        ✅ สิ่งอำนวยความสะดวกที่เลือกแล้ว ({selectedFacilities && Array.isArray(selectedFacilities) ? selectedFacilities.length : 0} รายการ)
                      </h3>
                      <p className="text-sm text-green-600 mt-1">
                        คลิกเพื่อยกเลิกการเลือก
                      </p>
                    </div>
                  </div>

                  
                  {/* Selected Facilities Display */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedFacilities && Array.isArray(selectedFacilities) && selectedFacilities.map(facilityId => {
                      const facility = facilitiesList && Array.isArray(facilitiesList) ? facilitiesList.find(f => f.id === facilityId) : null;
                      
                      if (!facility) {
                        return null;
                      }
                      
                      return (
                        <div
                          key={facilityId}
                          className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-green-200 transition-colors"
                          onClick={() => handleFacilityToggle(facilityId)}
                        >
                          <div className="p-1 rounded-full bg-green-200">
                            {getFacilityIcon(facility.icon)}
                          </div>
                          <span className="text-xs">{facility.label}</span>
                          <span className="text-green-500 hover:text-green-700">×</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* All facilities for selection */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
                  <span className="mr-2">📋</span>
                  เลือกสิ่งอำนวยความสะดวกทั้งหมด ({facilitiesList && Array.isArray(facilitiesList) ? facilitiesList.length : 0} รายการ)
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {facilitiesList && Array.isArray(facilitiesList) && facilitiesList.map(facility => {
                    const isSelected = selectedFacilities && Array.isArray(selectedFacilities) && selectedFacilities.includes(facility.id)
                    
                    return (
                      <div
                        key={facility.id}
                        onClick={() => handleFacilityToggle(facility.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`p-2 rounded-full transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                            <div className="w-5 h-5">
                              {getFacilityIcon(facility.icon)}
                            </div>
                          </div>
                          <span className={`text-xs font-medium ${
                            isSelected ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {facility.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* สิ่งอำนวยความสะดวกภายในห้อง (Amenities) */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaCouch className="w-4 h-4 text-purple-600" />
                </div>
                <Label className="text-lg font-semibold">สิ่งอำนวยความสะดวกภายในห้อง (Amenities)</Label>
              </div>
              
              {/* แสดง amenities ที่เลือกแล้ว */}
              {selectedAmenities && Array.isArray(selectedAmenities) && selectedAmenities.length > 0 && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-purple-800">
                        ✅ สิ่งอำนวยความสะดวกที่เลือกแล้ว ({selectedAmenities && Array.isArray(selectedAmenities) ? selectedAmenities.length : 0} รายการ)
                      </h3>
                      <p className="text-sm text-purple-600 mt-1">
                        คลิกเพื่อยกเลิกการเลือก
                      </p>
                    </div>
                  </div>

                  {/* Selected Amenities Display */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedAmenities && Array.isArray(selectedAmenities) && selectedAmenities.map(amenityId => {
                      const amenity = amenitiesList && Array.isArray(amenitiesList) ? amenitiesList.find(a => a.id === amenityId) : null;
                      
                      if (!amenity) {
                        return null;
                      }
                      
                      return (
                        <div
                          key={amenityId}
                          className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-200 transition-colors"
                          onClick={() => handleAmenityToggle(amenityId)}
                        >
                          <div className="p-1 rounded-full bg-purple-200">
                            {getFacilityIcon(amenity.icon)}
                          </div>
                          <span className="text-xs">{amenity.label}</span>
                          <span className="text-purple-500 hover:text-purple-700">×</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* All amenities for selection */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700 flex items-center">
                  <span className="mr-2">🏠</span>
                  เลือกสิ่งอำนวยความสะดวกภายในห้อง ({amenitiesList && Array.isArray(amenitiesList) ? amenitiesList.length : 0} รายการ)
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenitiesList && Array.isArray(amenitiesList) && amenitiesList.map(amenity => {
                    const isSelected = selectedAmenities && Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity.id)
                    
                    return (
                      <div
                        key={amenity.id}
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`p-2 rounded-full transition-all duration-200 ${
                            isSelected 
                              ? 'bg-purple-100 text-purple-600' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                            <div className="w-5 h-5">
                              {getFacilityIcon(amenity.icon)}
                            </div>
                          </div>
                          <span className={`text-xs font-medium ${
                            isSelected ? 'text-purple-700' : 'text-gray-700'
                          }`}>
                            {amenity.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* สื่อ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="video_review">วิดีโอรีวิวโครงการ (YouTube)</Label>
                <Input
                  id="video_review"
                  value={formData.video_review}
                  onChange={(e) => handleInputChange('video_review', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="official_website">เว็บไซต์อย่างเป็นทางการ</Label>
                <Input
                  id="official_website"
                  value={formData.official_website}
                  onChange={(e) => handleInputChange('official_website', e.target.value)}
                  placeholder="https://www.project-official.com"
                />
              </div>
            </div>

            {/* รูปภาพ - อัปโหลดไฟล์ */}
            <div className="space-y-6">
              {/* รูปปกโครงการ */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Label htmlFor="cover_image" className="text-base font-medium">รูปปกโครงการ</Label>
                </div>
                
                <div className="relative">
                  <input
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover_image"
                    className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <p>ลากไฟล์มาที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                        <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG, GIF</p>
                      </div>
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        เลือกรูปปกโครงการ
                      </Button>
                    </div>
                  </label>
                </div>
                
                {/* แสดงรูปปกที่เลือก */}
                {(formData.cover_image || (project && project.cover_image)) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-blue-700 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                        รูปปกที่เลือก
                      </p>
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบรูปปก
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={formData.cover_image && formData.cover_image instanceof File ? URL.createObjectURL(formData.cover_image) : (project && project.cover_image ? project.cover_image : '')}
                          alt="รูปปกโครงการ"
                          className="w-28 h-28 object-cover rounded-lg border-2 border-blue-200 shadow-sm"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                          ปก
                        </div>
                      </div>
                      <div className="flex-1">
                        {formData.cover_image && formData.cover_image instanceof File ? (
                          <>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {formData.cover_image.name}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{(formData.cover_image.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span>{formData.cover_image.type.split('/')[1]?.toUpperCase()}</span>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            รูปปกที่มีอยู่เดิม
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* รูปภาพโครงการ */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <Label htmlFor="project_images" className="text-base font-medium">รูปภาพโครงการ (ไม่เกิน 100 รูป)</Label>
                </div>
                
                <div className="relative">
                  <input
                    id="project_images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProjectImagesUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="project_images"
                    className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <p>ลากไฟล์มาที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                        <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG, GIF (สูงสุด 100 รูป)</p>
                      </div>
                      <Button type="button" className="bg-green-600 hover:bg-green-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        เลือกรูปภาพเพิ่มเติม
                      </Button>
                    </div>
                  </label>
                </div>
                
                {/* แสดงรูปภาพที่เลือกพร้อมพรีวิว */}
                {(formData.project_images && formData.project_images.length > 0) || (project && project.project_images && project.project_images.length > 0) ? (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-700">
                          รูปภาพที่เลือก ({formData.project_images ? formData.project_images.length : 0} รูปใหม่ + {project && project.project_images ? project.project_images.length : 0} รูปเดิม)
                        </p>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {(formData.project_images ? formData.project_images.length : 0) + (project && project.project_images ? project.project_images.length : 0)}/100 รูป
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAllProjectImages}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบทั้งหมด
                      </button>
                    </div>

                    
                    {/* แสดงรูปภาพเดิม */}
                    {project && project.project_images && project.project_images.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">รูปภาพที่มีอยู่เดิม:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {project.project_images.map((image, index) => {
                            // Safety check สำหรับ image
                            if (!image) {
                              return null;
                            }
                            
                            const imageUrl = image.url || image;
                            if (!imageUrl) {
                              return null;
                            }
                            
                            return (
                              <div key={`existing-${index}`} className="relative group">
                                <div className="bg-white p-2 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                                  <div className="relative">
                                    <img
                                      src={imageUrl}
                                      alt={`รูปเดิมที่ ${index + 1}`}
                                      className="w-full h-24 object-cover rounded mb-2 border border-gray-100"
                                    />
                                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                      เดิม
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600 truncate mb-1">
                                      รูปเดิมที่ {index + 1}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      รูปภาพเดิม
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* แสดงรูปภาพใหม่ */}
                    {formData.project_images && formData.project_images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-3">รูปภาพใหม่ที่เพิ่ม:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {formData.project_images.map((file, index) => {
                            // Safety check สำหรับ file
                            if (!file || !(file instanceof File)) {
                              return null;
                            }
                            
                            return (
                              <div key={`new-${index}`} className="relative group">
                                <div className="bg-white p-2 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                                  <div className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`รูปใหม่ที่ ${index + 1}`}
                                      className="w-full h-24 object-cover rounded mb-2 border border-gray-100"
                                    />
                                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                                      ใหม่
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600 truncate mb-1" title={file.name}>
                                      {file.name || `รูปใหม่ที่ ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeProjectImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                  title="ลบรูปภาพ"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  Swal.fire({
                    title: 'ยกเลิกการดำเนินการ',
                    text: 'คุณต้องการยกเลิกการดำเนินการหรือไม่? ข้อมูลที่กรอกจะหายไป',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'ใช่, ยกเลิกเลย!',
                    cancelButtonText: 'ไม่, กลับไปกรอกข้อมูล'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      onCancel();
                    }
                  });
                }}
              >
                ยกเลิก
              </Button>
              <Button type="submit">
                {project ? 'อัปเดตโครงการ' : 'เพิ่มโครงการ'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectForm; 