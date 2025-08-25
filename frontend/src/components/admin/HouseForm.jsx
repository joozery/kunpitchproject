import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import Swal from 'sweetalert2'
import {
  ArrowLeft,
  Building,
  MapPin,
  FileText,
  Search,
  Star,
  Camera,
  Upload,
  X,
  DollarSign,
  Calendar,
  Calculator,
  Bath,
  Bed,
  User
} from 'lucide-react'
import { houseAPI, uploadAPI } from '../../lib/api'
import { projectApi } from '../../lib/projectApi'
// Additional icon packs for amenities
import { 
  FaTv, FaWineBottle, FaCouch, FaUtensils, FaSnowflake, FaBath, FaLock, FaWifi, FaCar, FaSwimmingPool, FaSeedling, FaTshirt,
  FaArrowUp, FaMotorcycle, FaShuttleVan, FaBolt, FaVideo, FaDumbbell, FaFutbol, FaTrophy, FaChild, FaFilm, FaPaw, FaUsers,
  FaLaptop, FaHamburger, FaCoffee, FaDoorOpen, FaHome, FaStore, FaBook, FaBuilding, FaGlobe, FaStar, FaFileAlt
} from 'react-icons/fa'
import { MdKitchen, MdMicrowave, MdLocalLaundryService, MdHotTub, MdBalcony, MdCheckroom, MdElevator } from 'react-icons/md'
import { RiHomeWifiLine, RiFilterLine } from 'react-icons/ri'
import { PiCookingPot, PiThermometerHot, PiOven } from 'react-icons/pi'
import { TbAirConditioning } from 'react-icons/tb'
import { LuFan } from 'react-icons/lu'

const HouseForm = ({ initialData = null, onBack, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    title: initialData?.title || '', // ชื่อประกาศ/โครงการ
    projectCode: initialData?.projectCode || '', // รหัสโครงการ (อัตโนมัติ)
    status: initialData?.status || 'sale', // สถานะ: ขาย/เช่า
    price: initialData?.price?.toString() || '', // ราคา (บาท)
    rentPrice: initialData?.rentPrice?.toString() || '', // ราคาเช่า (บาท/เดือน)
    announcerStatus: initialData?.announcerStatus || 'agent', // สถานะผู้ประกาศ: เจ้าของ/นายหน้า
    
    // โลเคชั่น
    location: initialData?.location || '', // สถานที่
    googleMapUrl: initialData?.googleMapUrl || '', // Google Map URL
    nearbyTransport: initialData?.nearby_transport || '', // BTS/MRT/APL/SRT
    selectedStations: initialData?.selected_stations || [], // เพิ่มสถานีที่เลือก
    
    // ประเภททรัพย์
    propertyType: initialData?.property_type || 'house', // house | townhouse | apartment
    
    // รายละเอียด
    description: initialData?.description || '',
    
    // ข้อมูลอสังหาริมทรัพย์
    area: initialData?.area?.toString() || '', // พื้นที่ (ตารางเมตร)
    bedrooms: initialData?.bedrooms?.toString() || '', // ห้องนอน
    bathrooms: initialData?.bathrooms?.toString() || '', // ห้องน้ำ
    floor: initialData?.floor || '', // ชั้นที่
    pricePerSqm: initialData?.pricePerSqm?.toString() || '', // ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
    rentPricePerSqm: initialData?.rentPricePerSqm?.toString() || '', // ราคาเช่าต่อ ตร.ม. (คำนวณอัตโนมัติ)
    landAreaSqWa: initialData?.landAreaSqWa?.toString() || '', // พื้นที่ดิน (ตารางวา)
    
    // SEO
    seoTags: initialData?.seoTags || '',
    // Tag: บ้านมือ 1 (First-hand)
    isNewHouse: Boolean(initialData?.isNewHouse) || false,
    
    // โปรเจค
    selectedProject: initialData?.selected_project || '',
    availableDate: initialData?.available_date || '',
    
    // สิ่งอำนวยความสะดวกภายในห้อง (Amenities)
    amenities: [],
    
    // Special Features
    specialFeatures: {
      shortTerm: initialData?.specialFeatures?.shortTerm || false,
      allowPet: initialData?.specialFeatures?.allowPet || false,
      allowCompanyRegistration: initialData?.specialFeatures?.allowCompanyRegistration || false,
      foreignQuota: initialData?.specialFeatures?.foreignQuota || false,
      penthouse: initialData?.specialFeatures?.penthouse || false,
      luckyNumber: initialData?.specialFeatures?.luckyNumber || false
    },
    
    // Media
    youtubeUrl: initialData?.youtubeUrl || '', // ลิงก์ YouTube
    floorPlan: initialData?.floorPlan || null, // ภาพแปลน
    
    // Timestamps
    createdAt: initialData?.createdAt || new Date().toISOString(),
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedAmenities, setSelectedAmenities] = useState([])

  // State สำหรับการค้นหาสถานี
  const [stationSearchTerm, setStationSearchTerm] = useState('');
  const [showStationDropdown, setShowStationDropdown] = useState(false);

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
    { id: 'phahon_yothin_24', name: 'BTS Phahon Yothin 24 (พหลโยธิน 24)', line: 'BTS' },
    { id: 'ratchayothin', name: 'BTS Ratchayothin (รัชโยธิน)', line: 'BTS' },
    { id: 'sena_nikhom', name: 'BTS Sena Nikhom (เสนานิคม)', line: 'BTS' },
    { id: 'kasetsart_university', name: 'BTS Kasetsart University (มหาวิทยาลัยเกษตรศาสตร์)', line: 'BTS' },
    { id: 'royal_forest_department', name: 'BTS Royal Forest Department (กรมป่าไม้)', line: 'BTS' },
    { id: 'bang_bua', name: 'BTS Bang Bua (บางบัว)', line: 'BTS' },
    { id: '11th_infantry_regiment', name: 'BTS 11th Infantry Regiment (กรมทหารราบที่ 11)', line: 'BTS' },
    { id: 'wat_phra_sri_mahathat', name: 'BTS Wat Phra Sri Mahathat (วัดพระศรีมหาธาตุ)', line: 'BTS' },
    { id: 'phahon_yothin_59', name: 'BTS Phahon Yothin 59 (พหลโยธิน 59)', line: 'BTS' },
    { id: 'sai_yud', name: 'BTS Sai Yud (สายหยุด)', line: 'BTS' },
    { id: 'saphan_mai', name: 'BTS Saphan Mai (สะพานใหม่)', line: 'BTS' },
    { id: 'bhumibol_adulyadej_hospital', name: 'BTS Bhumibol Adulyadej Hospital (โรงพยาบาลภูมิพลอดุลยเดช)', line: 'BTS' },
    { id: 'royal_thai_air_force_museum', name: 'BTS Royal Thai Air Force Museum (พิพิธภัณฑ์กองทัพอากาศ)', line: 'BTS' },
    { id: 'yaek_kor_por_or', name: 'BTS Yaek Kor Por Or (แยก คปอ.)', line: 'BTS' },
    { id: 'khu_khot', name: 'BTS Khu Khot (คูคต)', line: 'BTS' },
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
  ];

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
    // Blue Line Thonburi additions
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

  // Prefill when editing (API data mapping)
  useEffect(() => {
    if (isEditing && initialData) {
      const mappedFacilities = []
      // Normalize amenities from API: accept array or JSON string
      let parsedAmenities = []
      if (Array.isArray(initialData.amenities)) {
        parsedAmenities = initialData.amenities
      } else if (typeof initialData.amenities === 'string') {
        try {
          const maybe = JSON.parse(initialData.amenities)
          parsedAmenities = Array.isArray(maybe) ? maybe : []
        } catch (e) {
          parsedAmenities = []
        }
      }

      setFormData(prev => ({
        ...prev,
        title: initialData.title || '',
        projectCode: initialData.project_code || prev.projectCode,
        status: initialData.status || 'sale',
        price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
        rentPrice: initialData.rent_price !== undefined && initialData.rent_price !== null ? String(initialData.rent_price) : '',
        announcerStatus: initialData.announcer_status || 'agent', // เพิ่มสถานะผู้ประกาศ
        location: initialData.location || '',
        googleMapUrl: initialData.google_map_url || '',
        nearbyTransport: initialData.nearby_transport || '',
        selectedStations: initialData.selected_stations || [], // เพิ่มสถานีที่เลือก
        propertyType: initialData.property_type || 'house',
        description: initialData.description || '',
        area: initialData.area !== undefined && initialData.area !== null ? String(initialData.area) : '',
        bedrooms: initialData.bedrooms !== undefined && initialData.bedrooms !== null ? String(initialData.bedrooms) : '',
        bathrooms: initialData.bathrooms !== undefined && initialData.bathrooms !== null ? String(initialData.bathrooms) : '',
        floor: initialData.floor || '',
        pricePerSqm: initialData.price_per_sqm !== undefined && initialData.price_per_sqm !== null ? String(initialData.price_per_sqm) : '',
        landAreaSqWa: initialData.land_area_sqwa !== undefined && initialData.land_area_sqwa !== null ? String(initialData.land_area_sqwa) : '',
        pricePerSqWa: initialData.price_per_sqwa !== undefined && initialData.price_per_sqwa !== null ? String(initialData.price_per_sqwa) : '',
        rentPricePerSqWa: initialData.rent_price_per_sqwa !== undefined && initialData.rent_price_per_sqwa !== null ? String(initialData.rent_price_per_sqwa) : '',
        seoTags: initialData.seo_tags || '',
        isNewHouse: Boolean(initialData.is_new_house) || false,
        selectedProject: initialData.selected_project || '',
        availableDate: initialData.available_date || '',
        amenities: parsedAmenities,
        
        // เพิ่มฟิลด์ใหม่ที่เพิ่มเข้ามา
        specialFeatures: (() => {
          if (typeof initialData.special_features === 'string') {
            try {
              return JSON.parse(initialData.special_features)
            } catch (e) {
              return {
                shortTerm: false,
                allowPet: false,
                allowCompanyRegistration: false,
                foreignQuota: false,
                penthouse: false,
                luckyNumber: false
              }
            }
          }
          return initialData.special_features || {
            shortTerm: false,
            allowPet: false,
            allowCompanyRegistration: false,
            foreignQuota: false,
            penthouse: false,
            luckyNumber: false
          }
        })(),
        youtubeUrl: initialData.youtube_url || '',
        floorPlan: (() => {
          if (typeof initialData.floor_plan === 'string') {
            try {
              const parsed = JSON.parse(initialData.floor_plan)
              return parsed
            } catch (e) {
              // ถ้าเป็น string ที่ไม่ใช่ JSON ให้ถือว่าเป็น URL
              return initialData.floor_plan ? {
                url: initialData.floor_plan,
                public_id: initialData.floor_plan_public_id || null
              } : null
            }
          }
          return initialData.floor_plan || null
        })(),
        
        createdAt: initialData.created_at || prev.createdAt,
        updatedAt: initialData.updated_at || new Date().toISOString()
      }))

      // จัดการรูปภาพจาก API response
      const coverUrl = initialData.cover_image || null
      if (coverUrl) {
        setCoverImage({
          id: `cover-${Date.now()}`,
          url: coverUrl,
          preview: coverUrl, // backward compatibility with old rendering
          uploading: false
        })
      } else {
        setCoverImage(null)
      }

      const urls = Array.isArray(initialData.images) ? initialData.images : []
      const filtered = coverUrl ? urls.filter(u => u !== coverUrl) : urls
      const mappedImages = filtered.map((url, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url,
        preview: url, // backward compatibility with old rendering
        uploading: false
      }))
      setImages(mappedImages)

      // จัดการ amenities
      setSelectedAmenities(parsedAmenities)
    }
  }, [isEditing, initialData])

  // Fetch projects (like CondoForm)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true)
        const response = await projectApi.getAll()
        const rawList = Array.isArray(response.data) ? response.data : (response.data?.items || [])
        const formatted = rawList.map(p => ({
          id: p.id.toString(),
          name: p.name_th || p.name_en || p.name || 'ไม่ระบุชื่อ',
          location: `${p.district || ''}${p.district && p.province ? ', ' : ''}${p.province || ''}`.replace(/^,\s*|,\s*$/g, ''),
          developer: p.developer || ''
        }))
        setProjects(formatted)
        setFilteredProjects(formatted)
      } catch (e) {
        setProjects([])
        setFilteredProjects([])
      } finally {
        setProjectsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filter projects
  useEffect(() => {
    if (!projectSearchTerm.trim()) setFilteredProjects(projects)
    else {
      const kw = projectSearchTerm.toLowerCase()
      setFilteredProjects(projects.filter(p => (
        p.name.toLowerCase().includes(kw) ||
        p.location.toLowerCase().includes(kw) ||
        p.developer.toLowerCase().includes(kw)
      )))
    }
  }, [projectSearchTerm, projects])

  // Selected project info
  useEffect(() => {
    if (formData.selectedProject) {
      setSelectedProjectInfo(projects.find(p => p.id === formData.selectedProject) || null)
    } else setSelectedProjectInfo(null)
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
  }

  // Auto calculate sale price per sqm
  useEffect(() => {
    if (formData.area && formData.price) {
      const area = parseFloat(formData.area)
      const price = parseFloat(formData.price)
      if (!isNaN(area) && !isNaN(price) && area > 0 && price > 0) {
        const pricePerSqm = (price / area).toFixed(2)
        setFormData(prev => ({ ...prev, pricePerSqm }))
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
      } else if (!formData.rentPrice || formData.rentPrice === '') {
        setFormData(prev => ({ ...prev, rentPricePerSqm: '' }))
      }
    }
  }, [formData.rentPrice, formData.area])



  // Convert API facilities to component format
  // removed facilities block (like CondoForm)
  // Calculate per square wa (land)
  useEffect(() => {
    if (formData.landAreaSqWa && formData.price) {
      const sqwa = parseFloat(formData.landAreaSqWa)
      const price = parseFloat(formData.price)
      if (!isNaN(sqwa) && !isNaN(price) && sqwa > 0 && price > 0) {
        const pricePerSqWa = (price / sqwa).toFixed(2)
        setFormData(prev => ({ ...prev, pricePerSqWa }))
      } else if (!formData.price || !formData.landAreaSqWa) {
        setFormData(prev => ({ ...prev, pricePerSqWa: '' }))
      }
    }
  }, [formData.price, formData.landAreaSqWa])

  useEffect(() => {
    if (formData.landAreaSqWa && formData.rentPrice) {
      const sqwa = parseFloat(formData.landAreaSqWa)
      const rent = parseFloat(formData.rentPrice)
      if (!isNaN(sqwa) && !isNaN(rent) && sqwa > 0 && rent > 0) {
        const rentPricePerSqWa = (rent / sqwa).toFixed(2)
        setFormData(prev => ({ ...prev, rentPricePerSqWa }))
      } else if (!formData.rentPrice || !formData.landAreaSqWa) {
        setFormData(prev => ({ ...prev, rentPricePerSqWa: '' }))
      }
    }
  }, [formData.rentPrice, formData.landAreaSqWa])

  // อัปเดต formData.amenities เมื่อ selectedAmenities เปลี่ยน
  useEffect(() => {
    if (selectedAmenities && Array.isArray(selectedAmenities)) {
      setFormData(prev => ({
        ...prev,
        amenities: selectedAmenities
      }))
    }
  }, [selectedAmenities])

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

  // ฟังก์ชันสำหรับจัดการ Special Features
  const handleSpecialFeatureChange = (featureId, checked) => {
    setFormData(prev => ({
      ...prev,
      specialFeatures: {
        ...(prev.specialFeatures || {}),
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
          Swal.fire({
            icon: 'error',
            title: 'ไฟล์ใหญ่เกินไป',
            text: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#ef4444'
          });
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          Swal.fire({
            icon: 'error',
            title: 'ไฟล์ไม่ถูกต้อง',
            text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#ef4444'
          });
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
            Swal.fire({
              icon: 'success',
              title: 'อัพโหลดสำเร็จ!',
              text: 'อัพโหลดภาพแปลนเรียบร้อยแล้ว',
              timer: 2000,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'อัพโหลดไม่สำเร็จ',
              text: 'อัพโหลด Floor Plan ไม่สำเร็จ: ' + response.message,
              confirmButtonText: 'ตกลง',
              confirmButtonColor: '#ef4444'
            });
          }
        } catch (error) {
          console.error('❌ อัพโหลด Floor Plan error:', error);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'อัพโหลด Floor Plan ไม่สำเร็จ: ' + error.message,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#ef4444'
          });
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };



  // removed facility toggle (facilities section deleted)

  // Handle multiple image uploads
  const handleMultipleImageUpload = async (files) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      
      const totalFiles = files.length
      let uploadedCount = 0
      
      for (const file of files) {
        try {
          await handleImageUpload(file, false)
          uploadedCount++
          setUploadProgress((uploadedCount / totalFiles) * 100)
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          // Continue with other files
        }
      }
      
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 2000) // Hide progress after 2 seconds
    } catch (error) {
      console.error('Error uploading multiple images:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (file, isCover = false) => {
    try {
      setUploading(true)
      
      // อัพโหลดไป Cloudinary ผ่าน API
      const result = await uploadAPI.uploadSingle(file)
      const uploaded = result?.data || result // interceptor returns response.data; guard for shape
      const imageUrl = uploaded.url
      const publicId = uploaded.public_id
      
      const imageData = {
        id: Date.now().toString(),
        url: imageUrl,
        preview: imageUrl, // backward compatibility with old rendering
        public_id: publicId,
        uploading: false,
        file
      }

      if (isCover) {
        setCoverImage(imageData)
      } else {
        setImages(prev => [...prev, imageData])
      }
      
      console.log('อัพโหลดรูปภาพสำเร็จ:', uploaded)
    } catch (error) {
      console.error('Error uploading image:', error)
      Swal.fire({
        icon: 'error',
        title: 'อัพโหลดไม่สำเร็จ',
        text: `อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageId, isCover = false) => {
    try {
      let imageToRemove = null;
      
      if (isCover) {
        imageToRemove = coverImage;
        setCoverImage(null);
      } else {
        imageToRemove = images.find(img => img.id === imageId);
        setImages(prev => prev.filter(img => img.id !== imageId));
      }
      
      // ลบรูปจาก Cloudinary ถ้ามี public_id
      if (imageToRemove && imageToRemove.public_id) {
        try {
          await uploadAPI.delete(imageToRemove.public_id);
          console.log('ลบรูปจาก Cloudinary สำเร็จ:', imageToRemove.public_id);
        } catch (error) {
          console.error('ไม่สามารถลบรูปจาก Cloudinary:', error);
          // ไม่ต้องแสดง error ให้ user เพราะรูปหายจาก UI แล้ว
        }
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title) newErrors.title = 'กรุณากรอกชื่อโครงการ'
    if (!formData.status) newErrors.status = 'กรุณาเลือกสถานะ'
    if (!formData.price && formData.status !== 'rent') newErrors.price = 'กรุณากรอกราคา'
    if (!formData.location) newErrors.location = 'กรุณากรอกสถานที่'
    if (!formData.area) newErrors.area = 'กรุณากรอกพื้นที่'
    if (!formData.bedrooms) newErrors.bedrooms = 'กรุณากรอกจำนวนห้องนอน'
    if (!formData.bathrooms) newErrors.bathrooms = 'กรุณากรอกจำนวนห้องน้ำ'
    if (!formData.floor) newErrors.floor = 'กรุณากรอกชั้นที่'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
      return
    }

    try {
      setLoading(true)
      
      // แปลงข้อมูลให้ตรงกับ backend API
      const houseData = {
        title: formData.title,
        status: formData.status,
        price: parseFloat(formData.price) || 0,
        rent_price: parseFloat(formData.rentPrice) || 0,
        announcer_status: formData.announcerStatus, // เพิ่มสถานะผู้ประกาศ
        location: formData.location,
        google_map_url: formData.googleMapUrl,
        nearby_transport: formData.nearbyTransport,
        selected_stations: formData.selectedStations, // เพิ่มสถานีที่เลือก
        listing_type: formData.status, // ใช้ status เป็น listing_type
        property_type: formData.propertyType,
        description: formData.description,
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        floor: formData.floor,
        price_per_sqm: parseFloat(formData.pricePerSqm) || 0,
        land_area_sqwa: parseFloat(formData.landAreaSqWa) || null,
        price_per_sqwa: parseFloat(formData.pricePerSqWa) || null,
        rent_price_per_sqwa: parseFloat(formData.rentPricePerSqWa) || null,
        seo_tags: formData.seoTags,
        is_new_house: Boolean(formData.isNewHouse),
        project_code: formData.projectCode, // ส่งรหัสโครงการที่สร้าง WSxxx ไปเก็บ
        selected_project: formData.selectedProject,
        available_date: formData.availableDate,
        amenities: selectedAmenities,
        special_features: formData.specialFeatures, // เพิ่ม Special Features
        youtube_url: formData.youtubeUrl, // เพิ่ม YouTube URL
        floor_plan: (() => {
          if (typeof formData.floorPlan === 'object' && formData.floorPlan !== null) {
            return {
              url: formData.floorPlan.url,
              public_id: formData.floorPlan.public_id
            }
          }
          return formData.floorPlan
        })(), // เพิ่ม Floor Plan
        images: images.map(img => ({ 
          url: img.url, 
          public_id: img.public_id || null 
        })),
        cover_image: coverImage?.url || null
      }



      if (isEditing) {
        // แก้ไขบ้าน
        const result = await houseAPI.update(initialData.id, houseData)

        Swal.fire({
          icon: 'success',
          title: 'แก้ไขสำเร็จ!',
          text: 'แก้ไขประกาศบ้านเรียบร้อยแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // สร้างบ้านใหม่
        const result = await houseAPI.create(houseData)

        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสำเร็จ!',
          text: 'เพิ่มประกาศบ้านเรียบร้อยแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
      }

      if (onSave) {
        onSave(houseData)
      }

      if (onBack) {
        onBack()
      }
    } catch (error) {
      console.error('Error saving house:', error)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: `เกิดข้อผิดพลาด: ${error.message}`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={async () => {
              const result = await Swal.fire({
                title: 'ยืนยันการกลับ',
                text: 'คุณต้องการกลับไปหน้าจัดการบ้านหรือไม่? ข้อมูลที่กรอกจะหายไป',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'กลับ',
                cancelButtonText: 'ทำงานต่อ'
              });

              if (result.isConfirmed) {
                onBack();
              }
            }}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับ</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-prompt">
              {isEditing ? 'แก้ไขประกาศบ้าน' : 'เพิ่มบ้านเดี่ยว/ทาวน์เฮาส์'}
            </h1>
            <p className="text-gray-600 font-prompt mt-1">
              กรอกข้อมูลอสังหาให้ครบถ้วน
            </p>
          </div>
        </div>
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
                ชื่อประกาศ/โครงการ *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="เช่น บ้านเดี่ยว โครงการ ABC, ทาวน์เฮาส์ทำเลดี, อพาร์ตเมนต์ใกล้ BTS"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* รหัสโครงการ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                รหัสโครงการ (ตัวเลขอัตโนมัติ)
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
                เลือกสถานะของผู้ประกาศ: เจ้าของบ้าน หรือ ตัวแทนพิเศษอสังหาริมทรัพย์
              </p>
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
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* ประเภททรัพย์ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt">
                ประเภททรัพย์ *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'house', label: 'บ้านเดี่ยว', icon: Building, color: 'from-orange-500 to-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
                  { value: 'townhouse', label: 'ทาวน์เฮาส์', icon: Building, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' }
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
                          ? 'bg-white/80 scale-110' 
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
                  className={errors.price ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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

      {/* โปรเจคและวันที่ว่าง */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
          <Building className="h-6 w-6 mr-3 text-blue-600" />
          โปรเจคและวันที่ว่าง
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* โปรเจค */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">โปรเจค</label>
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
                    setFormData(prev => ({ ...prev, selectedProject: first.id }))
                    setIsProjectDropdownOpen(false)
                  }
                  if (e.key === 'Escape') setIsProjectDropdownOpen(false)
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
                  <span className="truncate">{selectedProjectInfo ? `${selectedProjectInfo.name} - ${selectedProjectInfo.location}` : '-- เลือกโปรเจคที่บ้านนี้อยู่ --'}</span>
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
                            setFormData(prev => ({ ...prev, selectedProject: project.id }))
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
                  <p className="text-sm text-gray-500 mt-1">พบ {filteredProjects.length} โปรเจค จาก {projects.length} โปรเจค</p>
                )}
              </div>
            )}

            {selectedProjectInfo && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 font-prompt">✅ เลือกแล้ว: {selectedProjectInfo.name}</h4>
                <p className="text-sm text-blue-600 mt-1">📍 {selectedProjectInfo.location}</p>
                {selectedProjectInfo.developer && <p className="text-sm text-blue-600">🏢 ผู้พัฒนา: {selectedProjectInfo.developer}</p>}
              </div>
            )}
          </div>

          {/* วันที่ว่าง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">วันที่ว่าง</label>
            <Input
              type="date"
              value={formData.availableDate}
              onChange={(e) => setFormData(prev => ({ ...prev, availableDate: e.target.value }))}
              placeholder="เลือกวันที่ว่าง"
            />
            <p className="text-sm text-gray-500 mt-1">วันที่ที่บ้านจะว่างพร้อมเข้าอยู่</p>
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
                  className={errors.location ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
                placeholder="อธิบายรายละเอียด เช่น สภาพบ้าน การตกแต่ง ทำเล สิ่งอำนวยความสะดวก..."
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
                 พื้นที่ (ตารางเมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="เช่น 65.5"
                  className={errors.area ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ม.</span>
                </div>
              </div>
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            {/* พื้นที่ดิน (ตารางวา) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                 พื้นที่ดิน (ตารางวา)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.landAreaSqWa}
                  onChange={(e) => handleInputChange('landAreaSqWa', e.target.value)}
                  placeholder="เช่น 50"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ว.</span>
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
                  className={errors.bedrooms ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Bed className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
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
                  className={errors.bathrooms ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Bath className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
            </div>

            {/* จำนวนชั้น */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                 จำนวนชั้น
              </label>
              <div className="relative">
                <Input
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  placeholder="เช่น 2"
                  className={errors.floor ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
            </div>

            {/* ราคาขาย/เช่าต่อ ตร.ม. */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      ✅ คำนวณจากราคาขาย = ฿{parseFloat(formData.pricePerSqm).toLocaleString('th-TH')}
                      {' '} /ตร.ม.
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

              {/* ตัวอย่างการคำนวณ */}
              <div className="md:col-span-2">
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">ตัวอย่างการคำนวณ:</h4>
                  {formData.status === 'rent' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาเช่า: 25,000 บาท/เดือน ÷ 47.48 ตารางเมตร = 526.54 บาท/ตร.ม./เดือน
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาเช่า ÷ พื้นที่ = ราคาต่อตารางเมตรต่อเดือน</p>
                    </div>
                  ) : formData.status === 'sale' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาขาย: 4,800,000 บาท ÷ 47.48 ตารางเมตร = 101,095.95 บาท/ตร.ม.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาขาย ÷ พื้นที่ = ราคาต่อตารางเมตร</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-blue-700">48,000 บาท ÷ 47.48 ตารางเมตร = 1,010.95 บาท/ตร.ม.</p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคา ÷ พื้นที่ = ราคาต่อตารางเมตร</p>
                    </div>
                  )}
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-700">
                      💡 <strong>หมายเหตุ:</strong> ระบบจะคำนวณอัตโนมัติเมื่อกรอกข้อมูลครบถ้วน
                      {formData.status === 'rent' && ' (ราคาเช่าต่อเดือน)'}
                      {formData.status === 'sale' && ' (ราคาขาย)'}
                      {formData.status === 'both' && ' (ราคาขายหรือราคาเช่า)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ราคาต่อ ตร.ว. (ขาย/เช่า) */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">ราคาขายต่อ ตร.ว. (คำนวณอัตโนมัติ)</label>
                <Input
                  value={formData.pricePerSqWa ? `฿${parseFloat(formData.pricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว.` : ''}
                  readOnly
                  className="bg-green-50 border-green-200 text-green-700 font-semibold"
                  placeholder="จะคำนวณจากราคาขาย ÷ พื้นที่ดิน (ตร.ว.)"
                />
                {formData.pricePerSqWa && (
                  <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-xs text-green-700">
                      ✅ คำนวณแล้ว: จากราคาขาย ÷ พื้นที่ดิน (ตร.ว.) = ฿{parseFloat(formData.pricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">ราคาเช่าต่อ ตร.ว. (คำนวณอัตโนมัติ)</label>
                <Input
                  value={formData.rentPricePerSqWa ? `฿${parseFloat(formData.rentPricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว./เดือน` : ''}
                  readOnly
                  className="bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                  placeholder="จะคำนวณจากราคาเช่า ÷ พื้นที่ดิน (ตร.ว.)"
                />
                {formData.rentPricePerSqWa && (
                  <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-700">
                      ✅ คำนวณแล้ว: จากราคาเช่า ÷ พื้นที่ดิน (ตร.ว.) = ฿{parseFloat(formData.rentPricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว./เดือน
                    </p>
                  </div>
                )}
              </div>
              {/* ตัวอย่างการคำนวณ ตร.ว. */}
              <div className="md:col-span-2">
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">ตัวอย่างการคำนวณ:</h4>
                  {formData.status === 'rent' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาเช่า: {formData.rentPrice ? parseFloat(formData.rentPrice).toLocaleString('th-TH') : '—'} บาท/เดือน ÷ {formData.landAreaSqWa || '—'} ตารางวา = {formData.rentPrice && formData.landAreaSqWa ? (parseFloat(formData.rentPrice) / parseFloat(formData.landAreaSqWa)).toFixed(2) : '—'} บาท/ตร.ว./เดือน
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาเช่า ÷ พื้นที่ดิน (ตร.ว.) = ราคาเช่าต่อ ตร.ว.</p>
                    </div>
                  ) : formData.status === 'sale' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาขาย: {formData.price ? parseFloat(formData.price).toLocaleString('th-TH') : '—'} บาท ÷ {formData.landAreaSqWa || '—'} ตารางวา = {formData.price && formData.landAreaSqWa ? (parseFloat(formData.price) / parseFloat(formData.landAreaSqWa)).toFixed(2) : '—'} บาท/ตร.ว.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาขาย ÷ พื้นที่ดิน (ตร.ว.) = ราคาขายต่อ ตร.ว.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-blue-700">
                        {formData.price ? parseFloat(formData.price).toLocaleString('th-TH') : '—'} บาท ÷ {formData.landAreaSqWa || '—'} ตารางวา = {formData.price && formData.landAreaSqWa ? (parseFloat(formData.price) / parseFloat(formData.landAreaSqWa)).toFixed(2) : '—'} บาท/ตร.ว.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคา ÷ พื้นที่ดิน (ตร.ว.) = ราคา/เช่าต่อ ตร.ว.</p>
                    </div>
                  )}
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-700">
                      💡 <strong>หมายเหตุ:</strong> ระบบจะคำนวณอัตโนมัติเมื่อกรอกข้อมูลครบถ้วน (ราคาขาย/เช่า + พื้นที่ดินเป็น ตร.ว.)
                    </p>
                  </div>
                </div>
              </div>
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
              placeholder="เช่น บ้าน, รามคำแหง, ลุมพินี, ขาย, เช่า"
            />
            <p className="text-sm text-gray-500 mt-1">ช่องให้กรอก tag สำหรับ SEO (แยกแท็กด้วยเครื่องหมายจุลภาค)</p>
          </div>
        </Card>

        {/* Special Features */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Star className="h-6 w-6 mr-3 text-blue-600" />
            Special Features
          </h2>
          
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
                  checked={formData.specialFeatures && formData.specialFeatures[feature.id] ? true : false}
                  onChange={(e) => handleSpecialFeatureChange(feature.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <feature.icon className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700 font-prompt">{feature.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* YouTube URL */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <FaVideo className="h-6 w-6 mr-3 text-red-500" />
            ลิงก์ YouTube
          </h2>
          
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
            <p className="text-sm text-gray-500 mt-1">ลิงก์ YouTube สำหรับแสดงวิดีโอของบ้าน</p>
          </div>
        </Card>

        {/* Floor Plan */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <FaFileAlt className="h-6 w-6 mr-3 text-blue-600" />
            ภาพแปลน (Floor Plan)
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
              ภาพแปลน (Floor Plan)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {formData.floorPlan ? (
                <div className="space-y-3">
                  <img 
                    src={typeof formData.floorPlan === 'string' ? formData.floorPlan : (formData.floorPlan.preview || formData.floorPlan.url)} 
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
                                            onClick={async () => {
                        const result = await Swal.fire({
          title: 'ยืนยันการลบ',
          text: 'คุณต้องการลบภาพแปลนนี้หรือไม่?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'ลบ',
          cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
          setFormData(prev => ({ ...prev, floorPlan: null }))
          Swal.fire({
            icon: 'success',
            title: 'ลบสำเร็จ!',
            text: 'ลบภาพแปลนเรียบร้อยแล้ว',
            timer: 1500,
            showConfirmButton: false
          });
        }
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
        </Card>

        {/* แท็กเพิ่มเติม */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            แท็กเพิ่มเติม
          </h2>
          <div>
            {/* Tag: บ้านมือ 1 (First-hand) */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isNewHouse}
                onChange={(e) => handleInputChange('isNewHouse', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 font-prompt">บ้านมือ 1 (First-hand)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">เลือกเมื่อเป็นบ้านใหม่ไม่เคยอยู่อาศัย</p>
          </div>
        </Card>

        {/* สิ่งอำนวยความสะดวกภายในห้อง (Amenities) */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Star className="h-6 w-6 mr-3 text-blue-600" />
            สิ่งอำนวยความสะดวกภายในห้อง
          </h2>
          

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenitiesList.map((amenity) => (
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
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(coverImage.id, true)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                 <label className="cursor-pointer block text-center hover:bg-gray-50 rounded-lg p-4 transition-colors">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <span className="text-gray-600 font-prompt font-medium">คลิกเพื่อเลือกรูปภาพหน้าปก</span>
                  <p className="text-sm text-gray-500 mt-2">รองรับไฟล์ JPG, PNG, WebP</p>
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
                      src={image.url || image.preview}
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
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
                อัปโหลดแล้ว {images.length}/100 รูป
              </span>
              {uploading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="font-prompt">กำลังอัปโหลด...</span>
                </div>
              )}
            </div>
            
            {images.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                                  onClick={async () => {
                  const result = await Swal.fire({
                    title: 'ยืนยันการลบ',
                    text: 'คุณต้องการลบรูปภาพทั้งหมดใช่หรือไม่?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'ลบทั้งหมด',
                    cancelButtonText: 'ยกเลิก'
                  });

                  if (result.isConfirmed) {
                    setImages([])
                    Swal.fire({
                      icon: 'success',
                      title: 'ลบสำเร็จ!',
                      text: 'ลบรูปภาพทั้งหมดเรียบร้อยแล้ว',
                      timer: 1500,
                      showConfirmButton: false
                    });
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
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-prompt">
              <span className="font-medium">💡 คำแนะนำ:</span> รูปภาพหน้าปกจะแสดงเป็นรูปหลักในรายการ 
              รูปภาพเพิ่มเติมจะแสดงในแกลลอรี่ของประกาศ สามารถอัปโหลดได้สูงสุด 100 รูป
            </p>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              const result = await Swal.fire({
                title: 'ยืนยันการยกเลิก',
                text: 'คุณต้องการยกเลิกการทำงานนี้หรือไม่? ข้อมูลที่กรอกจะหายไป',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'ยกเลิก',
                cancelButtonText: 'กลับไปทำงานต่อ'
              });

              if (result.isConfirmed) {
                onBack();
              }
            }}
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

export default HouseForm