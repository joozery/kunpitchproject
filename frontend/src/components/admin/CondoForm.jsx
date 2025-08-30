import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { condoAPI, uploadAPI } from '../../lib/api'
import { projectApi } from '../../lib/projectApi'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { GiWashingMachine, GiLockedDoor } from 'react-icons/gi'
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

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // SortableImage Component สำหรับรูปภาพที่สามารถ drag and drop ได้
  const SortableImage = ({ image, index, onRemove }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: `image-${image.id}` });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const imageUrl = image.url || image.preview;
    const imageName = image.fileName || `รูปที่ ${index + 1}`;
    const imageSize = image.size ? `${(image.size / 1024 / 1024).toFixed(2)} MB` : 'รูปภาพ';
    const badgeColor = image.url ? 'bg-green-500' : 'bg-blue-500';
    const badgeText = image.url ? 'สำเร็จ' : 'ใหม่';

    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="relative group cursor-move"
        {...attributes}
        {...listeners}
      >
        <div className="bg-white p-2 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
          <div className="relative">
            <img
              src={imageUrl}
              alt={imageName}
              className="w-full h-24 object-cover rounded mb-2 border border-gray-100"
              onError={(e) => {
                console.warn(`❌ Image failed to load: ${image.id}`, { url: image.url, preview: image.preview })
                e.target.style.display = 'none'
              }}
            />
            <div className={`absolute top-1 left-1 ${badgeColor} text-white text-xs px-2 py-1 rounded font-medium`}>
              {index + 1}
            </div>
            <div className={`absolute top-1 right-1 ${badgeColor} text-white text-xs px-1 py-0.5 rounded`}>
              {badgeText}
            </div>
            {/* Drag Handle */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-gray-800/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              ⋮⋮
            </div>
            
            {/* Upload Status Indicator */}
            {image.uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-1"></div>
                  <p className="text-xs">อัพโหลด...</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 truncate mb-1" title={imageName}>
              {imageName}
            </p>
            <p className="text-xs text-gray-400">
              {imageSize}
            </p>
            {/* แสดงลำดับปัจจุบัน */}
            <p className="text-xs text-blue-600 font-medium mt-1">
              ลำดับ: {index + 1}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
          title="ลบรูปภาพ"
        >
          ×
        </button>
      </div>
    );
  };

  // ฟังก์ชันสำหรับการจัดการ drag and drop รูปภาพ
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setImages(prev => {
        const oldIndex = prev.findIndex(img => `image-${img.id}` === active.id);
        const newIndex = prev.findIndex(img => `image-${img.id}` === over.id);
        
        const reorderedImages = arrayMove(prev, oldIndex, newIndex);
        
        // แสดง SweetAlert2 เพื่อยืนยันการจัดเรียง
        Swal.fire({
          title: 'จัดเรียงรูปภาพสำเร็จ',
          text: `รูปภาพถูกจัดเรียงใหม่แล้ว (ตำแหน่ง ${oldIndex + 1} → ${newIndex + 1})`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        return reorderedImages;
      });
    }
  };

  // ข้อมูลสถานีรถไฟฟ้า
  const btsStations = [
    { id: 'kheha', name: 'BTS Kheha (เคหะฯ)', line: 'BTS' },
    { id: 'phraek_sa', name: 'BTS Phraek Sa (แพรกษา)', line: 'BTS' },
    { id: 'sai_luat', name: 'BTS Sai Luat (สายลวด)', line: 'BTS' },
    { id: 'chang_erawan', name: 'BTS Chang Erawan (ช้างเอราวัณ)', line: 'BTS' },
    { id: 'pu_chao', name: 'BTS Pu Chao (ปู่เจ้า)', line: 'BTS' },
    { id: 'samrong', name: 'BTS Samrong (สำโรง)', line: 'BTS' },
    { id: 'bearing', name: 'BTS Bearing (แบริ่ง)', line: 'BTS' },
    { id: 'udom_suk', name: 'BTS Udom Suk (อุดมสุข)', line: 'BTS' },
    { id: 'bang_na', name: 'BTS Bang Na (บางนา)', line: 'BTS' },
    { id: 'punnawithi', name: 'BTS Punnawithi (ปุณณวิถี)', line: 'BTS' },
    { id: 'bang_chak', name: 'BTS Bang Chak (บางจาก)', line: 'BTS' },
    { id: 'on_nut', name: 'BTS On Nut (อ่อนนุช)', line: 'BTS' },
    { id: 'phra_khanong', name: 'BTS Phra Khanong (พระโขนง)', line: 'BTS' },
    { id: 'ekkamai', name: 'BTS Ekkamai (เอกมัย)', line: 'BTS' },
    { id: 'thong_lor', name: 'BTS Thong Lo (ทองหล่อ)', line: 'BTS' },
    { id: 'phrom_phong', name: 'BTS Phrom Phong (พร้อมพงษ์)', line: 'BTS' },
    { id: 'asok', name: 'BTS Asok (อโศก)', line: 'BTS' },
    { id: 'nana', name: 'BTS Nana (นานา)', line: 'BTS' },
    { id: 'phloen_chit', name: 'BTS Phloen Chit (เพลินจิต)', line: 'BTS' },
    { id: 'chit_lom', name: 'BTS Chit Lom (ชิดลม)', line: 'BTS' },
    { id: 'siam', name: 'BTS Siam (สยาม)', line: 'BTS' },
    { id: 'ratchathewi', name: 'BTS Ratchathewi (ราชเทวี)', line: 'BTS' },
    { id: 'phaya_thai', name: 'BTS Phaya Thai (พญาไท)', line: 'BTS' },
    { id: 'victory_monument', name: 'BTS Victory Monument (อนุสาวรีย์ชัยสมรภูมิ)', line: 'BTS' },
    { id: 'sanam_pao', name: 'BTS Sanam Pao (สนามเป้า)', line: 'BTS' },
    { id: 'ari', name: 'BTS Ari (อารีย์)', line: 'BTS' },
    { id: 'saphan_khwai', name: 'BTS Saphan Khwai (สะพานควาย)', line: 'BTS' },
    { id: 'mo_chit', name: 'BTS Mo Chit (หมอชิต)', line: 'BTS' },
    { id: 'ha_yaek_lat_phrao', name: 'BTS Ha Yaek Lat Phrao (ห้าแยกลาดพร้าว)', line: 'BTS' },
    // BTS Silom Line
    { id: 'national_stadium', name: 'BTS National Stadium (สนามกีฬาแห่งชาติ)', line: 'BTS' },
    { id: 'ratchadamri', name: 'BTS Ratchadamri (ราชดำริ)', line: 'BTS' },
    { id: 'sala_daeng', name: 'BTS Sala Daeng (ศาลาแดง)', line: 'BTS' },
    { id: 'chong_nonsi', name: 'BTS Chong Nonsi (ช่องนนทรี)', line: 'BTS' },
    { id: 'saint_louis', name: 'BTS Saint Louis (เซนต์หลุยส์)', line: 'BTS' },
    { id: 'surasak', name: 'BTS Surasak (สุรศักดิ์)', line: 'BTS' },
    { id: 'saphan_taksin', name: 'BTS Saphan Taksin (สะพานตากสิน)', line: 'BTS' },
    { id: 'krung_thon_buri', name: 'BTS Krung Thon Buri (กรุงธนบุรี)', line: 'BTS' },
    { id: 'wongwian_yai', name: 'BTS Wongwian Yai (วงเวียนใหญ่)', line: 'BTS' },
    { id: 'pho_nimit', name: 'BTS Pho Nimit (โพธิ์นิมิตร)', line: 'BTS' },
    { id: 'talat_phlu', name: 'BTS Talat Phlu (ตลาดพลู)', line: 'BTS' },
    { id: 'wutthakat', name: 'BTS Wutthakat (วุฒากาศ)', line: 'BTS' },
    { id: 'bang_wa', name: 'BTS Bang Wa (บางหว้า)', line: 'BTS' },
    { id: 'royal_thai_naval_academy', name: 'BTS Royal Thai Naval Academy (โรงเรียนนายเรือ)', line: 'BTS' },
    { id: 'pak_nam', name: 'BTS Pak Nam (ปากน้ำ)', line: 'BTS' },
    { id: 'srinakarin', name: 'BTS Srinakarin (ศรีนครินทร์)', line: 'BTS' }
  ]

  // ตัวเลือกสถานะผู้ประกาศ
  const announcerOptions = [
    { value: 'owner', label: 'เจ้าของ (Owner)', description: 'เจ้าของคอนโดโดยตรง' },
    { value: 'agent', label: 'ตัวแทนพิเศษ (Exclusive Agent)', description: 'นายหน้าที่ได้รับมอบหมายจากเจ้าของ' }
  ]

  // ตัวเลือกประเภททรัพย์สิน
  const propertyTypeOptions = [
    { value: 'condo', label: 'คอนโด', description: 'คอนโดมิเนียม' },
    { value: 'apartment', label: 'อพาร์ตเมนท์', description: 'อพาร์ตเมนท์' }
  ]

  const mrtStations = [
    { id: 'tha_phra', name: 'MRT Tha Phra (ท่าพระ)', line: 'MRT' },
    { id: 'charan_13', name: 'MRT Charan 13 (จรัญฯ 13)', line: 'MRT' },
    { id: 'fai_chai', name: 'MRT Fai Chai (ไฟฉาย)', line: 'MRT' },
    { id: 'bang_khun_non', name: 'MRT Bang Khun Non (บางขุนนนท์)', line: 'MRT' },
    { id: 'bang_yi_khan', name: 'MRT Bang Yi Khan (บางยี่ขัน)', line: 'MRT' },
    { id: 'sirindhorn', name: 'MRT Sirindhorn (สิรินธร)', line: 'MRT' },
    { id: 'bang_phlat', name: 'MRT Bang Phlat (บางพลัด)', line: 'MRT' },
    { id: 'bang_o', name: 'MRT Bang O (บางอ้อ)', line: 'MRT' },
    { id: 'bang_pho', name: 'MRT Bang Pho (บางโพ)', line: 'MRT' },
    { id: 'tao_pun', name: 'MRT Tao Pun (เตาปูน)', line: 'MRT' },
    { id: 'bang_sue', name: 'MRT Bang Sue (บางซื่อ)', line: 'MRT' },
    { id: 'kamphaeng_phet', name: 'MRT Kamphaeng Phet (กำแพงเพชร)', line: 'MRT' },
    { id: 'chatuchak_park', name: 'MRT Chatuchak Park (สวนจตุจักร)', line: 'MRT' },
    { id: 'phahon_yothin', name: 'MRT Phahon Yothin (พหลโยธิน)', line: 'MRT' },
    { id: 'lat_phrao', name: 'MRT Lat Phrao (ลาดพร้าว)', line: 'MRT' },
    { id: 'ratchadaphisek', name: 'MRT Ratchadaphisek (รัชดาภิเษก)', line: 'MRT' },
    { id: 'sutthisan', name: 'MRT Sutthisan (สุทธิสาร)', line: 'MRT' },
    { id: 'huai_kwang', name: 'MRT Huai Khwang (ห้วยขวาง)', line: 'MRT' },
    { id: 'thailand_cultural_centre', name: 'MRT Thailand Cultural Centre (ศูนย์วัฒนธรรมแห่งประเทศไทย)', line: 'MRT' },
    { id: 'phra_ram_9', name: 'MRT Phra Ram 9 (พระราม 9)', line: 'MRT' },
    { id: 'phetchaburi', name: 'MRT Phetchaburi (เพชรบุรี)', line: 'MRT' },
    { id: 'sukhumvit', name: 'MRT Sukhumvit (สุขุมวิท)', line: 'MRT' },
    { id: 'queen_sirikit_national_convention_centre', name: 'MRT Queen Sirikit National Convention Centre (ศูนย์การประชุมแห่งชาติสิริกิติ์)', line: 'MRT' },
    { id: 'khlong_toei', name: 'MRT Khlong Toei (คลองเตย)', line: 'MRT' },
    { id: 'lumphini', name: 'MRT Lumphini (ลุมพินี)', line: 'MRT' },
    { id: 'silom', name: 'MRT Silom (สีลม)', line: 'MRT' },
    { id: 'sam_yan', name: 'MRT Sam Yan (สามย่าน)', line: 'MRT' },
    { id: 'hua_lamphong', name: 'MRT Hua Lamphong (หัวลำโพง)', line: 'MRT' },
    { id: 'wat_mangkon', name: 'MRT Wat Mangkon (วัดมังกร)', line: 'MRT' },
    { id: 'sam_yot', name: 'MRT Sam Yot (สามยอด)', line: 'MRT' },
    { id: 'sanam_chai', name: 'MRT Sanam Chai (สนามไชย)', line: 'MRT' },
    { id: 'itsaraphap', name: 'MRT Itsaraphap (อิสรภาพ)', line: 'MRT' },
    { id: 'phetkasem_48', name: 'MRT Phetkasem 48 (เพชรเกษม 48)', line: 'MRT' },
    { id: 'phasi_charoen', name: 'MRT Phasi Charoen (ภาษีเจริญ)', line: 'MRT' },
    { id: 'bang_khae', name: 'MRT Bang Khae (บางแค)', line: 'MRT' },
    { id: 'lak_song', name: 'MRT Lak Song (หลักสอง)', line: 'MRT' },
    { id: 'khlong_bang_phai', name: 'MRT Khlong Bang Phai (คลองบางไผ่)', line: 'MRT' },
    { id: 'talad_bang_yai', name: 'MRT Talad Bang Yai (ตลาดบางใหญ่)', line: 'MRT' },
    { id: 'sam_yaek_bang_yai', name: 'MRT Sam Yaek Bang Yai (สามแยกบางใหญ่)', line: 'MRT' },
    { id: 'bang_phlu', name: 'MRT Bang Phlu (บางพลู)', line: 'MRT' },
    { id: 'bang_rak_yai', name: 'MRT Bang Rak Yai (บางรักใหญ่)', line: 'MRT' },
    { id: 'bang_rak_noi_tha_it', name: 'MRT Bang Rak Noi-Tha It (บางรักน้อย-ท่าอิฐ)', line: 'MRT' },
    { id: 'sai_ma', name: 'MRT Sai Ma (ไทรม้า)', line: 'MRT' },
    { id: 'phra_nang_klao_bridge', name: 'MRT Phra Nang Klao Bridge (สะพานพระนั่งเกล้า)', line: 'MRT' },
    { id: 'yaek_nonthaburi_1', name: 'MRT Yaek Nonthaburi 1 (แยกนนทบุรี 1)', line: 'MRT' },
    { id: 'bang_kraso', name: 'MRT Bang Kraso (บางกระสอ)', line: 'MRT' },
    { id: 'nonthaburi_civic_centre', name: 'MRT Nonthaburi Civic Centre (ศูนย์ราชการนนทบุรี)', line: 'MRT' },
    { id: 'ministry_of_public_health', name: 'MRT Ministry of Public Health (กระทรวงสาธารณสุข)', line: 'MRT' },
    { id: 'yaek_tiwanon', name: 'MRT Yaek Tiwanon (แยกติวานนท์)', line: 'MRT' },
    { id: 'wong_sawang', name: 'MRT Wong Sawang (วงศ์สว่าง)', line: 'MRT' },
    { id: 'bang_son', name: 'MRT Bang Son (บางซ่อน)', line: 'MRT' },
    { id: 'parliament_house', name: 'MRT Parliament House (รัฐสภา)', line: 'MRT' },
    { id: 'sri_yan', name: 'MRT Sri Yan (ศรีย่าน)', line: 'MRT' },
    { id: 'vachiraphayaban', name: 'MRT Vachiraphayaban (วชิรพยาบาล)', line: 'MRT' },
    { id: 'national_library', name: 'MRT National Library (หอสมุดแห่งชาติ)', line: 'MRT' },
    { id: 'bang_khun_phrom', name: 'MRT Bang Khun Phrom (บางขุนพรหม)', line: 'MRT' },
    { id: 'democracy_monument', name: 'MRT Democracy Monument (อนุสาวรีย์ประชาธิปไตย)', line: 'MRT' },
    { id: 'saphan_phut', name: 'MRT Saphan Phut (สะพานพุทธฯ)', line: 'MRT' },
    { id: 'sao_ching_cha', name: 'MRT Sao Ching Cha (เสาชิงช้า)', line: 'MRT' },
    { id: 'wat_pho', name: 'MRT Wat Pho (วัดโพธิ์)', line: 'MRT' },
    { id: 'dao_khanong', name: 'MRT Dao Khanong (ดาวคะนอง)', line: 'MRT' },
    { id: 'bang_pakaeo', name: 'MRT Bang Pakaeo (บางปะแก้ว)', line: 'MRT' },
    { id: 'bang_pakok', name: 'MRT Bang Pakok (บางปะกอก)', line: 'MRT' },
    { id: 'yaek_pracha_uthit', name: 'MRT Yaek Pracha Uthit (แยกประชาอุทิศ)', line: 'MRT' },
    { id: 'rat_burana', name: 'MRT Rat Burana (ราษฎร์บูรณะ)', line: 'MRT' },
    { id: 'charoen_nakhon', name: 'MRT Charoen Nakhon (เจริญนคร)', line: 'MRT' },
    { id: 'khlong_san', name: 'MRT Khlong San (คลองสาน)', line: 'MRT' },
    // Blue Line Thonburi side additions
    { id: 'bang_phai', name: 'MRT Bang Phai (บางไผ่)', line: 'MRT' },
    { id: 'bang_wa_mrt', name: 'MRT Bang Wa (บางหว้า)', line: 'MRT' },
    // Yellow Line
    { id: 'phawana', name: 'MRT Phawana (ภาวนา)', line: 'MRT' },
    { id: 'chok_chai_4', name: 'MRT Chok Chai 4 (โชคชัย 4)', line: 'MRT' },
    { id: 'lat_phrao_71', name: 'MRT Lat Phrao 71 (ลาดพร้าว 71)', line: 'MRT' },
    { id: 'lat_phrao_83', name: 'MRT Lat Phrao 83 (ลาดพร้าว 83)', line: 'MRT' },
    { id: 'mahat_thai', name: 'MRT Mahat Thai (มหาดไทย)', line: 'MRT' },
    { id: 'lat_phrao_101', name: 'MRT Lat Phrao 101 (ลาดพร้าว 101)', line: 'MRT' },
    { id: 'bang_kapi', name: 'MRT Bang Kapi (บางกะปิ)', line: 'MRT' },
    { id: 'yaek_lam_sali', name: 'MRT Yaek Lam Sali (แยกลำสาลี)', line: 'MRT' },
    { id: 'si_kritha', name: 'MRT Si Kritha (ศรีกรีฑา)', line: 'MRT' },
    { id: 'hua_mak', name: 'MRT Hua Mak (หัวหมาก)', line: 'MRT' },
    { id: 'kalantan', name: 'MRT Kalantan (กลันตัน)', line: 'MRT' },
    { id: 'si_nut', name: 'MRT Si Nut (ศรีนุช)', line: 'MRT' },
    { id: 'si_phachin', name: 'MRT Si Phachin (ศรีนครินทร์ 38)', line: 'MRT' },
    { id: 'suan_luang_rama_ix', name: 'MRT Suan Luang Rama IX (สวนหลวง ร.9)', line: 'MRT' },
    { id: 'si_udom', name: 'MRT Si Udom (ศรีอุดม)', line: 'MRT' },
    { id: 'si_iam', name: 'MRT Si Iam (ศรีเอี่ยม)', line: 'MRT' },
    { id: 'si_lasalle', name: 'MRT Si La Salle (ศรีลาซาล)', line: 'MRT' },
    { id: 'si_bearing', name: 'MRT Si Bearing (ศรีแบริ่ง)', line: 'MRT' },
    { id: 'si_dan', name: 'MRT Si Dan (ศรีด่าน)', line: 'MRT' },
    { id: 'si_thepha', name: 'MRT Si Thepha (ศรีเทพา)', line: 'MRT' },
    { id: 'thipphawan', name: 'MRT Thipphawan (ทิพพาวัน)', line: 'MRT' },
    { id: 'samrong_yellow', name: 'MRT Samrong (สำโรง)', line: 'MRT' },
    // Pink Line
    { id: 'khae_rai', name: 'MRT Khae Rai (แคราย)', line: 'MRT' },
    { id: 'sanam_bin_nam', name: 'MRT Sanam Bin Nam (สนามบินน้ำ)', line: 'MRT' },
    { id: 'samakkhi', name: 'MRT Samakkhi (สามัคคี)', line: 'MRT' },
    { id: 'royal_irrigation_department', name: 'MRT Royal Irrigation Department (กรมชลประทาน)', line: 'MRT' },
    { id: 'yaek_pak_kret', name: 'MRT Yaek Pak Kret (แยกปากเกร็ด)', line: 'MRT' },
    { id: 'pak_kret_bypass', name: 'MRT Pak Kret Bypass (เลี่ยงเมืองปากเกร็ด)', line: 'MRT' },
    { id: 'chaeng_watthana_pak_kret_28', name: 'MRT Chaeng Watthana - Pak Kret 28 (แจ้งวัฒนะ-ปากเกร็ด 28)', line: 'MRT' },
    { id: 'si_rat', name: 'MRT Si Rat (ศรีรัช)', line: 'MRT' },
    { id: 'muang_thong_thani', name: 'MRT Muang Thong Thani (เมืองทองธานี)', line: 'MRT' },
    { id: 'impact_mueng_thong_thani', name: 'MRT Impact Muang Thong Thani (อิมแพ็ค เมืองทองธานี)', line: 'MRT' },
    { id: 'chaeng_watthana_14', name: 'MRT Chaeng Watthana 14 (แจ้งวัฒนะ 14)', line: 'MRT' },
    { id: 'government_complex', name: 'MRT Government Complex (ศูนย์ราชการแจ้งวัฒนะ)', line: 'MRT' },
    { id: 'national_telecom', name: 'MRT National Telecom (NT) (NT)', line: 'MRT' },
    { id: 'laksi', name: 'MRT Laksi (หลักสี่)', line: 'MRT' },
    { id: 'rajabhat_phranakhon', name: 'MRT Rajabhat Phranakhon (ราชภัฏพระนคร)', line: 'MRT' },
    { id: 'wat_phra_sri_mahathat_mrt', name: 'MRT Wat Phra Sri Mahathat (วัดพระศรีมหาธาตุ)', line: 'MRT' },
    { id: 'ram_inthra_3', name: 'MRT Ram Inthra 3 (รามอินทรา 3)', line: 'MRT' },
    { id: 'lat_pla_khao', name: 'MRT Lat Pla Khao (ลาดปลาเค้า)', line: 'MRT' },
    { id: 'ram_inthra_31', name: 'MRT Ram Inthra 31 (รามอินทรา 31)', line: 'MRT' },
    { id: 'maiyalap', name: 'MRT Maiyalap (มัยลาภ)', line: 'MRT' },
    { id: 'vacharaphol', name: 'MRT Vacharaphol (วัชรพล)', line: 'MRT' },
    { id: 'ram_inthra_40', name: 'MRT Ram Inthra 40 (รามอินทรา 40)', line: 'MRT' },
    { id: 'khubon', name: 'MRT Khubon (คู้บอน)', line: 'MRT' },
    { id: 'ram_inthra_83', name: 'MRT Ram Inthra 83 (รามอินทรา 83)', line: 'MRT' },
    { id: 'fashion_island', name: 'MRT Fashion Island (แฟชั่นไอส์แลนด์)', line: 'MRT' },
    { id: 'salat', name: 'MRT Salat (สลัด)', line: 'MRT' },
    { id: 'noppharat_rajathani', name: 'MRT Noppharat Ratchathani (นพรัตน์ราชธานี)', line: 'MRT' },
    { id: 'bang_chan', name: 'MRT Bang Chan (บางชัน)', line: 'MRT' },
    { id: 'setthabutsab', name: 'MRT Setthabutsan (เศรษฐบุตรบำเพ็ญ)', line: 'MRT' },
    { id: 'min_buri', name: 'MRT Min Buri (มีนบุรี)', line: 'MRT' }
  ];

  const arlStations = [
    { id: 'phaya_thai', name: 'Airport Rail Link Phaya Thai (พญาไท)', line: 'ARL' },
    { id: 'ratchaprarop', name: 'Airport Rail Link Ratchaprarop (ราชปรารภ)', line: 'ARL' },
    { id: 'makkasan', name: 'Airport Rail Link Makkasan (มักกะสัน)', line: 'ARL' },
    { id: 'ramkhamhaeng', name: 'Airport Rail Link Ramkhamhaeng (รามคำแหง)', line: 'ARL' },
    { id: 'huamark', name: 'Airport Rail Link Hua Mak (หัวหมาก)', line: 'ARL' },
    { id: 'ban_thap_chang', name: 'Airport Rail Link Ban Thap Chang (บ้านทับช้าง)', line: 'ARL' },
    { id: 'lat_krabang', name: 'Airport Rail Link Lat Krabang (ลาดกระบัง)', line: 'ARL' },
    { id: 'suvarnabhumi', name: 'Airport Rail Link Suvarnabhumi (สุวรรณภูมิ)', line: 'ARL' }
  ];

  const srtStations = [
    { id: 'rangsit', name: 'SRT Rangsit (รังสิต)', line: 'SRT' },
    { id: 'khlong_rangsit', name: 'SRT Khlong Rangsit (คลองรังสิต)', line: 'SRT' },
    { id: 'lak_hok', name: 'SRT Lak Hok (หลักหก)', line: 'SRT' },
    { id: 'don_mueang', name: 'SRT Don Mueang (ดอนเมือง)', line: 'SRT' },
    { id: 'kan_kheha', name: 'SRT Kan Kheha (การเคหะ)', line: 'SRT' },
    { id: 'lak_si', name: 'SRT Lak Si (หลักสี่)', line: 'SRT' },
    { id: 'thung_song_hong', name: 'SRT Thung Song Hong (ทุ่งสองห้อง)', line: 'SRT' },
    { id: 'bang_khen', name: 'SRT Bang Khen (บางเขน)', line: 'SRT' },
    { id: 'wat_samian_nari', name: 'SRT Wat Samian Nari (วัดเสมียนนารี)', line: 'SRT' },
    { id: 'chatuchak', name: 'SRT Chatuchak (จตุจักร)', line: 'SRT' },
    { id: 'bang_sue_grand', name: 'SRT Bang Sue Grand Station (สถานีกลางกรุงเทพอภิวัฒน์)', line: 'SRT' },
    { id: 'taling_chan', name: 'SRT Taling Chan (ตลิ่งชัน)', line: 'SRT' },
    { id: 'bang_bamru', name: 'SRT Bang Bamru (บางบำหรุ)', line: 'SRT' }
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
    { id: 'smartHomeSystem', label: 'Smart Home System', category: 'technology', icon: 'smart' },
    { id: 'jacuzzi', label: 'Jacuzzi', category: 'luxury', icon: 'jacuzzi' },
    { id: 'parking', label: 'Parking', category: 'parking', icon: 'parking' },
    { id: 'motorcycleParking', label: 'Motorcycle Parking', category: 'parking', icon: 'motorcycle-parking' },
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
      'smart': <RiRemoteControlLine className="w-5 h-5" />,          // Smart Home System
      'jacuzzi': <LiaBathSolid className="w-5 h-5" />,               // Jacuzzi
      'parking': <FaCar className="w-5 h-5" />,                      // Parking
      'motorcycleParking': <FaMotorcycle className="w-5 h-5" />,      // Motorcycle Parking
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
      console.log('🔍 useEffect triggered - isEditing:', isEditing, 'condo:', condo)
      console.log('🔍 condo.id:', condo.id)
      
      // Fetch fresh data from API instead of using passed condo prop
      const fetchCondoData = async () => {
        try {
          console.log('🔄 Fetching fresh condo data from API...')
          console.log('🔄 API call: condoAPI.getById(', condo.id, ')')
          
          // Add cache-busting parameter to ensure fresh data
          const response = await condoAPI.getById(condo.id + '?t=' + Date.now())
          console.log('🔄 API response received:', response)
          
          if (response && response.success && response.data) {
            const freshCondo = response.data
            console.log('✅ Fresh condo data received:', freshCondo)
            console.log('🔍 Key fields from fresh data:')
            console.log('  - announcer_status:', freshCondo.announcer_status)
            console.log('  - property_type:', freshCondo.property_type)
            console.log('  - selected_stations:', freshCondo.selected_stations)
            console.log('🖼️ Image-related fields from fresh data:')
            console.log('  - cover_image:', freshCondo.cover_image)
            console.log('  - cover_public_id:', freshCondo.cover_public_id)
            console.log('  - images:', freshCondo.images)
            console.log('  - floor_plan:', freshCondo.floor_plan)
            console.log('  - floor_plan_public_id:', freshCondo.floor_plan_public_id)
            
            // Map API fields to form fields
            const normalizeSeoTags = (value) => {
              if (!value) return ''
              if (Array.isArray(value)) return value.join(', ')
              if (typeof value === 'string') return value
              return ''
            }

            const newFormData = {
              title: freshCondo.title || '',
              projectCode: freshCondo.project_code || '',
              status: freshCondo.status || 'sale',
              price: freshCondo.price !== undefined && freshCondo.price !== null ? String(freshCondo.price) : '',
              rentPrice: freshCondo.rent_price !== undefined && freshCondo.rent_price !== null ? String(freshCondo.rent_price) : '',
              propertyType: freshCondo.property_type || 'condo', // ประเภททรัพย์สิน
              announcerStatus: freshCondo.announcer_status || 'agent', // เพิ่มการ map ข้อมูลสถานะผู้ประกาศ
              location: freshCondo.location || '',
              googleMapUrl: freshCondo.google_map_url || '',
              nearbyTransport: freshCondo.nearby_transport || '',
              selectedStations: freshCondo.selected_stations || [], // เพิ่มการ map ข้อมูลสถานีรถไฟฟ้า
              listingType: freshCondo.listing_type || 'sale',
              description: freshCondo.description || '',
              area: freshCondo.area !== undefined && freshCondo.area !== null ? String(freshCondo.area) : '',
              bedrooms: freshCondo.bedrooms !== undefined && freshCondo.bedrooms !== null ? String(freshCondo.bedrooms) : '',
              bathrooms: freshCondo.bathrooms !== undefined && freshCondo.bathrooms !== null ? String(freshCondo.bathrooms) : '',
              floor: freshCondo.floor || '',
              pricePerSqm: freshCondo.price_per_sqm !== undefined && freshCondo.price_per_sqm !== null ? String(freshCondo.price_per_sqm) : '',
              rentPricePerSqm: freshCondo.rent_price_per_sqm !== undefined && freshCondo.rent_price_per_sqm !== null ? String(freshCondo.rent_price_per_sqm) : '',
              seoTags: normalizeSeoTags(
                (() => {
                  try {
                    if (typeof freshCondo.seo_tags === 'string' && freshCondo.seo_tags.trim().startsWith('[')) {
                      const parsed = JSON.parse(freshCondo.seo_tags)
                      return Array.isArray(parsed) ? parsed : freshCondo.seo_tags
                    }
                  } catch {}
                  return freshCondo.seo_tags
                })()
              ),
              selectedProject: freshCondo.selected_project || '',
              availableDate: freshCondo.available_date ? freshCondo.available_date.split('T')[0] : '',
              amenities: Array.isArray(freshCondo.amenities) ? freshCondo.amenities : [],
              specialFeatures: (() => {
                try {
                  let features = {};
                  
                  // ถ้าเป็น JSON string ให้ parse
                  if (freshCondo.special_features && typeof freshCondo.special_features === 'string') {
                    features = JSON.parse(freshCondo.special_features);
                  } else if (freshCondo.special_features && typeof freshCondo.special_features === 'object') {
                    features = freshCondo.special_features;
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
              youtubeUrl: freshCondo.youtube_url || '',
              floorPlan: freshCondo.floor_plan ? (() => {
                try {
                  // รูปแบบเป็น JSON string
                  if (typeof freshCondo.floor_plan === 'string') {
                    const raw = freshCondo.floor_plan.trim()
                    if (raw.startsWith('{')) {
                      const parsed = JSON.parse(raw)
                      return {
                        url: parsed.url || '',
                        public_id: parsed.public_id || freshCondo.floor_plan_public_id || null,
                        preview: null
                      }
                    }
                    // รูปแบบเป็น URL string
                    return {
                      url: raw,
                      public_id: freshCondo.floor_plan_public_id || null,
                      preview: null
                    }
                  }
                  // รูปแบบเป็น object
                  if (freshCondo.floor_plan && typeof freshCondo.floor_plan === 'object') {
                    return {
                      url: freshCondo.floor_plan.url || '',
                      public_id: freshCondo.floor_plan.public_id || freshCondo.floor_plan_public_id || null,
                      preview: null
                    }
                  }
                } catch (error) {
                  console.error('Error parsing floor plan:', error)
                }
                return null
              })() : null,
            }
            
            console.log('🔍 New form data to be set:', newFormData)
            console.log('🔍 Key fields in new form data:')
            console.log('  - announcerStatus:', newFormData.announcerStatus)
            console.log('  - propertyType:', newFormData.propertyType)
            console.log('  - selectedStations:', newFormData.selectedStations)
            
            setFormData(prev => {
              console.log('🔍 Previous form data:', prev)
              const updated = { ...prev, ...newFormData }
              console.log('🔍 Updated form data:', updated)
              return updated
            })

            // Sync selected amenities checkboxes
            if (Array.isArray(newFormData.amenities)) {
              setSelectedAmenities(newFormData.amenities)
            }

            // Set cover image
            if (freshCondo.cover_image) {
              console.log('🖼️ Setting cover image:', freshCondo.cover_image)
              setCoverImage({
                url: typeof freshCondo.cover_image === 'string' ? freshCondo.cover_image : (freshCondo.cover_image.url || ''),
                public_id: freshCondo.cover_public_id || (typeof freshCondo.cover_image === 'object' ? freshCondo.cover_image.public_id : null),
                preview: null,
                uploading: false
              })
            } else {
              console.log('⚠️ No cover image found in freshCondo')
            }

            // Set images
            if (freshCondo.images && Array.isArray(freshCondo.images)) {
              console.log('🖼️ Setting images from freshCondo:', freshCondo.images)
              const imageData = freshCondo.images.map(img => ({
                id: img.id || `img-${Date.now()}-${Math.random()}`,
                url: img.url,
                public_id: img.public_id,
                preview: img.url
              }))
              console.log('🖼️ Processed image data:', imageData)
              setImages(imageData)
              // If no explicit cover image, fallback to first gallery image
              if (!freshCondo.cover_image && imageData.length > 0) {
                console.log('🖼️ No explicit cover image, fallback to first image')
                setCoverImage({
                  url: imageData[0].url,
                  public_id: imageData[0].public_id || null,
                  preview: null,
                  uploading: false
                })
              }
            } else {
              console.log('⚠️ No images found in freshCondo:', freshCondo.images)
            }

            // Set floor plan
            if (freshCondo.floor_plan) {
              console.log('📋 Setting floor plan:', freshCondo.floor_plan)
              // Floor plan is already set in formData above
            } else {
              console.log('⚠️ No floor plan found in freshCondo')
            }

            console.log('✅ Form data updated with fresh condo data')
          } else {
            console.error('❌ Failed to fetch fresh condo data:', response)
          }
        } catch (error) {
          console.error('❌ Error fetching fresh condo data:', error)
          // Fallback to using passed condo prop
          console.log('🔄 Falling back to passed condo prop...')
        }
      }

      fetchCondoData()
    }
  }, [isEditing, condo?.id])

  // Debug: Monitor formData changes
  useEffect(() => {
    if (isEditing) {
      console.log('🔍 formData changed - Current values:')
      console.log('  - announcerStatus:', formData.announcerStatus)
      console.log('  - propertyType:', formData.propertyType)
      console.log('  - selectedStations:', formData.selectedStations)
      console.log('  - Full formData object:', formData)
    }
  }, [formData, isEditing])

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
        const response = await fetch('https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api/health', {
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
    console.log(`🔄 handleInputChange called: ${field} = ${value}`)
    console.log(`🔄 Previous formData.${field}:`, formData[field])
    setFormData(prev => {
      const newData = { 
        ...prev, 
        [field]: value,
        updatedAt: new Date().toISOString()
      }
      console.log(`🔄 New formData.${field}:`, newData[field])
      console.log(`🔄 Full new formData:`, newData)
      return newData
    })
    
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
      
      // Upload all valid files at once
      try {
        console.log(`🔄 อัพโหลดไฟล์ ${validFiles.length} ไฟล์พร้อมกัน`)
        
        // Create temporary previews for all files with unique IDs
        const tempImageDataArray = validFiles.map((file, i) => ({
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
          preview: URL.createObjectURL(file),
          url: null,
          public_id: null,
          uploading: true,
          fileName: file.name // Add filename for debugging
        }))
        
        console.log('📸 Temporary images created:', tempImageDataArray.map(img => ({ id: img.id, fileName: img.fileName })))
        setImages(prev => [...prev, ...tempImageDataArray])
        
        // Upload all files to server
        const response = await uploadAPI.uploadMultiple(validFiles)
        
        if (response && response.success && response.data) {
          console.log('📤 Server response:', response.data)
          
          // Process all uploaded images
          response.data.forEach((imageData, i) => {
            const tempImage = tempImageDataArray[i]
            if (!tempImage) {
              console.warn(`⚠️ No temp image found for index ${i}`)
              return
            }
            
            const finalImageData = {
              id: `final-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
              preview: imageData.url,
              url: imageData.url,
              public_id: imageData.public_id,
              uploading: false
            }
            
            console.log(`🔄 Replacing temp image ${tempImage.id} with final image ${finalImageData.id}`)
            
            // Replace temp image with real image
            setImages(prev => {
              const newImages = prev.map(img => 
                img.id === tempImage.id ? finalImageData : img
              )
              console.log('📸 Updated images array:', newImages.map(img => ({ id: img.id, url: img.url ? 'has-url' : 'no-url' })))
              return newImages
            })
          })
          
          uploadedCount = response.data.length
          console.log(`✅ อัพโหลดสำเร็จ ${uploadedCount}/${validFiles.length} ไฟล์`)
        } else {
          throw new Error(response?.message || 'ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์')
        }
        
      } catch (error) {
        console.error(`❌ อัพโหลดล้มเหลว:`, error)
        failedFiles.push(`อัพโหลดล้มเหลว: ${error.message}`)
        failedCount = validFiles.length
        
        // Remove all temp images on error
        setImages(prev => prev.filter(img => !img.uploading))
      }
      
      // Update progress
      setUploadProgress(100)
      
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

    // ไม่บังคับกรอกข้อมูลใดๆ - ให้บันทึกได้แม้ไม่กรอกข้อมูล
    // if (!formData.title) newErrors.title = 'กรุณากรอกชื่อโครงการ'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Helper: sanitize and normalize payload before submit
  const toNumber = (value) => {
    const parsed = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const toInt = (value) => {
    const parsed = typeof value === 'string' ? parseInt(value.replace(/[^\d-]/g, ''), 10) : parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const toArray = (value) => Array.isArray(value) ? value : []
  const toObject = (value) => (value && typeof value === 'object') ? value : {}
  const toStringOrNull = (value) => {
    if (value === null || value === undefined) return null
    const s = String(value).trim()
    return s.length > 0 ? s : null
  }

  // Helper specialized for comma-separated or JSON-string arrays
  const toStringArray = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value.filter(Boolean).map(v => String(v).trim()).filter(Boolean)
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed === '[]') return []
      // Try JSON parse if looks like array
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) return parsed.filter(Boolean).map(v => String(v).trim()).filter(Boolean)
        } catch {}
      }
      // Fallback: comma-separated
      return trimmed.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
  }

  const buildCondoPayload = () => {
    const base = {
      title: toStringOrNull(formData.title),
      status: toStringOrNull(formData.status),
      price: toNumber(formData.price),
      rent_price: toNumber(formData.rentPrice),
      property_type: toStringOrNull(formData.propertyType),
      announcer_status: toStringOrNull(formData.announcerStatus),
      location: toStringOrNull(formData.location),
      google_map_url: toStringOrNull(formData.googleMapUrl),
      nearby_transport: toStringOrNull(formData.nearbyTransport),
      selected_stations: toArray(formData.selectedStations),
      listing_type: toStringOrNull(formData.listingType),
      description: toStringOrNull(formData.description),
      area: toNumber(formData.area),
      bedrooms: toInt(formData.bedrooms),
      bathrooms: toInt(formData.bathrooms),
      floor: toStringOrNull(formData.floor),
      price_per_sqm: toNumber(formData.pricePerSqm),
      rent_price_per_sqm: toNumber(formData.rentPricePerSqm),
      seo_tags: toStringArray(formData.seoTags),
      selected_project: toStringOrNull(formData.selectedProject),
      available_date: toStringOrNull(formData.availableDate),
        images: images.filter(img => img.url && !img.uploading).map(img => ({
          url: img.url,
          public_id: img.public_id
        })),
        cover_image: coverImage?.url || null,
      amenities: toArray(selectedAmenities),
      special_features: toObject(formData.specialFeatures),
      youtube_url: toStringOrNull(formData.youtubeUrl),
      floor_plan: formData.floorPlan || null,
    }
    // Remove null optional fields to avoid backend "required" triggers
    const payload = { ...base }
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null) {
        delete payload[key]
      }
    })
    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setUploading(true)
      
      // Transform and sanitize form data to API format
      const condoData = buildCondoPayload()

      console.log('ข้อมูลที่จะส่งไปยัง backend:', condoData)
      console.log('🎯 สถานะผู้ประกาศ:', formData.announcerStatus)
      console.log('🏠 ประเภททรัพย์สิน:', formData.propertyType)
      console.log('🚇 สถานีรถไฟฟ้าที่เลือก:', formData.selectedStations)
      console.log('🔍 ตรวจสอบ condoData.announcer_status:', condoData.announcer_status)
      console.log('🔍 ตรวจสอบ condoData.property_type:', condoData.property_type)
      console.log('🔍 ตรวจสอบ condoData.selected_stations:', condoData.selected_stations)
      console.log('ราคาขายต่อตารางเมตรที่คำนวณได้:', formData.pricePerSqm)
      console.log('ราคาเช่าต่อตารางเมตรที่คำนวณได้:', formData.rentPricePerSqm)
      console.log('Amenities ที่จะส่งไป:', selectedAmenities)
      console.log('formData.amenities:', formData.amenities)
      console.log('📅 Available date ที่จะส่ง:', formData.availableDate)
      console.log('⭐ Special features ที่จะส่ง:', formData.specialFeatures)
      console.log('📺 YouTube URL ที่จะส่ง:', formData.youtubeUrl)
      console.log('📋 Floor plan ที่จะส่ง:', formData.floorPlan)
      console.log('📋 Floor plan URL ที่จะส่ง:', formData.floorPlan?.url || null)
      console.log('🖼️ All images:', images.map(img => ({
        id: img.id,
        url: img.url,
        public_id: img.public_id,
        uploading: img.uploading
      })))
      console.log('🖼️ Filtered images (with URL and not uploading):', images.filter(img => img.url && !img.uploading).map(img => ({
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
      let message = error.message || 'เกิดข้อผิดพลาด'
      if (error.response?.data) {
        const data = error.response.data
        const backendMsg = data.message || data.error
        const validation = data.errors
        if (validation && typeof validation === 'object') {
          const details = Object.values(validation).flat().join(', ')
          message = backendMsg ? `${backendMsg} - ${details}` : details
        } else if (backendMsg) {
          message = backendMsg
        }
      }
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: message,
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

  // ตรวจสอบข้อมูลใน formData เมื่อ component render
  useEffect(() => {
    if (isEditing && condo) {
      console.log('🔍 useEffect - ข้อมูลใน formData:')
      console.log('🎯 formData.announcerStatus:', formData.announcerStatus)
      console.log('🎯 formData.announcerStatus type:', typeof formData.announcerStatus)
      console.log('🏠 formData.propertyType:', formData.propertyType)
      console.log('🏠 formData.propertyType type:', typeof formData.propertyType)
      console.log('🚇 formData.selectedStations:', formData.selectedStations)
      console.log('🚇 formData.selectedStations type:', typeof formData.selectedStations)
      console.log('🚇 formData.selectedStations isArray:', Array.isArray(formData.selectedStations))
    }
  }, [formData.announcerStatus, formData.propertyType, formData.selectedStations, isEditing, condo])

  // ตรวจสอบการ update state
  useEffect(() => {
    console.log('🔄 State Update - formData changed:')
    console.log('🎯 formData.announcerStatus:', formData.announcerStatus)
    console.log('🏠 formData.propertyType:', formData.propertyType)
    console.log('🚇 formData.selectedStations:', formData.selectedStations)
    console.log('🔄 State Update - formData object:', formData)
  }, [formData])

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
                  const response = await fetch('https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api/health', {
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
                ชื่อโครงการ
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
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700">
                สถานะผู้ประกาศ <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {announcerOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('announcerStatus', option.value)}
                    className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                      formData.announcerStatus === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.announcerStatus === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`}>
                        {formData.announcerStatus === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${
                          formData.announcerStatus === option.value ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-sm ${
                          formData.announcerStatus === option.value ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ประเภททรัพย์สิน */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700">
                ประเภททรัพย์สิน <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('propertyType', option.value)}
                    className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                      formData.propertyType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.propertyType === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`}>
                        {formData.propertyType === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${
                          formData.propertyType === option.value ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-sm ${
                          formData.propertyType === option.value ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* สถานะ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt">
                สถานะ (เลือกประเภท เช่า หรือ ขาย)
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
                ราคา (บาท) {formData.status !== 'rent' && '(กรณีขาย)'}
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
                โลเคชั่น : สถานที่
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
                            onClick={() => handleStationToggle(station.id)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
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
            <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <ReactQuill
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="อธิบายรายละเอียดของคอนโด เช่น สภาพห้อง การตกแต่ง วิวที่ห้อง..."
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                style={{ height: '200px' }}
                className="font-prompt"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">ใช้เครื่องมือด้านบนเพื่อจัดรูปแบบข้อความ</p>
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
                พื้นที่ (ตารางเมตร)
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
                ห้องนอน
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
                ห้องน้ำ
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
                จำนวนชั้นคอนโดต้องเป็น ชั้นที่
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
                โปรเจค
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
                    src={coverImage.url || coverImage.preview}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      console.warn(`❌ Cover image failed to load: ${coverImage.id}`, { url: coverImage.url, preview: coverImage.preview })
                      e.target.style.display = 'none'
                    }}
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
              <p className="text-xs text-gray-500 mt-1">
                💡 หากเลือกรูปมากกว่า 10 รูป ระบบจะแบ่งอัพโหลดเป็นชุดอัตโนมัติ
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="multiple-images"
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files)
                    if (files.length > 100) {
                      Swal.fire({
                        title: 'รูปภาพเกินจำนวนที่กำหนด',
                        text: 'อัปโหลดรูปภาพได้ไม่เกิน 100 รูป',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                      })
                      return
                    }
                    handleMultipleImageUpload(files)
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

            {/* Image Preview Grid with Drag & Drop */}
            {images.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-700">
                      รูปภาพที่เลือก ({images.length} รูป)
                    </p>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {images.length}/100 รูป
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* คำแนะนำการใช้งาน Drag & Drop */}
                    <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>ลากรูปภาพเพื่อจัดเรียงลำดับ</span>
                    </div>
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={images.map(img => `image-${img.id}`)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {images.map((image, index) => (
                        <SortableImage
                          key={`image-${image.id}`}
                          image={image}
                          index={index}
                          onRemove={handleRemoveImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
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
                      const testResponse = await fetch('https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api/upload/test', {
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
                      const testResponse = await fetch('https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/health/cloudinary', {
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