import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { condoAPI, uploadAPI } from '../../lib/api'
import { projectApi } from '../../lib/projectApi'
import {
  ArrowLeft,
  Building,
  MapPin,
  FileText,
  Search,
  Star,
  Camera,
  Image,
  Upload,
  Plus,
  X,
  DollarSign,
  Calendar,
  Calculator,
  Bath,
  Bed,
  User
} from 'lucide-react'
// Additional icon packs for amenities
import { 
  FaTv, FaWineBottle, FaCouch, FaUtensils, FaSnowflake, FaBath, FaLock, FaWifi, FaCar, FaSwimmingPool, FaSeedling, FaTshirt,
  FaArrowUp, FaMotorcycle, FaShuttleVan, FaBolt, FaVideo, FaDumbbell, FaFutbol, FaTrophy, FaChild, FaFilm, FaPaw, FaUsers,
  FaLaptop, FaHamburger, FaCoffee, FaDoorOpen, FaHome, FaStore, FaBook, FaBuilding, FaGlobe, FaStar, FaFileAlt, FaWineGlassAlt
} from 'react-icons/fa'
import { MdKitchen, MdMicrowave, MdLocalLaundryService, MdHotTub, MdBalcony, MdCheckroom, MdElevator, MdOutlineWifiPassword } from 'react-icons/md'
import { RiHomeWifiLine, RiFilterLine, RiRemoteControlLine } from 'react-icons/ri'
import { PiCookingPot, PiThermometerHot, PiOven } from 'react-icons/pi'
import { TbAirConditioning, TbAlarmSmoke } from 'react-icons/tb'
import { LuFan, LuMicrowave } from 'react-icons/lu'
import { CgSmartHomeRefrigerator } from 'react-icons/cg'
import { GiWashingMachine, GiLockedDoor, GiHomeGarage } from 'react-icons/gi'
import { LiaBathSolid } from 'react-icons/lia'
import { BiCloset } from 'react-icons/bi'
import { IoIosWater } from 'react-icons/io'
import { ImLeaf } from 'react-icons/im'

const CondoForm = ({ condo = null, onBack, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    title: condo?.title || '', // ชื่อโครงการ
    projectCode: condo?.projectCode || '', // รหัสโครงการ (อัตโนมัติ)
    propertyType: condo?.propertyType || 'condo', // ประเภททรัพย์: คอนโด/อพาร์ตเมนท์
    status: condo?.status || 'sale', // สถานะ: ขาย/เช่า
    price: condo?.price?.toString() || '', // ราคา (บาท)
    rentPrice: condo?.rentPrice?.toString() || '', // ราคาเช่า (บาท/เดือน)
    announcerStatus: condo?.announcerStatus || 'agent', // สถานะผู้ประกาศ: เจ้าของ/นายหน้า
    
    // โลเคชั่น
    location: condo?.location || '', // สถานที่
    googleMapUrl: condo?.googleMapUrl || '', // Google Map URL
    nearbyTransport: condo?.nearbyTransport || '', // BTS/MRT/APL/SRT
    selectedStations: condo?.selectedStations || [], // สถานีรถไฟฟ้าที่เลือก
    
    // ประเภท
    listingType: condo?.listingType || 'sale', // ขาย/เช่า
    
    // รายละเอียด
    description: condo?.description || '',
    
    // ข้อมูลอสังหาริมทรัพย์
    area: condo?.area?.toString() || '', // พื้นที่ (ตารางเมตร)
    bedrooms: condo?.bedrooms?.toString() || '', // ห้องนอน
    bathrooms: condo?.bathrooms?.toString() || '', // ห้องน้ำ
    floor: condo?.floor || '', // ชั้นที่ (text สำหรับ duplex เช่น 17-18)
    pricePerSqm: condo?.pricePerSqm?.toString() || '', // ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
    rentPricePerSqm: condo?.rentPricePerSqm?.toString() || '', // ราคาเช่าต่อ ตร.ม. (คำนวณอัตโนมัติ)
    
    // SEO
    seoTags: condo?.seoTags || '',
    
    // โปรเจค
    selectedProject: condo?.selectedProject || '', // โปรเจคที่เลือก
    availableDate: condo?.availableDate || '', // วันที่ว่าง
    
    // สิ่งอำนวยความสะดวกภายในห้อง (Amenities)
    amenities: [],
    
    // Special Features
    specialFeatures: {
      shortTerm: condo?.specialFeatures?.shortTerm || false,
      allowPet: condo?.specialFeatures?.allowPet || false,
      allowCompanyRegistration: condo?.specialFeatures?.allowCompanyRegistration || false,
      foreignQuota: condo?.specialFeatures?.foreignQuota || false,
      penthouse: condo?.specialFeatures?.penthouse || false,
      luckyNumber: condo?.specialFeatures?.luckyNumber || false
    },
    
    // Media
    youtubeUrl: condo?.youtubeUrl || '', // ลิงก์ YouTube
    floorPlan: condo?.floorPlan || null, // ภาพแปลน
    
    // Timestamps
    createdAt: condo?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [coverImage, setCoverImage] = useState(null)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [selectedProjectInfo, setSelectedProjectInfo] = useState(null)
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState([])

  const [uploadProgress, setUploadProgress] = useState(0)
  const [apiStatus, setApiStatus] = useState('checking') // checking, online, offline

  // State สำหรับการค้นหาสถานี
  const [stationSearchTerm, setStationSearchTerm] = useState('');
  const [showStationDropdown, setShowStationDropdown] = useState(false);

  // ข้อมูลสถานีรถไฟฟ้า
  const btsStations = [
    { id: 'sukhumvit', name: 'สุขุมวิท', line: 'BTS' },
    { id: 'asok', name: 'อโศก', line: 'BTS' },
    { id: 'phrom_phong', name: 'พร้อมพงษ์', line: 'BTS' },
    { id: 'thong_lor', name: 'ทองหล่อ', line: 'BTS' },
    { id: 'ekkamai', name: 'เอกมัย', line: 'BTS' },
    { id: 'phra_khanong', name: 'พระโขนง', line: 'BTS' },
    { id: 'on_nut', name: 'อ่อนนุช', line: 'BTS' },
    { id: 'bang_chak', name: 'บางจาก', line: 'BTS' },
    { id: 'punnawithi', name: 'ปุณณวิถี', line: 'BTS' },
    { id: 'udom_suk', name: 'อุดมสุข', line: 'BTS' },
    { id: 'bang_na', name: 'บางนา', line: 'BTS' },
    { id: 'bearing', name: 'แบริ่ง', line: 'BTS' },
    { id: 'samrong', name: 'สำโรง', line: 'BTS' },
    { id: 'pu_chao', name: 'ปู่เจ้า', line: 'BTS' },
    { id: 'chang_erawan', name: 'ช้างเอราวัณ', line: 'BTS' },
    { id: 'royal_thai_naval_academy', name: 'โรงเรียนนายเรือ', line: 'BTS' },
    { id: 'pak_nam', name: 'ปากน้ำ', line: 'BTS' },
    { id: 'sri_utthaya', name: 'ศรีอุทัย', line: 'BTS' },
    { id: 'kheha', name: 'เคหะฯ', line: 'BTS' },
    { id: 'national_stadium', name: 'สนามกีฬาแห่งชาติ', line: 'BTS' },
    { id: 'ratchadamri', name: 'ราชดำริ', line: 'BTS' },
    { id: 'sala_daeng', name: 'ศาลาแดง', line: 'BTS' },
    { id: 'chong_nonsi', name: 'ช่องนนทรี', line: 'BTS' },
    { id: 'surasak', name: 'สุรศักดิ์', line: 'BTS' },
    { id: 'saphan_taksin', name: 'สะพานตากสิน', line: 'BTS' },
    { id: 'krung_thon_buri', name: 'กรุงธนบุรี', line: 'BTS' },
    { id: 'wongwian_yai', name: 'วงเวียนใหญ่', line: 'BTS' },
    { id: 'pho_nimit', name: 'โพธิ์นิมิตร', line: 'BTS' },
    { id: 'talat_phlu', name: 'ตลาดพลู', line: 'BTS' },
    { id: 'wutthakat', name: 'วุฒากาศ', line: 'BTS' },
    { id: 'bang_wa', name: 'บางหว้า', line: 'BTS' },
    { id: 'siam', name: 'สยาม', line: 'BTS' },
    { id: 'chit_lom', name: 'ชิดลม', line: 'BTS' },
    { id: 'ploen_chit', name: 'เพลินจิต', line: 'BTS' },
    { id: 'nana', name: 'นานา', line: 'BTS' }
  ];

  const mrtStations = [
    { id: 'hua_lamphong', name: 'หัวลำโพง', line: 'MRT สีน้ำเงิน' },
    { id: 'sam_yan', name: 'สามย่าน', line: 'MRT สีน้ำเงิน' },
    { id: 'silom', name: 'สีลม', line: 'MRT สีน้ำเงิน' },
    { id: 'lumphini', name: 'ลุมพินี', line: 'MRT สีน้ำเงิน' },
    { id: 'klong_toei', name: 'คลองเตย', line: 'MRT สีน้ำเงิน' },
    { id: 'queen_sirikit_national_convention_center', name: 'ศูนย์การประชุมแห่งชาติสิริกิติ์', line: 'MRT สีน้ำเงิน' },
    { id: 'sukhumvit', name: 'สุขุมวิท', line: 'MRT สีน้ำเงิน' },
    { id: 'phetchaburi', name: 'เพชรบุรี', line: 'MRT สีน้ำเงิน' },
    { id: 'phra_ram_9', name: 'พระราม 9', line: 'MRT สีน้ำเงิน' },
    { id: 'thailand_cultural_center', name: 'ศูนย์วัฒนธรรมแห่งประเทศไทย', line: 'MRT สีน้ำเงิน' },
    { id: 'huai_kwang', name: 'ห้วยขวาง', line: 'MRT สีน้ำเงิน' },
    { id: 'sutthisan', name: 'สุทธิสาร', line: 'MRT สีน้ำเงิน' },
    { id: 'ratchadaphisek', name: 'รัชดาภิเษก', line: 'MRT สีน้ำเงิน' },
    { id: 'lat_phrao', name: 'ลาดพร้าว', line: 'MRT สีน้ำเงิน' },
    { id: 'phahon_yothin', name: 'พหลโยธิน', line: 'MRT สีน้ำเงิน' },
    { id: 'chatuchak_park', name: 'สวนจตุจักร', line: 'MRT สีน้ำเงิน' },
    { id: 'kamphaeng_phet', name: 'กำแพงเพชร', line: 'MRT สีน้ำเงิน' },
    { id: 'bang_sue', name: 'บางซื่อ', line: 'MRT สีน้ำเงิน' },
    { id: 'tao_poon', name: 'เตาปูน', line: 'MRT สีน้ำเงิน' }
  ];

  const arlStations = [
    { id: 'phaya_thai', name: 'พญาไท', line: 'ARL' },
    { id: 'ratchaprarop', name: 'ราชปรารภ', line: 'ARL' },
    { id: 'makkasan', name: 'มักกะสัน', line: 'ARL' },
    { id: 'ramkhamhaeng', name: 'รามคำแหง', line: 'ARL' },
    { id: 'huamark', name: 'หัวหมาก', line: 'ARL' },
    { id: 'ban_thap_chang', name: 'บ้านทับช้าง', line: 'ARL' },
    { id: 'lat_krabang', name: 'ลาดกระบัง', line: 'ARL' },
    { id: 'suvarnabhumi', name: 'สุวรรณภูมิ', line: 'ARL' }
  ];

  const srtStations = [
    { id: 'bang_sue_srt', name: 'บางซื่อ', line: 'SRT' },
    { id: 'bang_son', name: 'บางซอน', line: 'SRT' },
    { id: 'bang_phlat', name: 'บางพลัด', line: 'SRT' },
    { id: 'bang_oi', name: 'บางอ้อ', line: 'SRT' },
    { id: 'bang_yi_khan', name: 'บางยี่ขัน', line: 'SRT' },
    { id: 'bang_kruai', name: 'บางกรวย', line: 'SRT' },
    { id: 'bang_yai', name: 'บางใหญ่', line: 'SRT' },
    { id: 'bang_phai', name: 'บางไผ่', line: 'SRT' },
    { id: 'bang_rakam', name: 'บางระกำ', line: 'SRT' },
    { id: 'bang_rak_noi', name: 'บางรักน้อย', line: 'SRT' }
  ];

  // ฟังก์ชันจัดการการเลือกสถานี
  const handleStationToggle = (stationId) => {
    setFormData(prev => {
      const currentStations = prev.selectedStations && Array.isArray(prev.selectedStations) ? prev.selectedStations : [];
      
      if (currentStations.includes(stationId)) {
        return {
          ...prev,
          selectedStations: currentStations.filter(id => id !== stationId)
        };
      } else {
        return {
          ...prev,
          selectedStations: [...currentStations, stationId]
        };
      }
    });
  };

  // ฟังก์ชันตรวจสอบสถานีที่เลือก
  const isStationSelected = (stationId) => {
    return formData.selectedStations && Array.isArray(formData.selectedStations) && formData.selectedStations.includes(stationId);
  };

  // ฟังก์ชันกรองสถานีตามคำค้นหา
  const filteredStations = () => {
    const allStations = [...btsStations, ...mrtStations, ...arlStations, ...srtStations];
    if (!stationSearchTerm) return allStations;
    
    return allStations.filter(station => 
      station.name.toLowerCase().includes(stationSearchTerm.toLowerCase()) ||
      station.line.toLowerCase().includes(stationSearchTerm.toLowerCase())
    );
  };

  // ฟังก์ชันเลือกสถานีจาก dropdown
  const handleStationSelect = (station) => {
    handleStationToggle(station.id);
    setStationSearchTerm('');
    setShowStationDropdown(false);
  };

  // ฟังก์ชันปิด dropdown เมื่อคลิกนอกช่องค้นหา
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.station-search-container')) {
        setShowStationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  ])

  // ฟังก์ชันสำหรับแสดง React Icons
  const getFacilityIcon = (iconName) => {
    const iconMap = {
      // Transport
      'lift': <FaArrowUp className="w-5 h-5" />,
      'private-lift': <FaLock className="w-5 h-5" />,
      'parking-common': <FaCar className="w-5 h-5" />,
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
      'jacuzzi-common': <FaBath className="w-5 h-5" />,
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
      'garden-common': <FaSeedling className="w-5 h-5" />,
      'wifi': <MdOutlineWifiPassword className="w-5 h-5" />,
      
      // Amenities (updated icons as requested)
      'furniture': <img src="https://img.icons8.com/pulsar-line/48/furniture.png" alt="Fully Furnished" className="w-5 h-5" />,                 // Fully Furnished
      'ac': <TbAirConditioning className="w-5 h-5" />,               // Air Conditioner
      'tv': <img src="https://img.icons8.com/ios/50/tv.png" alt="Television" className="w-5 h-5" />,                            // Television
      'fridge': <CgSmartHomeRefrigerator className="w-5 h-5" />,     // Refrigerator
      'microwave': <LuMicrowave className="w-5 h-5" />,              // Microwave
      'stove': <img src="https://img.icons8.com/ios/50/electric-stovetop.png" alt="Electric Stove" className="w-5 h-5" />,                 // Electric Stove
      'hood': <TbAlarmSmoke className="w-5 h-5" />,                  // Range Hood
      'washing': <GiWashingMachine className="w-5 h-5" />,           // Washing Machine
      'heater': <img src="https://img.icons8.com/ios/50/water-heater.png" alt="Water Heater" className="w-5 h-5" />,           // Water Heater
      'oven': <PiOven className="w-5 h-5" />,                        // Oven
      'bathtub': <FaBath className="w-5 h-5" />,                     // Bathtub
      'lock': <GiLockedDoor className="w-5 h-5" />,                  // Digital Door Lock
      'garage': <GiHomeGarage className="w-5 h-5" />,                // Garage
      'smart': <RiRemoteControlLine className="w-5 h-5" />,          // Smart Home System
      'jacuzzi': <LiaBathSolid className="w-5 h-5" />,               // Jacuzzi
      'parking': <FaCar className="w-5 h-5" />,                      // Parking
      'balcony': <img src="https://img.icons8.com/ios-glyphs/30/balcony.png" alt="Balcony" className="w-5 h-5" />,                  // Balcony
      'dishwasher': <img src="https://img.icons8.com/windows/32/washing.png" alt="Dishwasher" className="w-5 h-5" />,              // Dishwasher
      'closet': <BiCloset className="w-5 h-5" />,                    // Walk-in Closet
      'elevator': <img src="https://img.icons8.com/serif/32/elevator-doors.png" alt="Private Elevator" className="w-5 h-5" />,                // Private Elevator
      'filter': <IoIosWater className="w-5 h-5" />,                  // Water Filtration System
      'garden': <ImLeaf className="w-5 h-5" />,                      // Private Garden
      'wine': <FaWineGlassAlt className="w-5 h-5" />,                // Wine Cooler / Cellar
      'wardrobe': <img src="https://img.icons8.com/ios/50/wardrobe--v2.png" alt="Built-in Wardrobe" className="w-5 h-5" />                   // Built-in Wardrobe
    };
    
    return iconMap[iconName] || <FaBuilding className="w-5 h-5" />;
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

  const listingTypes = [
    { value: 'sale', label: 'ขาย', icon: DollarSign, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { value: 'rent', label: 'เช่า', icon: Calendar, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { value: 'both', label: 'ขายและเช่า', icon: Building, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' }
  ]

  // Prefill when editing: map API fields (snake_case) to form fields (camelCase) and images
  useEffect(() => {
    if (isEditing && condo) {
      console.log('🔍 Editing condo data:', condo)
      console.log('📅 Available date:', condo.available_date)
      console.log('⭐ Special features:', condo.special_features)
      console.log('⭐ Special features type:', typeof condo.special_features)
      console.log('⭐ Special features raw value:', JSON.stringify(condo.special_features))
      if (condo.special_features && typeof condo.special_features === 'string') {
        try {
          const parsed = JSON.parse(condo.special_features);
          console.log('⭐ Parsed special features:', parsed);
        } catch (error) {
          console.error('❌ Error parsing special features:', error);
        }
      } else if (condo.special_features && typeof condo.special_features === 'object') {
        console.log('⭐ Special features object:', condo.special_features);
      }
      console.log('📺 YouTube URL:', condo.youtube_url)
      console.log('📋 Floor plan:', condo.floor_plan)
      console.log('📋 Floor plan public_id:', condo.floor_plan_public_id)
      console.log('📋 Floor plan type:', typeof condo.floor_plan)
      if (condo.floor_plan && typeof condo.floor_plan === 'string' && condo.floor_plan.startsWith('{')) {
        try {
          const parsed = JSON.parse(condo.floor_plan);
          console.log('📋 Parsed floor plan:', parsed);
        } catch (error) {
          console.error('❌ Error parsing floor plan:', error);
        }
      }
      console.log('🖼️ Images from API:', condo.images)
      console.log('🖼️ Cover image from API:', condo.cover_image)
      console.log('🖼️ Cover public_id from API:', condo.cover_public_id)
      setFormData(prev => ({
        ...prev,
        title: condo.title || '',
        projectCode: condo.project_code || '',
        status: condo.status || 'sale',
        price: condo.price !== undefined && condo.price !== null ? String(condo.price) : '',
        rentPrice: condo.rent_price !== undefined && condo.rent_price !== null ? String(condo.rent_price) : '',
        announcerStatus: condo.announcer_status || 'agent', // เพิ่มการ map ข้อมูลสถานะผู้ประกาศ
        location: condo.location || '',
        googleMapUrl: condo.google_map_url || '',
        nearbyTransport: condo.nearby_transport || '',
        listingType: condo.listing_type || 'sale',
        description: condo.description || '',
        area: condo.area !== undefined && condo.area !== null ? String(condo.area) : '',
        bedrooms: condo.bedrooms !== undefined && condo.bedrooms !== null ? String(condo.bedrooms) : '',
        bathrooms: condo.bathrooms !== undefined && condo.bathrooms !== null ? String(condo.bathrooms) : '',
        floor: condo.floor || '',
        pricePerSqm: condo.price_per_sqm !== undefined && condo.price_per_sqm !== null ? String(condo.price_per_sqm) : '',
        rentPricePerSqm: condo.rent_price_per_sqm !== undefined && condo.rent_price_per_sqm !== null ? String(condo.rent_price_per_sqm) : '',
        seoTags: condo.seo_tags || '',
        selectedProject: condo.selected_project || '',
        availableDate: condo.available_date ? condo.available_date.split('T')[0] : '',
        amenities: condo.amenities || [],
        specialFeatures: (() => {
          try {
            let features = {};
            
            // ถ้าเป็น JSON string ให้ parse
            if (condo.special_features && typeof condo.special_features === 'string') {
              features = JSON.parse(condo.special_features);
            } else if (condo.special_features && typeof condo.special_features === 'object') {
              features = condo.special_features;
            }
            
            return {
              shortTerm: features.shortTerm || features.short_term || false,
              allowPet: features.allowPet || features.allow_pet || false,
              allowCompanyRegistration: features.allowCompanyRegistration || features.allow_company_registration || false,
              foreignQuota: features.foreignQuota || features.foreign_quota || false,
              penthouse: features.penthouse || false,
              luckyNumber: features.luckyNumber || features.lucky_number || false
            };
          } catch (error) {
            console.error('Error parsing special features:', error);
            return {
              shortTerm: false,
              allowPet: false,
              allowCompanyRegistration: false,
              foreignQuota: false,
              penthouse: false,
              luckyNumber: false
            };
          }
        })(),
        youtubeUrl: condo.youtube_url || '',
        floorPlan: condo.floor_plan ? (() => {
          try {
            // ถ้าเป็น JSON string ให้ parse
            if (typeof condo.floor_plan === 'string' && condo.floor_plan.startsWith('{')) {
              const parsed = JSON.parse(condo.floor_plan);
              return {
                url: parsed.url || condo.floor_plan,
                public_id: condo.floor_plan_public_id || parsed.public_id || undefined,
                preview: parsed.url || condo.floor_plan
              };
            }
            // ถ้าเป็น URL ปกติ
            return {
              url: condo.floor_plan,
              public_id: condo.floor_plan_public_id || undefined,
              preview: condo.floor_plan
            };
          } catch (error) {
            console.error('Error parsing floor_plan:', error);
            // ถ้า parse ไม่ได้ ให้ใช้เป็น URL ปกติ
            return {
              url: condo.floor_plan,
              public_id: condo.floor_plan_public_id || undefined,
              preview: condo.floor_plan
            };
          }
        })() : null,
        createdAt: condo.created_at || prev.createdAt,
        updatedAt: condo.updated_at || new Date().toISOString()
      }))

      const finalSpecialFeatures = (() => {
        try {
          let features = {};
          if (condo.special_features && typeof condo.special_features === 'string') {
            features = JSON.parse(condo.special_features);
          } else if (condo.special_features && typeof condo.special_features === 'object') {
            features = condo.special_features;
          }
          return {
            shortTerm: features.shortTerm || features.short_term || false,
            allowPet: features.allowPet || features.allow_pet || false,
            allowCompanyRegistration: features.allowCompanyRegistration || features.allow_company_registration || false,
            foreignQuota: features.foreignQuota || features.foreign_quota || false,
            penthouse: features.penthouse || false,
            luckyNumber: features.luckyNumber || features.lucky_number || false
          };
        } catch (error) {
          return {
            shortTerm: false,
            allowPet: false,
            allowCompanyRegistration: false,
            foreignQuota: false,
            penthouse: false,
            luckyNumber: false
          };
        }
      })();

      console.log('✅ Form data set:', {
        availableDate: condo.available_date ? condo.available_date.split('T')[0] : '',
        specialFeatures: finalSpecialFeatures,
        youtubeUrl: condo.youtube_url || '',
        floorPlan: condo.floor_plan ? {
          url: condo.floor_plan,
          public_id: condo.floor_plan_public_id || undefined,
          preview: condo.floor_plan
        } : null
      })

      // Set cover image
      const coverUrl = condo.cover_image || null
      if (coverUrl) {
        setCoverImage({
          id: `cover-${Date.now()}`,
          preview: coverUrl,
          url: coverUrl,
          public_id: condo.cover_public_id || undefined,
          uploading: false
        })
      } else {
        setCoverImage(null)
      }

      // Set gallery images (exclude cover if duplicated)
      const imageData = Array.isArray(condo.images) ? condo.images : []
      console.log('🖼️ Image data from API:', imageData)
      
      // Filter out cover image if it exists in gallery
      const filteredImages = coverUrl ? imageData.filter(img => {
        const imgUrl = typeof img === 'object' ? img.url : img
        return imgUrl !== coverUrl
      }) : imageData
      
      const mappedImages = filteredImages.map((img, idx) => {
        const imgUrl = typeof img === 'object' ? img.url : img
        const imgPublicId = typeof img === 'object' ? img.public_id : undefined
        return {
          id: `img-${Date.now()}-${idx}`,
          preview: imgUrl,
          url: imgUrl,
          public_id: imgPublicId,
          uploading: false
        }
      })
      setImages(mappedImages)
      console.log('🖼️ Mapped images set:', mappedImages)

      // Floor Plan is already set in formData above

      // จัดการ amenities
      console.log('Condo amenities from API:', condo.amenities)
      console.log('Type of amenities:', typeof condo.amenities)
      console.log('Is Array?', Array.isArray(condo.amenities))
      console.log('isEditing:', isEditing)
      console.log('selectedAmenities before:', selectedAmenities)
      console.log('formData.amenities before:', formData.amenities)
      if (condo.amenities && Array.isArray(condo.amenities)) {
        setSelectedAmenities(condo.amenities)
        console.log('Set selectedAmenities:', condo.amenities)
      } else {
        console.log('No amenities found or not array, setting empty array')
        setSelectedAmenities([])
      }
    }
  }, [isEditing, condo])

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true)
        const response = await projectApi.getAll()
        
        if (response && (response.success || Array.isArray(response.data))) {
          // แปลงข้อมูลจาก API ให้เข้ากับ format ที่ใช้ (รองรับทั้ง array ตรงๆ หรือ data.items)
          const rawList = Array.isArray(response.data) ? response.data : (response.data?.items || [])
          const formattedProjects = rawList.map(project => ({
            id: project.id.toString(),
            name: project.name_th || project.name_en || project.name || 'ไม่ระบุชื่อ',
            location: `${project.district || ''}${project.district && project.province ? ', ' : ''}${project.province || ''}`.replace(/^,\s*|,\s*$/g, ''),
            developer: project.developer || 'ไม่ระบุผู้พัฒนา',
            type: project.project_type || 'condo',
            address: project.address || '',
            total_units: project.total_units || 0,
            completion_year: project.completion_year || null
          }))
          
          setProjects(formattedProjects)
          setFilteredProjects(formattedProjects)
          console.log('โหลดโปรเจคสำเร็จ:', formattedProjects.length, 'โปรเจค')
        } else {
          console.error('API response failed:', response.message)
          setProjects([])
          setFilteredProjects([])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
        setFilteredProjects([])
      } finally {
        setProjectsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on search term
  useEffect(() => {
    if (!projectSearchTerm.trim()) {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(project => 
        project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
        project.developer.toLowerCase().includes(projectSearchTerm.toLowerCase())
      )
      setFilteredProjects(filtered)
    }
  }, [projectSearchTerm, projects])

  // Auto-open dropdown when typing search
  useEffect(() => {
    if (projectSearchTerm.trim() && !projectsLoading) {
      setIsProjectDropdownOpen(true)
    }
  }, [projectSearchTerm, projectsLoading])

  // Update selected project info when project changes
  useEffect(() => {
    if (formData.selectedProject) {
      const project = projects.find(p => p.id === formData.selectedProject)
      setSelectedProjectInfo(project || null)
    } else {
      setSelectedProjectInfo(null)
    }
  }, [formData.selectedProject, projects])

  // Generate auto project code (WS + ตัวเลข 7 หลัก)
  useEffect(() => {
    if (!isEditing && !formData.projectCode) {
      const timestamp = Date.now()
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const code = `WS${timestamp.toString().slice(-4)}${randomNum}` // รหัส WS + ตัวเลข 7 หลัก
      setFormData(prev => ({ ...prev, projectCode: code }))
    }
  }, [isEditing])

  // Auto calculate sale price per sqm
  useEffect(() => {
    if (formData.area && formData.price) {
      const area = parseFloat(formData.area)
      const price = parseFloat(formData.price)
      if (!isNaN(area) && !isNaN(price) && area > 0 && price > 0) {
        const pricePerSqm = (price / area).toFixed(2)
        setFormData(prev => ({ ...prev, pricePerSqm }))
        console.log(`คำนวณราคาขายต่อตารางเมตร: ${price} ÷ ${area} = ${pricePerSqm} บาท/ตร.ม.`);
      } else if (!formData.price || formData.price === '') {
        setFormData(prev => ({ ...prev, pricePerSqm: '' }))
      }
    }
  }, [formData.price, formData.area])

  // Auto calculate rent price per sqm
  useEffect(() => {
    if (formData.area && formData.rentPrice) {
      const area = parseFloat(formData.area)
      const rentPrice = parseFloat(formData.rentPrice)
      if (!isNaN(area) && !isNaN(rentPrice) && area > 0 && rentPrice > 0) {
        const rentPricePerSqm = (rentPrice / area).toFixed(2)
        setFormData(prev => ({ ...prev, rentPricePerSqm }))
        console.log(`คำนวณราคาเช่าต่อตารางเมตร: ${rentPrice} ÷ ${area} = ${rentPricePerSqm} บาท/ตร.ม./เดือน`);
      } else if (!formData.rentPrice || formData.rentPrice === '') {
        setFormData(prev => ({ ...prev, rentPricePerSqm: '' }))
      }
    }
  }, [formData.rentPrice, formData.area])

  // อัปเดต formData.amenities เมื่อ selectedAmenities เปลี่ยน
  useEffect(() => {
    console.log('selectedAmenities changed:', selectedAmenities)
    console.log('formData before update:', formData)
    console.log('selectedAmenities length:', selectedAmenities ? selectedAmenities.length : 0)
    console.log('selectedAmenities type:', typeof selectedAmenities)
    console.log('formData.amenities before update:', formData.amenities)
    if (selectedAmenities && Array.isArray(selectedAmenities)) {
      setFormData(prev => {
        const updated = {
          ...prev,
          amenities: selectedAmenities
        }
        console.log('Updated formData:', updated)
        return updated
      });
      console.log('Updated formData.amenities:', selectedAmenities)
    }
  }, [selectedAmenities]);

  // Check API status on component mount
  useEffect(() => {
    const checkInitialApiStatus = async () => {
      try {
        setApiStatus('checking')
        const response = await fetch('https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/health', {
          method: 'GET',
          timeout: 10000
        })
        setApiStatus(response.ok ? 'online' : 'offline')
        console.log('API status check:', response.ok ? 'online' : 'offline')
      } catch (error) {
        setApiStatus('offline')
        console.error('API health check failed:', error)
      }
    }
    
    checkInitialApiStatus()
  }, [])


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      updatedAt: new Date().toISOString()
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle multiple image uploads
  const handleMultipleImageUpload = async (files) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      
      const fileArray = Array.from(files)
      const totalFiles = fileArray.length
      let uploadedCount = 0
      let failedCount = 0
      const failedFiles = []
      
      console.log(`🔄 เริ่มอัพโหลด ${totalFiles} ไฟล์`)
      
      // Validate all files first
      const validFiles = []
      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          console.warn(`⚠️ ข้าม ${file.name}: ไม่ใช่ไฟล์รูปภาพ`)
          failedFiles.push(`${file.name} (ไม่ใช่รูปภาพ)`)
          failedCount++
          continue
        }
        
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`⚠️ ข้าม ${file.name}: ไฟล์ใหญ่เกินไป (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
          failedFiles.push(`${file.name} (ขนาดใหญ่เกิน 10MB)`)
          failedCount++
          continue
        }
        
        validFiles.push(file)
      }
      
      if (validFiles.length === 0) {
        Swal.fire({
        icon: 'warning',
        title: 'ไม่มีไฟล์ที่สามารถอัพโหลดได้',
        text: 'กรุณาเลือกไฟล์รูปภาพที่มีขนาดไม่เกิน 10MB',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f39c12'
      })
        return
      }
      
      console.log(`✅ ไฟล์ที่ผ่านการตรวจสอบ: ${validFiles.length}/${totalFiles}`)
      
      // Upload valid files one by one
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        try {
          console.log(`🔄 อัพโหลดไฟล์ ${i + 1}/${validFiles.length}: ${file.name}`)
          
          // Create temporary preview
          const tempImageData = {
            id: `temp-${Date.now()}-${i}`,
            preview: URL.createObjectURL(file),
            url: null,
            public_id: null,
            uploading: true
          }
          setImages(prev => [...prev, tempImageData])
          
          // Upload to server
          const response = await uploadAPI.uploadSingle(file)
          
          if (response && response.success && response.data) {
            const imageData = {
              id: Date.now().toString() + '-' + i,
              preview: response.data.url,
              url: response.data.url,
              public_id: response.data.public_id,
              uploading: false
            }
            
            // Replace temp image with real image
            setImages(prev => prev.map(img => 
              img.id === tempImageData.id ? imageData : img
            ))
            
            uploadedCount++
            console.log(`✅ อัพโหลดสำเร็จ ${uploadedCount}/${validFiles.length}: ${file.name}`)
          } else {
            throw new Error(response?.message || 'ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์')
          }
          
        } catch (error) {
          console.error(`❌ อัพโหลดล้มเหลว ${file.name}:`, error)
          failedFiles.push(`${file.name} (${error.message})`)
          failedCount++
          
          // Remove temp image on error
          setImages(prev => prev.filter(img => !img.uploading))
        }
        
        // Update progress
        setUploadProgress(((i + 1) / validFiles.length) * 100)
      }
      
      setUploadProgress(100)
      
      // Show summary
      let summaryMessage = ''
      if (uploadedCount > 0) {
        summaryMessage += `✅ อัพโหลดสำเร็จ: ${uploadedCount} ไฟล์`
      }
      if (failedCount > 0) {
        summaryMessage += `\n❌ อัพโหลดล้มเหลว: ${failedCount} ไฟล์`
        if (failedFiles.length > 0) {
          summaryMessage += `\n\nรายละเอียด:\n${failedFiles.join('\n')}`
        }
      }
      
      if (summaryMessage) {
        Swal.fire({
          icon: uploadedCount > 0 ? 'success' : 'error',
          title: uploadedCount > 0 ? 'อัพโหลดสำเร็จ' : 'อัพโหลดล้มเหลว',
          html: summaryMessage.replace(/\n/g, '<br>'),
          confirmButtonText: 'ตกลง',
          confirmButtonColor: uploadedCount > 0 ? '#3085d6' : '#d33'
        })
      }
      
      setTimeout(() => setUploadProgress(0), 3000) // Hide progress after 3 seconds
    } catch (error) {
      console.error('❌ Error uploading multiple images:', error)
      
      // More detailed error messages for multiple upload
      let errorMessage = 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
      let errorDetails = ''
      
      if (error.response && error.response.data) {
        const responseData = error.response.data
        errorMessage = responseData.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
        errorDetails = responseData.details || responseData.error || ''
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
        errorDetails = 'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'
      } else {
        errorDetails = error.message
      }
      
      const fullErrorMessage = errorDetails ? `${errorMessage}\n\nรายละเอียด: ${errorDetails}` : errorMessage
      Swal.fire({
        icon: 'error',
        title: 'อัปโหลดรูปภาพไม่สำเร็จ',
        html: fullErrorMessage.replace(/\n/g, '<br>'),
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#d33'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (file, isCover = false) => {
    try {
      setUploading(true)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)')
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('ขนาดไฟล์ต้องไม่เกิน 10MB')
      }
      
      console.log('🔄 เริ่มอัพโหลดไฟล์:', file.name, 'ขนาด:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      console.log('📁 ไฟล์ข้อมูล:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      })
      
      // Create temporary image preview while uploading
      const tempImageData = {
        id: `temp-${Date.now()}`,
        preview: URL.createObjectURL(file),
        url: null,
        public_id: null,
        uploading: true
      }

      if (isCover) {
        setCoverImage(tempImageData)
      } else {
        setImages(prev => [...prev, tempImageData])
      }
      
      // Call uploadAPI.uploadSingle
      console.log('📤 เรียกใช้ uploadAPI.uploadSingle...')
      const response = await uploadAPI.uploadSingle(file)
      
      console.log('✅ Upload response:', response)
      
      if (response && response.success && response.data) {
        const imageData = {
          id: Date.now().toString(),
          preview: response.data.url,
          url: response.data.url,
          public_id: response.data.public_id,
          uploading: false
        }

        if (isCover) {
          setCoverImage(imageData)
        } else {
          setImages(prev => prev.map(img => 
            img.id === tempImageData.id ? imageData : img
          ))
        }
        
        console.log('✅ รูปภาพอัพโหลดสำเร็จ:', imageData.url)
        
        // Show success notification
        const successMsg = isCover ? 'อัพโหลดรูปหน้าปกสำเร็จ!' : 'อัพโหลดรูปภาพสำเร็จ!'
        // You can replace alert with a better notification system
        setTimeout(() => {
          console.log('✅', successMsg)
        }, 100)
        
      } else {
        throw new Error(response?.message || 'ไม่ได้รับข้อมูลการอัปโหลดจากเซิร์ฟเวอร์')
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error)
      
      // Remove temporary image on error
      if (isCover) {
        setCoverImage(null)
      } else {
        setImages(prev => prev.filter(img => !img.uploading))
      }
      
      // More detailed error messages
      let errorMessage = 'อัปโหลดรูปภาพไม่สำเร็จ'
      let errorDetails = ''
      
      // Check for specific error types from backend
      if (error.response && error.response.data) {
        const responseData = error.response.data
        errorMessage = responseData.message || 'อัปโหลดรูปภาพไม่สำเร็จ'
        errorDetails = responseData.details || responseData.error || ''
        
        console.log('🔍 Backend error details:', responseData)
        console.log('🔍 Error response status:', error.response.status)
        console.log('🔍 Error response headers:', error.response.headers)
      } else if (error.message.includes('Network Error') || error.message.includes('ไม่สามารถเชื่อมต่อ')) {
        errorMessage = '🌐 ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
        errorDetails = 'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'
      } else if (error.message.includes('timeout')) {
        errorMessage = '⏱️ การอัปโหลดใช้เวลานานเกินไป'
        errorDetails = 'กรุณาลองใหม่อีกครั้ง'
      } else if (error.message.includes('413') || error.message.includes('ขนาดใหญ่')) {
        errorMessage = '📏 ไฟล์มีขนาดใหญ่เกินไป'
        errorDetails = 'กรุณาเลือกไฟล์ที่มีขนาดเล็กกว่า 10MB'
      } else if (error.message.includes('415') || error.message.includes('ประเภทไฟล์')) {
        errorMessage = '🖼️ ประเภทไฟล์ไม่ถูกต้อง'
        errorDetails = 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)'
      } else if (error.message.includes('Cloudinary')) {
        errorMessage = '☁️ เกิดข้อผิดพลาดในระบบจัดเก็บรูปภาพ'
        errorDetails = 'กรุณาลองใหม่อีกครั้ง'
      } else {
        errorMessage = `❌ อัปโหลดรูปภาพไม่สำเร็จ`
        errorDetails = error.message
      }
      
      // Show detailed error message
      const fullErrorMessage = errorDetails ? `${errorMessage}\n\nรายละเอียด: ${errorDetails}` : errorMessage
      Swal.fire({
        icon: 'error',
        title: 'อัปโหลดรูปภาพไม่สำเร็จ',
        html: fullErrorMessage.replace(/\n/g, '<br>'),
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#d33'
      })
      
      // Log error for debugging
      console.error('❌ Upload error details:', {
        message: errorMessage,
        details: errorDetails,
        originalError: error
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (imageId, isCover = false) => {
    const imageType = isCover ? 'รูปภาพหน้าปก' : 'รูปภาพเพิ่มเติม'
    
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: `คุณต้องการลบ${imageType}นี้หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        if (isCover) {
          setCoverImage(null)
        } else {
          setImages(prev => prev.filter(img => img.id !== imageId))
        }
        
        Swal.fire(
          'ลบแล้ว!',
          `${imageType}ถูกลบเรียบร้อยแล้ว`,
          'success'
        )
      }
    })
  }

  const validateForm = () => {
    const newErrors = {}

    // ผ่อนการบังคับกรอก: ให้บังคับเฉพาะชื่อโครงการเท่านั้น
    if (!formData.title) newErrors.title = 'กรุณากรอกชื่อโครงการ'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setUploading(true)
      
      // Transform form data to API format
      const condoData = {
        title: formData.title,
        status: formData.status,
        price: parseFloat(formData.price) || 0,
        rent_price: parseFloat(formData.rentPrice) || 0,
        announcer_status: formData.announcerStatus, // เพิ่มการส่งข้อมูลสถานะผู้ประกาศ
        location: formData.location,
        google_map_url: formData.googleMapUrl,
        nearby_transport: formData.nearbyTransport,
        listing_type: formData.listingType,
        description: formData.description,
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        floor: formData.floor,
        price_per_sqm: parseFloat(formData.pricePerSqm) || 0,
        rent_price_per_sqm: parseFloat(formData.rentPricePerSqm) || 0,
        seo_tags: formData.seoTags,
        selected_project: formData.selectedProject,
        available_date: formData.availableDate,
        images: images.map(img => ({
          url: img.url,
          public_id: img.public_id
        })),
        cover_image: coverImage?.url || null,
        amenities: selectedAmenities,
        special_features: formData.specialFeatures,
        youtube_url: formData.youtubeUrl,
        floor_plan: formData.floorPlan,
      }

      console.log('ข้อมูลที่จะส่งไปยัง backend:', condoData)
      console.log('ราคาขายต่อตารางเมตรที่คำนวณได้:', formData.pricePerSqm)
      console.log('ราคาเช่าต่อตารางเมตรที่คำนวณได้:', formData.rentPricePerSqm)
      console.log('Amenities ที่จะส่งไป:', selectedAmenities)
      console.log('formData.amenities:', formData.amenities)
      console.log('📅 Available date ที่จะส่ง:', formData.availableDate)
      console.log('⭐ Special features ที่จะส่ง:', formData.specialFeatures)
      console.log('📺 YouTube URL ที่จะส่ง:', formData.youtubeUrl)
      console.log('📋 Floor plan ที่จะส่ง:', formData.floorPlan)
      console.log('📋 Floor plan URL ที่จะส่ง:', formData.floorPlan?.url || null)
      console.log('🖼️ Images ที่จะส่ง:', images.map(img => ({
        url: img.url,
        public_id: img.public_id
      })))
      console.log('🖼️ Cover image ที่จะส่ง:', coverImage?.url || null)
      console.log('⭐ Special features ที่จะส่ง:', formData.specialFeatures)
      console.log('⭐ Special features JSON ที่จะส่ง:', JSON.stringify(formData.specialFeatures))

      let response
      
      if (isEditing && condo?.id) {
        // Update existing condo
        response = await condoAPI.update(condo.id, condoData)
      } else {
        // Create new condo
        response = await condoAPI.create(condoData)
      }

      if (response.success) {
        console.log('Condo saved successfully:', response)
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: isEditing ? 'แก้ไขข้อมูลคอนโดสำเร็จ!' : 'เพิ่มคอนโดใหม่สำเร็จ!',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        })
        
        if (onSave) {
          onSave(response.data)
        }
        
        // Go back to list
        if (onBack) {
          onBack()
        }
      } else {
        throw new Error(response.message || 'Failed to save condo')
      }
    } catch (error) {
      console.error('Error saving condo:', error)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: error.message,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#d33'
      })
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  // ฟังก์ชันสำหรับจัดการ Special Features
  const handleSpecialFeatureChange = (featureId, checked) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: {
        ...prev.specialFeatures,
        [featureId]: checked
      }
    }));
  };

  // ฟังก์ชันสำหรับอัพโหลด Floor Plan
  const handleFloorPlanUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('ไฟล์ใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB');
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
          return;
        }

        try {
          setUploading(true);
          
          // ส่ง file โดยตรงไปยัง uploadAPI.uploadSingle
          const response = await uploadAPI.uploadSingle(file);
          
          if (response.success) {
            setFormData(prev => ({
              ...prev,
              floorPlan: {
                url: response.data.url,
                public_id: response.data.public_id,
                preview: URL.createObjectURL(file)
              }
            }));
            console.log('✅ อัพโหลด Floor Plan สำเร็จ:', response.data);
          } else {
            Swal.fire({
          icon: 'error',
          title: 'อัพโหลด Floor Plan ไม่สำเร็จ',
          text: response.message || 'เกิดข้อผิดพลาด',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#d33'
        });
          }
        } catch (error) {
          console.error('❌ อัพโหลด Floor Plan error:', error);
          Swal.fire({
          icon: 'error',
          title: 'อัพโหลด Floor Plan ไม่สำเร็จ',
          text: error.message,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#d33'
        });
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับ</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-prompt">
              {isEditing ? 'แก้ไขข้อมูลคอนโด' : 'เพิ่มคอนโดใหม่'}
            </h1>
            <p className="text-gray-600 font-prompt mt-1">
              กรอกข้อมูลคอนโดให้ครบถ้วน
            </p>
          </div>
        </div>
      </div>

      {/* API Status Indicator */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === 'online' ? 'bg-green-500' : 
              apiStatus === 'offline' ? 'bg-red-500' : 
              'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-sm font-medium text-gray-700">
              สถานะ API: {
                apiStatus === 'online' ? '🟢 เชื่อมต่อแล้ว' : 
                apiStatus === 'offline' ? '🔴 ไม่สามารถเชื่อมต่อได้' : 
                '🟡 กำลังตรวจสอบ...'
              }
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  setApiStatus('checking')
                  const response = await fetch('https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/health', {
                    timeout: 10000
                  })
                  setApiStatus(response.ok ? 'online' : 'offline')
                  if (response.ok) {
                    console.log('✅ API เชื่อมต่อสำเร็จ')
                  } else {
                    console.log('❌ API ไม่พร้อมใช้งาน')
                  }
                } catch (error) {
                  console.error('❌ API connection failed:', error)
                  setApiStatus('offline')
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 border border-blue-200 rounded hover:bg-blue-50"
            >
              🔄 ทดสอบการเชื่อมต่อ
            </button>
            <span className="text-xs text-gray-500">
              อัปเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')}
            </span>
          </div>
        </div>
        
        {/* Status Details */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-2 rounded ${
            apiStatus === 'online' ? 'bg-green-100 text-green-700' : 
            apiStatus === 'offline' ? 'bg-red-100 text-red-700' : 
            'bg-yellow-100 text-yellow-700'
          }`}>
            <span className="font-medium">🌐 Backend:</span> {
              apiStatus === 'online' ? 'พร้อมใช้งาน' : 
              apiStatus === 'offline' ? 'ไม่พร้อมใช้งาน' : 
              'กำลังตรวจสอบ'
            }
          </div>
          <div className="p-2 rounded bg-blue-100 text-blue-700">
            <span className="font-medium">☁️ Cloudinary:</span> พร้อมใช้งาน
          </div>
          <div className="p-2 rounded bg-purple-100 text-purple-700">
            <span className="font-medium">📤 Upload:</span> พร้อมใช้งาน
          </div>
        </div>
        
        {apiStatus === 'offline' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <p className="text-sm text-red-700 font-medium">ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้</p>
                <p className="text-xs text-red-600 mt-1">
                  การอัปโหลดรูปภาพอาจไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือลองใหม่อีกครั้ง
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ข้อมูลพื้นฐาน */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Building className="h-6 w-6 mr-3 text-blue-600" />
            ข้อมูลพื้นฐาน
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ชื่อโครงการ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ชื่อโครงการ *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="เช่น คอนโด ลุมพินี วิลล์ รามคำแหง"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* รหัสโครงการ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                รหัสโครงการ (WS + ตัวเลข 7 หลัก)
              </label>
              <Input
                value={formData.projectCode}
                readOnly
                className="bg-gray-100"
                placeholder="สร้างอัตโนมัติ"
              />
            </div>

            {/* สร้างเมื่อ - แก้ไขล่าสุด */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                สร้างเมื่อ - แก้ไขล่าสุด
              </label>
              <Input
                value={`${new Date(formData.createdAt).toLocaleDateString('th-TH')} - ${new Date(formData.updatedAt).toLocaleDateString('th-TH')}`}
                readOnly
                className="bg-gray-100"
              />
            </div>

            {/* สถานะผู้ประกาศ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt flex items-center">
                <User className="h-5 w-5 mr-2 text-red-500" />
                สถานะผู้ประกาศ *
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {[
                  { value: 'owner', label: 'เจ้าของ (Owner)', color: 'from-orange-500 to-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
                  { value: 'agent', label: 'ตัวแทนพิเศษ (Exclusive Agent)', color: 'from-green-500 to-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('announcerStatus', option.value)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 font-medium group hover:shadow-lg hover:scale-105 ${
                      formData.announcerStatus === option.value
                        ? `${option.borderColor} bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                        : `${option.bgColor} text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                    }`}
                  >
                    <div className="p-3 flex items-center justify-center space-x-2">
                      <div className={`p-1.5 rounded-full transition-all duration-300 ${
                        formData.announcerStatus === option.value 
                          ? 'bg-white/20 scale-110' 
                          : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                      }`}>
                        <User className={`h-4 w-4 ${
                          formData.announcerStatus === option.value ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </div>
                    {formData.announcerStatus === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 font-prompt">
                เลือกสถานะของผู้ประกาศ: เจ้าของคอนโด หรือ ตัวแทนพิเศษ
              </p>
              <p className="text-sm text-gray-500 mt-1 font-prompt">
                *รับฝากเฉพาะนายหน้าที่เป็นสัญญาปิดหรือทรัพย์ที่ดีลปิดกับทางเจ้าของเท่านั้น
              </p>
            </div>

            {/* ประเภททรัพย์ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt">
                ประเภททรัพย์ *
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {[
                  { value: 'condo', label: 'คอนโด', icon: Building, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
                  { value: 'apartment', label: 'อพาร์ตเมนท์', icon: FaHome, color: 'from-green-500 to-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('propertyType', option.value)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 font-medium group hover:shadow-lg hover:scale-105 ${
                      formData.propertyType === option.value
                        ? `${option.borderColor} bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                        : `${option.bgColor} text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                    }`}
                  >
                    <div className="p-3 flex items-center justify-center space-x-2">
                      <div className={`p-1.5 rounded-full transition-all duration-300 ${
                        formData.propertyType === option.value 
                          ? 'bg-white/20 scale-110' 
                          : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                      }`}>
                        <option.icon className={`h-4 w-4 ${
                          formData.propertyType === option.value ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </div>
                    {formData.propertyType === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* สถานะ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt">
                สถานะ * (เลือกประเภท เช่า หรือ ขาย)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'sale', label: 'ขาย', icon: DollarSign, color: 'from-green-500 to-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50' },
                  { value: 'rent', label: 'เช่า', icon: Calendar, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
                  { value: 'both', label: 'ขายและเช่า', icon: Building, color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('status', option.value)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 font-medium group hover:shadow-lg hover:scale-105 ${
                      formData.status === option.value
                        ? `${option.borderColor} bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                        : `${option.bgColor} text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                    }`}
                  >
                    <div className="p-3 flex items-center justify-center space-x-2">
                      <div className={`p-1.5 rounded-full transition-all duration-300 ${
                        formData.status === option.value 
                          ? 'bg-white/20 scale-110' 
                          : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                      }`}>
                        <option.icon className={`h-4 w-4 ${
                          formData.status === option.value ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </div>
                    {formData.status === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>



            {/* ราคา (บาท) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคา (บาท) * {formData.status !== 'rent' && '(กรณีขาย)'}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="เช่น 3500000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
            </div>

            {/* ราคาเช่า */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาเช่า (บาท/เดือน)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.rentPrice}
                  onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                  placeholder="เช่น 25000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* โลเคชั่น */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <MapPin className="h-6 w-6 mr-3 text-blue-600" />
            โลเคชั่น
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* สถานที่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น : สถานที่ *
              </label>
              <div className="relative">
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="เช่น รามคำแหง, กรุงเทพฯ"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
            </div>

            {/* Google Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น : Google Map URL
              </label>
              <div className="relative">
                <Input
                  type="url"
                  value={formData.googleMapUrl}
                  onChange={(e) => handleInputChange('googleMapUrl', e.target.value)}
                  placeholder="เช่น https://maps.google.com/..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">ลิงก์ Google Maps สำหรับแสดงตำแหน่งที่ตั้ง</p>
            </div>

            {/* ขนส่งใกล้เคียง */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น BTS MRT ARL SRT :
              </label>
              
              {/* ช่องค้นหาสถานี */}
              <div className="relative station-search-container">
                <div className="relative">
                  <input
                    type="text"
                    value={stationSearchTerm}
                    onChange={(e) => {
                      setStationSearchTerm(e.target.value);
                      setShowStationDropdown(true);
                    }}
                    onFocus={() => setShowStationDropdown(true)}
                    placeholder="ค้นหาสถานีรถไฟฟ้า เช่น อโศก, สุขุมวิท, MRT..."
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Dropdown ผลการค้นหา */}
                {showStationDropdown && (stationSearchTerm || filteredStations().length > 0) && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStations().length > 0 ? (
                      <div className="py-2">
                        {filteredStations().map((station) => (
                          <button
                            key={station.id}
                            type="button"
                            onClick={() => handleStationSelect(station)}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                              isStationSelected(station.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            <div>
                              <div className="font-medium">{station.name}</div>
                              <div className="text-sm text-gray-500">{station.line}</div>
                            </div>
                            {isStationSelected(station.id) && (
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        ไม่พบสถานีที่ค้นหา
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* แสดงสถานีที่เลือก */}
              {formData.selectedStations && formData.selectedStations.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-700">
                      สถานีที่เลือก ({formData.selectedStations.length} สถานี)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, selectedStations: [] }));
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      ลบทั้งหมด
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedStations.map((stationId) => {
                      const allStations = [...btsStations, ...mrtStations, ...arlStations, ...srtStations];
                      const station = allStations.find(s => s.id === stationId);
                      return station ? (
                        <span
                          key={stationId}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          {station.name}
                          <button
                            type="button"
                            onClick={() => handleStationToggle(stationId)}
                            className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* คำแนะนำ */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>พิมพ์ชื่อสถานีหรือสายรถไฟฟ้าเพื่อค้นหา เช่น "อโศก", "BTS", "MRT"</span>
              </div>
            </div>
          </div>
        </Card>

        {/* รายละเอียด */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            รายละเอียด
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
              รายละเอียด
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
                              placeholder="อธิบายรายละเอียดของคอนโด เช่น สภาพห้อง การตกแต่ง วิวที่ห้อง..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Card>

        {/* ข้อมูลอสังหาริมทรัพย์ */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Building className="h-6 w-6 mr-3 text-blue-600" />
            ข้อมูลอสังหาริมทรัพย์
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* พื้นที่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                พื้นที่ (ตารางเมตร) *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="เช่น 65.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ม.</span>
                </div>
              </div>
              
            </div>

            {/* ห้องนอน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ห้องนอน *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="เช่น 2"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Bed className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
            </div>

            {/* ห้องน้ำ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ห้องน้ำ *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="เช่น 2"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Bath className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
            </div>

            {/* จำนวนชั้นคอนโด */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                จำนวนชั้นคอนโดต้องเป็น ชั้นที่ *
              </label>
              <div className="relative">
                <Input
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  placeholder="เช่น 15 หรือ 17-18 (สำหรับ duplex)"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">สำหรับห้อง duplex ให้ใส่เป็น 17-18 (ชั้นเชื่อม)</p>
              
            </div>

            {/* ราคาขายต่อ ตร.ม. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
              </label>
              <div className="relative">
                <Input
                  value={formData.pricePerSqm ? `฿${parseFloat(formData.pricePerSqm).toLocaleString('th-TH', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} /ตร.ม.` : ''}
                  readOnly
                  className="bg-green-50 border-green-200 text-green-700 font-semibold"
                  placeholder="จะคำนวณจากราคาขาย"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calculator className="h-4 w-4 text-green-500" />
                </div>
              </div>
              {formData.pricePerSqm && (
                <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-700">
                    ✅ คำนวณจากราคาขาย = ฿{parseFloat(formData.pricePerSqm).toLocaleString('th-TH')} /ตร.ม.
                  </p>
                </div>
              )}
            </div>

            {/* ราคาเช่าต่อ ตร.ม. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาเช่าต่อ ตร.ม. (คำนวณอัตโนมัติ)
              </label>
              <div className="relative">
                <Input
                  value={formData.rentPricePerSqm ? `฿${parseFloat(formData.rentPricePerSqm).toLocaleString('th-TH', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} /ตร.ม./เดือน` : ''}
                  readOnly
                  className="bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                  placeholder="จะคำนวณจากราคาเช่า"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calculator className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              {formData.rentPricePerSqm && (
                <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-700">
                    ✅ คำนวณจากราคาเช่า = ฿{parseFloat(formData.rentPricePerSqm).toLocaleString('th-TH')} /ตร.ม./เดือน
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* โปรเจคและวันที่ว่าง */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Building className="h-6 w-6 mr-3 text-blue-600" />
            โปรเจคและวันที่ว่าง
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* โปรเจค */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โปรเจค *
              </label>
              
              {/* ช่องค้นหาโปรเจค */}
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder="ค้นหาโปรเจค (ชื่อ, สถานที่, หรือผู้พัฒนา)..."
                  value={projectSearchTerm}
                  onFocus={() => setIsProjectDropdownOpen(true)}
                  onChange={(e) => setProjectSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredProjects.length > 0) {
                      const first = filteredProjects[0]
                      handleInputChange('selectedProject', first.id)
                      setIsProjectDropdownOpen(false)
                    }
                    if (e.key === 'Escape') {
                      setIsProjectDropdownOpen(false)
                    }
                  }}
                  className="w-full"
                />
              </div>
              
              {projectsLoading ? (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">กำลังโหลดโปรเจค...</span>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProjectDropdownOpen(prev => !prev)}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="truncate">{selectedProjectInfo ? `${selectedProjectInfo.name} - ${selectedProjectInfo.location}` : '-- เลือกโปรเจคที่ห้องนี้อยู่ --'}</span>
                    <svg className={`h-4 w-4 ml-2 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                  </button>
                  {isProjectDropdownOpen && (
                    <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto" role="listbox">
                      {filteredProjects.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500">ไม่พบโปรเจค</div>
                      ) : (
                        filteredProjects.map(project => (
                          <div
                            key={project.id}
                            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${formData.selectedProject === project.id ? 'bg-blue-50' : ''}`}
                            role="option"
                            aria-selected={formData.selectedProject === project.id}
                            onClick={() => {
                              handleInputChange('selectedProject', project.id)
                              setIsProjectDropdownOpen(false)
                            }}
                          >
                            <div className="font-medium text-gray-800">{project.name}</div>
                            <div className="text-xs text-gray-500">{project.location} {project.developer ? `• ${project.developer}` : ''}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {projectSearchTerm && (
                    <p className="text-sm text-gray-500 mt-1">
                      พบ {filteredProjects.length} โปรเจค จาก {projects.length} โปรเจค
                    </p>
                  )}
                </div>
              )}
              
              {/* แสดงข้อมูลโปรเจคที่เลือก */}
              {selectedProjectInfo && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <h4 className="font-medium text-blue-800 font-prompt">
                        ✅ เลือกแล้ว: {selectedProjectInfo.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-blue-600">
                        <p>📍 {selectedProjectInfo.location}</p>
                        <p>🏢 {selectedProjectInfo.developer}</p>
                        {selectedProjectInfo.type && <p>🏗️ ประเภท: {selectedProjectInfo.type}</p>}
                        {selectedProjectInfo.total_units > 0 && <p>🏠 {selectedProjectInfo.total_units} ยูนิต</p>}
                        {selectedProjectInfo.completion_year && <p>📅 ปีที่แล้วเสร็จ: {selectedProjectInfo.completion_year}</p>}
                        {selectedProjectInfo.address && <p className="md:col-span-2">📋 {selectedProjectInfo.address}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* วันที่ว่าง */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                วันที่ว่าง
              </label>
              <Input
                type="date"
                value={formData.availableDate}
                onChange={(e) => handleInputChange('availableDate', e.target.value)}
                placeholder="เลือกวันที่ว่าง"
              />
              <p className="text-sm text-gray-500 mt-1">
                วันที่ที่ห้องจะว่างพร้อมเข้าอยู่
              </p>
            </div>
          </div>
        </Card>

        {/* SEO Tag */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Search className="h-6 w-6 mr-3 text-blue-600" />
            SEO Tag
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
              SEO Tag
            </label>
            <Input
              value={formData.seoTags}
              onChange={(e) => handleInputChange('seoTags', e.target.value)}
              placeholder="เช่น คอนโด, รามคำแหง, ลุมพินี, ขาย, เช่า"
            />
            <p className="text-sm text-gray-500 mt-1">ช่องให้กรอก tag สำหรับ SEO (แยกแท็กด้วยเครื่องหมายจุลภาค)</p>
          </div>
        </Card>

        {/* สิ่งอำนวยความสะดวกภายในห้อง (Amenities) */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Star className="h-6 w-6 mr-3 text-blue-600" />
            สิ่งอำนวยความสะดวกภายในห้อง
          </h2>
          
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700 font-prompt">
              <span className="font-medium">🐛 Debug:</span> 
              selectedAmenities: {JSON.stringify(selectedAmenities)} | 
              formData.amenities: {JSON.stringify(formData.amenities)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenitiesList.map(amenity => (
              <label key={amenity.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAmenities(prev => [...prev, amenity.id])
                      setFormData(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity.id]
                      }))
                    } else {
                      setSelectedAmenities(prev => prev.filter(id => id !== amenity.id))
                      setFormData(prev => ({
                        ...prev,
                        amenities: prev.amenities.filter(id => id !== amenity.id)
                      }))
                    }
                  }}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex items-center">
                  <span className="mr-2 text-blue-600">
                    {getFacilityIcon(amenity.icon)}
                  </span>
                  <span className="text-sm text-gray-700 font-prompt">{amenity.label}</span>
                </div>
              </label>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-prompt">
              <span className="font-medium">💡 คำแนะนำ:</span> เลือกสิ่งอำนวยความสะดวกที่มีอยู่ในห้อง 
              เพื่อให้ผู้ซื้อ/ผู้เช่าเห็นข้อมูลที่ครบถ้วน
            </p>
          </div>
        </Card>

        {/* Special Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt">
            Special Features
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'shortTerm', label: 'Short-term', icon: Calendar },
              { id: 'allowPet', label: 'Allow Pet', icon: FaPaw },
              { id: 'allowCompanyRegistration', label: 'Allow Company Registration', icon: FaBuilding },
              { id: 'foreignQuota', label: 'Foreign Quota', icon: FaGlobe },
              { id: 'penthouse', label: 'Penthouse', icon: FaHome },
              { id: 'luckyNumber', label: 'Lucky Number', icon: FaStar }
            ].map((feature) => (
              <label key={feature.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.specialFeatures[feature.id]}
                  onChange={(e) => handleSpecialFeatureChange(feature.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <feature.icon className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700 font-prompt">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
            ลิงก์ YouTube
          </label>
          <div className="relative">
            <Input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
              placeholder="เช่น https://www.youtube.com/watch?v=..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <FaVideo className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">ลิงก์ YouTube สำหรับแสดงวิดีโอของคอนโด</p>
        </div>

        {/* Floor Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
            ภาพแปลน (Floor Plan)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            {formData.floorPlan ? (
              <div className="space-y-3">
                <img 
                  src={formData.floorPlan.preview || formData.floorPlan.url} 
                  alt="Floor Plan" 
                  className="mx-auto max-h-64 rounded-lg shadow-md"
                />
                <div className="flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleFloorPlanUpload()}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    เปลี่ยนภาพ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      Swal.fire({
                        title: 'ยืนยันการลบ',
                        text: 'คุณต้องการลบภาพแปลนนี้หรือไม่?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'ลบ',
                        cancelButtonText: 'ยกเลิก'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setFormData(prev => ({ ...prev, floorPlan: null }))
                          Swal.fire(
                            'ลบแล้ว!',
                            'ภาพแปลนถูกลบเรียบร้อยแล้ว',
                            'success'
                          )
                        }
                      })
                    }}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <FaFileAlt className="text-gray-400 text-4xl mx-auto" />
                <div className="text-gray-600 font-prompt">
                  <p className="font-medium">อัพโหลดภาพแปลน</p>
                  <p className="text-sm">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFloorPlanUpload()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  เลือกไฟล์
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">รองรับไฟล์ JPG, PNG, WebP ขนาดไม่เกิน 10MB</p>
        </div>

        {/* รูปภาพ */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Camera className="h-6 w-6 mr-3 text-blue-600" />
            รูปภาพ
          </h2>
          
          {/* รูปภาพหน้าปก */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 font-prompt flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-500" />
              รูปภาพหน้าปก
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage.preview}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(coverImage.id, true)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  {/* Upload Status Indicator */}
                  {coverImage.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="font-prompt">กำลังอัพโหลด...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Success Badge */}
                  {!coverImage.uploading && coverImage.url && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✅ อัพโหลดสำเร็จ
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer block text-center hover:bg-gray-50 rounded-lg p-4 transition-colors">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <span className="text-gray-600 font-prompt font-medium">คลิกเพื่อเลือกรูปภาพหน้าปก</span>
                  <p className="text-sm text-gray-500 mt-2">รองรับไฟล์ JPG, PNG, WebP ขนาดไม่เกิน 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], true)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Multiple Images Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              รูปภาพเพิ่มเติม (สูงสุด 100 รูป)
            </label>
            
            {/* Drag & Drop Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files).filter(file => 
                  file.type.startsWith('image/')
                )
                if (files.length > 0) {
                  handleMultipleImageUpload(files)
                }
              }}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                ลากและวางรูปภาพที่นี่ หรือ
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="multiple-images"
                onChange={(e) => {
                  if (e.target.files) {
                    handleMultipleImageUpload(e.target.files)
                  }
                }}
              />
              <label 
                htmlFor="multiple-images"
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                เลือกรูปภาพ
              </label>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id, false)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    {/* Upload Status Indicator */}
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-1"></div>
                          <p className="text-xs font-prompt">อัพโหลด...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Success Badge */}
                    {!image.uploading && image.url && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-1 py-0.5 rounded-full text-xs font-medium">
                        ✅
                      </div>
                    )}
                    
                    {/* Error Badge */}
                    {!image.uploading && !image.url && image.preview && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-medium">
                        ❌
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          <div className="flex items-center justify-between text-sm mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-prompt">
                อัปโหลดแล้ว {images.filter(img => img.url && !img.uploading).length}/100 รูป
              </span>
              {uploading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="font-prompt">กำลังอัปโหลด...</span>
                </div>
              )}
              
              {/* Upload Count Summary */}
              {images.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-green-600">
                    ✅ สำเร็จ: {images.filter(img => img.url && !img.uploading).length}
                  </span>
                  {images.filter(img => img.uploading).length > 0 && (
                    <span className="text-blue-600">
                      🔄 กำลังอัพโหลด: {images.filter(img => img.uploading).length}
                    </span>
                  )}
                  {images.filter(img => !img.url && !img.uploading).length > 0 && (
                    <span className="text-red-600">
                      ❌ ล้มเหลว: {images.filter(img => !img.url && !img.uploading).length}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {images.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('คุณต้องการลบรูปภาพทั้งหมดใช่หรือไม่?')) {
                      setImages([])
                    }
                  }}
                  className="text-red-600 hover:text-red-700 font-prompt text-sm transition-colors"
                >
                  ลบทั้งหมด
                </button>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="font-prompt">ความคืบหน้าการอัพโหลด</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              {uploadProgress === 100 && (
                <div className="text-center text-green-600 text-sm mt-2 font-prompt">
                  ✅ อัพโหลดเสร็จสิ้น!
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-prompt mb-2">
                  <span className="font-medium">💡 คำแนะนำ:</span> รูปภาพหน้าปกจะแสดงเป็นรูปหลักในรายการ 
                  รูปภาพเพิ่มเติมจะแสดงในแกลลอรี่ของประกาศ สามารถอัปโหลดได้สูงสุด 100 รูป
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>📱 รองรับ: JPG, PNG, WebP</span>
                  <span>📏 ขนาดสูงสุด: 10MB</span>
                  <span>🖼️ จำนวนสูงสุด: 100 รูป</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      console.log('🧪 ทดสอบ Upload API...')
                      setApiStatus('checking')
                      const testResponse = await fetch('https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/upload/test', {
                        method: 'GET',
                        timeout: 10000
                      })
                      if (testResponse.ok) {
                        const result = await testResponse.json()
                        Swal.fire({
          icon: 'success',
          title: 'Upload API พร้อมใช้งาน',
          html: `📊 สถานะ: ${result.message}<br>☁️ Cloudinary: ${result.cloudinary.configured ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน'}`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        })
                        setApiStatus('online')
                      } else {
                        Swal.fire({
          icon: 'error',
          title: 'Upload API ไม่พร้อมใช้งาน',
          text: 'ไม่สามารถเชื่อมต่อกับ Upload API ได้',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#d33'
        })
                        setApiStatus('offline')
                      }
                    } catch (error) {
                      console.error('❌ Upload API test failed:', error)
                      Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเชื่อมต่อ Upload API ได้',
          text: 'รายละเอียด: ' + error.message,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#d33'
        })
                      setApiStatus('offline')
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 border border-blue-200 rounded hover:bg-blue-50"
                >
                  🧪 ทดสอบ API
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      console.log('☁️ ทดสอบ Cloudinary...')
                      const testResponse = await fetch('https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/health/cloudinary', {
                        method: 'GET',
                        timeout: 10000
                      })
                      if (testResponse.ok) {
                        const result = await testResponse.json()
                        Swal.fire({
          icon: 'success',
          title: 'Cloudinary พร้อมใช้งาน',
          html: `📊 สถานะ: ${result.cloudinary.status}<br>☁️ Cloud Name: ${result.cloudinary.cloud_name}`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#3085d6'
        })
                      } else {
                        Swal.fire({
          icon: 'error',
          title: 'Cloudinary ไม่พร้อมใช้งาน',
          text: 'ไม่สามารถเชื่อมต่อกับ Cloudinary ได้',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#d33'
        })
                      }
                    } catch (error) {
                      console.error('❌ Cloudinary test failed:', error)
                      Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเชื่อมต่อ Cloudinary ได้',
          text: 'รายละเอียด: ' + error.message,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#d33'
        })
                    }
                  }}
                  className="text-xs text-green-600 hover:text-green-700 font-medium px-2 py-1 border border-green-200 rounded hover:bg-green-50"
                >
                  ☁️ ทดสอบ Cloudinary
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={uploading}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
                          disabled={loading || uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading || uploading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>กำลังบันทึก...</span>
              </div>
            ) : (
              isEditing ? 'อัปเดต' : 'บันทึก'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CondoForm