import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
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
  Store,
  Home,
  User
} from 'lucide-react'
// New icons for facilities
import { FaCar } from 'react-icons/fa'
import { LuCctv } from 'react-icons/lu'
import { MdElevator, MdOutlineWifiPassword, MdElectricBolt } from 'react-icons/md'
import { TbAirConditioning } from 'react-icons/tb'
import { IoWater } from 'react-icons/io5'
import { RiAlarmWarningFill } from 'react-icons/ri'
import { SiGooglecloudstorage } from 'react-icons/si'
import { FaToiletPortable, FaRegTrashCan } from 'react-icons/fa6'
import { BiSolidUniversalAccess } from 'react-icons/bi'
import { FacilityIcons } from '../icons/FacilityIcons'
import { commercialApi } from '../../lib/projectApi'
import { uploadAPI } from '../../lib/api'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// ฟังก์ชันสร้างรหัสโครงการอัตโนมัติ
const generateProjectCode = () => {
  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `WS${timestamp.toString().slice(-4)}${randomNum}` // รหัส WS + ตัวเลข 7 หลัก
}

// Mock data สำหรับ facilities (ไม่ต้องเชื่อมต่อ API)
const mockFacilities = [
  { id: 'parking', label: 'Parking', icon: FaCar, category: 'parking' },
  { id: 'security_cctv', label: 'Security with CCTV', icon: LuCctv, category: 'security' },
  { id: 'elevator', label: 'Lift', icon: MdElevator, category: 'building' },
  { id: 'air_conditioning', label: 'Air Conditioner', icon: TbAirConditioning, category: 'building' },
  { id: 'internet', label: 'Internet / Wi-Fi', icon: MdOutlineWifiPassword, category: 'technology' },
  { id: 'water_supply', label: 'Water supply system', icon: IoWater, category: 'utility' },
  { id: 'electricity', label: 'Electrical system', icon: MdElectricBolt, category: 'utility' },
  { id: 'toilet', label: 'Toilet', icon: FaToiletPortable, category: 'utility' },
  { id: 'alarm', label: 'Alarm', icon: RiAlarmWarningFill, category: 'safety' },
  { id: 'access_control', label: 'Access Control', icon: BiSolidUniversalAccess, category: 'security' },
  { id: 'storage', label: 'พื้นที่เก็บของ', icon: SiGooglecloudstorage, category: 'aesthetic' },
  { id: 'waste_management', label: 'ระบบจัดการขยะ', icon: FaRegTrashCan, category: 'utility' },
]

const CommercialForm = ({ commercial = null, onBack, onSave, isEditing = false, id = null }) => {
  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    title: commercial?.title || '', // ชื่อโครงการ
    projectCode: commercial?.projectCode || generateProjectCode(), // รหัสโครงการ (อัตโนมัติ)
    announcerStatus: commercial?.announcerStatus || 'agent', // สถานะผู้ประกาศ: เจ้าของ/นายหน้า
    status: commercial?.status || 'sale', // สถานะ: ขาย/เช่า
    price: commercial?.price?.toString() || '', // ราคา (บาท)
    rentPrice: commercial?.rentPrice?.toString() || '', // ราคาเช่า (บาท/เดือน)
    
    // ประเภททรัพย์
    propertyType: commercial?.propertyType || 'shop_house', // โฮมออฟฟิศ/ตึกแถว
    buildingType: commercial?.buildingType || 'shop_house', // ประเภทอาคาร

    
    // โลเคชั่น
    location: commercial?.location || '', // สถานที่
    district: commercial?.district || '', // เขต
    province: commercial?.province || '', // จังหวัด
    postalCode: commercial?.postalCode || '', // รหัสไปรษณีย์
    googleMapUrl: commercial?.googleMapUrl || '', // Google Map URL
    nearbyTransport: commercial?.nearbyTransport || '', // BTS/MRT/APL/SRT
    
    // ประเภท
    listingType: commercial?.listingType || 'sale', // ขาย/เช่า
    
    // รายละเอียด
    description: commercial?.description || '',
    
    // ข้อมูลอสังหาริมทรัพย์
    area: commercial?.area?.toString() || '', // พื้นที่ (ตารางเมตร)
    landArea: commercial?.landArea?.toString() || '', // พื้นที่ดิน (ตารางเมตร)
    buildingArea: commercial?.buildingArea?.toString() || '', // พื้นที่อาคาร (ตารางเมตร)
    floors: commercial?.floors?.toString() || '', // จำนวนชั้น
    floorHeight: commercial?.floorHeight?.toString() || '', // ความสูงชั้น (เมตร)
    parkingSpaces: commercial?.parkingSpaces?.toString() || '', // ที่จอดรถ
    pricePerSqm: commercial?.pricePerSqm?.toString() || '', // ราคาต่อ ตร.ม. (คำนวณอัตโนมัติ)
    
    // ข้อมูลการใช้งาน
    frontage: commercial?.frontage?.toString() || '', // หน้ากว้าง (เมตร)
    depth: commercial?.depth?.toString() || '', // ความลึก (เมตร)
    roadWidth: commercial?.roadWidth?.toString() || '', // ความกว้างถนน (เมตร)
    zoning: commercial?.zoning || '', // โซนนิ่ง
    buildingAge: commercial?.buildingAge?.toString() || '', // อายุอาคาร (ปี)
    
    // ข้อมูลเฉพาะโฮมออฟฟิศ/ตึกแถว
    shopFront: commercial?.shopFront?.toString() || '', // หน้าร้าน (เมตร)
    shopDepth: commercial?.shopDepth?.toString() || '', // ความลึกร้าน (เมตร)
    hasMezzanine: commercial?.hasMezzanine || false, // มีชั้นลอย
    mezzanineArea: commercial?.mezzanineArea?.toString() || '', // พื้นที่ชั้นลอย
    hasBasement: commercial?.hasBasement || false, // มีชั้นใต้ดิน
    basementArea: commercial?.basementArea?.toString() || '', // พื้นที่ชั้นใต้ดิน
    hasWarehouse: commercial?.hasWarehouse || false, // มีโกดัง
    warehouseArea: commercial?.warehouseArea?.toString() || '', // พื้นที่โกดัง
    
    // SEO
    seoTags: commercial?.seoTags || '',
    
    // YouTube
    youtubeUrl: commercial?.youtube_url || commercial?.youtubeUrl || '',
    
    // Project Facilities
    facilities: commercial?.facilities || [],
    
    // Timestamps
    createdAt: commercial?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [coverImage, setCoverImage] = useState(null)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [facilitiesLoading, setFacilitiesLoading] = useState(false) // เปลี่ยนเป็น false เพราะใช้ mock data
  const [availableFacilities, setAvailableFacilities] = useState(mockFacilities) // ใช้ mock data แทน
  const [uploadProgress, setUploadProgress] = useState(0)

  // Station search/select state
  const [stationSearchTerm, setStationSearchTerm] = useState('')
  const [showStationDropdown, setShowStationDropdown] = useState(false)

  const listingTypes = [
    { value: 'sale', label: 'ขาย', icon: DollarSign },
    { value: 'rent', label: 'เช่า', icon: Calendar },
    { value: 'both', label: 'ขาย/เช่า', icon: Building }
  ]

  // Transit station lists
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
    { id: 'bang_phai', name: 'MRT Bang Phai (บางไผ่)', line: 'MRT' },
    { id: 'bang_wa_mrt', name: 'MRT Bang Wa (บางหว้า)', line: 'MRT' },
    { id: 'charoen_nakhon', name: 'MRT Charoen Nakhon (เจริญนคร)', line: 'MRT' },
    { id: 'khlong_san', name: 'MRT Khlong San (คลองสาน)', line: 'MRT' },
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
  ]

  const arlStations = [
    { id: 'phaya_thai', name: 'Airport Rail Link Phaya Thai (พญาไท)', line: 'ARL' },
    { id: 'ratchaprarop', name: 'Airport Rail Link Ratchaprarop (ราชปรารภ)', line: 'ARL' },
    { id: 'makkasan', name: 'Airport Rail Link Makkasan (มักกะสัน)', line: 'ARL' },
    { id: 'ramkhamhaeng', name: 'Airport Rail Link Ramkhamhaeng (รามคำแหง)', line: 'ARL' },
    { id: 'huamark', name: 'Airport Rail Link Hua Mak (หัวหมาก)', line: 'ARL' },
    { id: 'ban_thap_chang', name: 'Airport Rail Link Ban Thap Chang (บ้านทับช้าง)', line: 'ARL' },
    { id: 'lat_krabang', name: 'Airport Rail Link Lat Krabang (ลาดกระบัง)', line: 'ARL' },
    { id: 'suvarnabhumi', name: 'Airport Rail Link Suvarnabhumi (สุวรรณภูมิ)', line: 'ARL' }
  ]

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
  ]

  const allStations = [...btsStations, ...mrtStations, ...arlStations, ...srtStations]

  const handleStationToggle = (stationId) => {
    setFormData(prev => {
      const current = Array.isArray(prev.selectedStations) ? prev.selectedStations : []
      return current.includes(stationId)
        ? { ...prev, selectedStations: current.filter(id => id !== stationId) }
        : { ...prev, selectedStations: [...current, stationId] }
    })
  }

  const isStationSelected = (stationId) => Array.isArray(formData.selectedStations) && formData.selectedStations.includes(stationId)

  const filteredStations = () => {
    if (!stationSearchTerm) return allStations
    const q = stationSearchTerm.toLowerCase()
    return allStations.filter(s => s.name.toLowerCase().includes(q) || s.line.toLowerCase().includes(q))
  }

  // Prefill when editing: map API fields (snake_case) to form fields (camelCase) and images
  useEffect(() => {
    if (isEditing && commercial) {
      console.log('CommercialForm - Prefilling data for editing:', commercial) // Debug log
      console.log('CommercialForm - youtube_url from API:', commercial.youtube_url) // Debug log
      const mappedFacilities = Array.isArray(commercial.facilities)
        ? commercial.facilities.map(f => (typeof f === 'string' ? f : f.id)).filter(Boolean)
        : []

      setFormData(prev => ({
        ...prev,
        title: commercial.title || '',
        projectCode: commercial.project_code || commercial.projectCode || '',
        announcerStatus: commercial.announcer_status || commercial.announcerStatus || 'agent',
        status: commercial.status || 'sale',
        price: commercial.price !== undefined && commercial.price !== null ? String(commercial.price) : '',
        rentPrice: commercial.rent_price !== undefined && commercial.rent_price !== null ? String(commercial.rent_price) : '',
        propertyType: commercial.property_type || commercial.propertyType || 'shop_house',
        buildingType: commercial.building_type || commercial.buildingType || 'shop_house',
        location: commercial.location || '',
        district: commercial.district || '',
        province: commercial.province || '',
        postalCode: commercial.postal_code || commercial.postalCode || '',
        googleMapUrl: commercial.google_map_url || commercial.googleMapUrl || '',
        nearbyTransport: commercial.nearby_transport || commercial.nearbyTransport || '',
        selectedStations: commercial.selected_stations || commercial.selectedStations || [],
        listingType: commercial.listing_type || commercial.listingType || 'sale',
        description: commercial.description || '',
        area: commercial.area !== undefined && commercial.area !== null ? String(commercial.area) : '',
        landArea: commercial.land_area !== undefined && commercial.land_area !== null ? String(commercial.land_area) : '',
        buildingArea: commercial.building_area !== undefined && commercial.building_area !== null ? String(commercial.building_area) : '',
        floors: commercial.floors !== undefined && commercial.floors !== null ? String(commercial.floors) : '',
        floorHeight: commercial.floor_height !== undefined && commercial.floor_height !== null ? String(commercial.floor_height) : '',
        parkingSpaces: commercial.parking_spaces !== undefined && commercial.parking_spaces !== null ? String(commercial.parking_spaces) : '',
        frontage: commercial.frontage !== undefined && commercial.frontage !== null ? String(commercial.frontage) : '',
        depth: commercial.depth !== undefined && commercial.depth !== null ? String(commercial.depth) : '',
        roadWidth: commercial.road_width !== undefined && commercial.road_width !== null ? String(commercial.road_width) : '',
        zoning: commercial.zoning || '',
        buildingAge: commercial.building_age !== undefined && commercial.building_age !== null ? String(commercial.building_age) : '',
        pricePerSqm: commercial.price_per_sqm !== undefined && commercial.price_per_sqm !== null ? String(commercial.price_per_sqm) : '',
        seoTags: commercial.seo_tags || commercial.seoTags || '',
        youtubeUrl: commercial.youtube_url || commercial.youtubeUrl || '',
        facilities: mappedFacilities,
        createdAt: commercial.created_at || commercial.createdAt || prev.createdAt,
        updatedAt: commercial.updated_at || commercial.updatedAt || new Date().toISOString()
      }))
      
      console.log('CommercialForm - formData.youtubeUrl after prefill:', formData.youtubeUrl) // Debug log

      // Set cover image
      const coverUrl = commercial.cover_image || commercial.coverImage?.url || null
      if (coverUrl) {
        setCoverImage({
          id: `cover-${Date.now()}`,
          preview: coverUrl,
          url: coverUrl,
          public_id: commercial.cover_public_id || commercial.coverImage?.public_id || undefined,
          uploading: false
        })
      } else {
        setCoverImage(null)
      }

      // Set gallery images (support both array of URLs and array of objects)
      const rawImages = Array.isArray(commercial.images) ? commercial.images : []
      const mappedImages = rawImages
        .map((item, idx) => {
          const imageUrl = typeof item === 'string' ? item : (item?.url || item?.image_url)
          const publicId = typeof item === 'string' ? undefined : (item?.public_id)
          if (!imageUrl || (coverUrl && imageUrl === coverUrl)) return null
          return {
            id: `img-${Date.now()}-${idx}`,
            preview: imageUrl,
            url: imageUrl,
            public_id: publicId,
            uploading: false
          }
        })
        .filter(Boolean)
      setImages(mappedImages)
    }
  }, [isEditing, commercial])

  // Generate auto project code (ws + ตัวเลข 7 หลัก)
  useEffect(() => {
    if (!isEditing && !formData.projectCode) {
      const timestamp = Date.now()
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const code = `WS${timestamp.toString().slice(-4)}${randomNum}` // รหัส WS + ตัวเลข 7 หลัก
      setFormData(prev => ({ ...prev, projectCode: code }))
    }
  }, [isEditing])

  // Auto calculate price per sqm
  useEffect(() => {
    if (formData.area && (formData.price || formData.rentPrice)) {
      const area = parseFloat(formData.area)
      if (!isNaN(area) && area > 0) {
        let pricePerSqm = 0
        
        if (formData.status === 'rent' && formData.rentPrice) {
          // คำนวณจากราคาเช่า (ต่อเดือน)
          const rentPrice = parseFloat(formData.rentPrice)
          if (!isNaN(rentPrice) && rentPrice > 0) {
            pricePerSqm = (rentPrice / area).toFixed(2)
            console.log(`คำนวณราคาต่อตารางเมตรจากราคาเช่า (โฮมออฟฟิศ/ตึกแถว): ${rentPrice} ÷ ${area} = ${pricePerSqm} บาท/ตร.ม./เดือน`)
          }
        } else if (formData.status === 'sale' && formData.price) {
          // คำนวณจากราคาขาย
          const price = parseFloat(formData.price)
          if (!isNaN(price) && price > 0) {
            pricePerSqm = (price / area).toFixed(2)
            console.log(`คำนวณราคาต่อตารางเมตรจากราคาขาย (โฮมออฟฟิศ/ตึกแถว): ${price} ÷ ${area} = ${pricePerSqm} บาท/ตร.ม.`)
          }
        } else if (formData.status === 'both') {
          // กรณีขาย/เช่า ให้คำนวณจากราคาขายก่อน ถ้าไม่มีให้คำนวณจากราคาเช่า
          if (formData.price) {
            const price = parseFloat(formData.price)
            if (!isNaN(price) && price > 0) {
              pricePerSqm = (price / area).toFixed(2)
              console.log(`คำนวณราคาต่อตารางเมตรจากราคาขาย (โฮมออฟฟิศ/ตึกแถว): ${price} ÷ ${area} = ${pricePerSqm} บาท/ตร.ม.`)
            }
          } else if (formData.rentPrice) {
            const rentPrice = parseFloat(formData.rentPrice)
            if (!isNaN(rentPrice) && rentPrice > 0) {
              pricePerSqm = (rentPrice / area).toFixed(2)
              console.log(`คำนวณราคาต่อตารางเมตรจากราคาเช่า (โฮมออฟฟิศ/ตึกแถว): ${rentPrice} ÷ ${area} = ${pricePerSqm} บาท/ตร.ม./เดือน`)
            }
          }
        }
        
        if (pricePerSqm > 0) {
          setFormData(prev => ({ ...prev, pricePerSqm }))
          console.log(`อัปเดต pricePerSqm (โฮมออฟฟิศ/ตึกแถว): ${pricePerSqm}`)
        }
      }
    }
  }, [formData.price, formData.rentPrice, formData.area, formData.status])

  // Convert API facilities to component format
  const projectFacilities = availableFacilities.map(facility => ({
    id: facility.id,
    label: facility.label,
    icon: facility.icon || FacilityIcons.Star, // Fallback icon
    category: facility.category
  }))

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

  const handleFacilityToggle = (facilityId) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(id => id !== facilityId)
        : [...prev.facilities, facilityId]
    }))
  }

  // Handle multiple image uploads (local simulation)
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

  // อัปโหลดรูปไป Cloudinary ผ่าน API
  const handleImageUpload = async (file, isCover = false) => {
    try {
      setUploading(true)

      const result = await uploadAPI.uploadMultiple([file])
      const uploaded = result?.data?.[0] || result?.data || result // Get first file from array
      const imageUrl = uploaded.url
      const publicId = uploaded.public_id

      const imageData = {
        id: Date.now().toString(),
        url: imageUrl,
        preview: imageUrl,
        public_id: publicId,
        uploading: false,
        file
      }

      if (isCover) {
        setCoverImage(imageData)
      } else {
        setImages(prev => [...prev, imageData])
      }

      console.log('อัปโหลดรูปภาพขึ้น Cloudinary สำเร็จ:', uploaded)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageId, isCover = false) => {
    try {
      let imageToRemove = null
      
      if (isCover) {
        imageToRemove = coverImage
        setCoverImage(null)
      } else {
        imageToRemove = images.find(img => img.id === imageId)
        setImages(prev => prev.filter(img => img.id !== imageId))
      }

      // ลบรูปจาก Cloudinary ถ้ามี public_id
      if (imageToRemove && imageToRemove.public_id) {
        try {
          await uploadAPI.delete(imageToRemove.public_id)
          console.log('ลบรูปจาก Cloudinary สำเร็จ:', imageToRemove.public_id)
        } catch (err) {
          console.error('ไม่สามารถลบรูปจาก Cloudinary:', err)
        }
      }
    } catch (error) {
      console.error('Error removing image:', error)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title) newErrors.title = 'กรุณากรอกชื่อโครงการ'

    // Validation สำหรับข้อมูลเฉพาะโฮมออฟฟิศ/ตึกแถว
    if (formData.hasMezzanine && (!formData.mezzanineArea || parseFloat(formData.mezzanineArea) <= 0)) {
      newErrors.mezzanineArea = 'กรุณากรอกพื้นที่ชั้นลอยที่ถูกต้อง'
    }
    
    if (formData.hasBasement && (!formData.basementArea || parseFloat(formData.basementArea) <= 0)) {
      newErrors.basementArea = 'กรุณากรอกพื้นที่ชั้นใต้ดินที่ถูกต้อง'
    }
    
    if (formData.hasWarehouse && (!formData.warehouseArea || parseFloat(formData.warehouseArea) <= 0)) {
      newErrors.warehouseArea = 'กรุณากรอกพื้นที่โกดังที่ถูกต้อง'
    }

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
      

      
      // Transform form data to API format - แปลง undefined เป็น null เพื่อป้องกัน SQL error
      const commercialData = {
        title: formData.title || null,
        status: formData.status || null,
        price: parseFloat(formData.price) || 0,
        rent_price: parseFloat(formData.rentPrice) || 0,
        property_type: formData.propertyType || null,
        building_type: formData.buildingType || null,
        location: formData.location || null,
        district: formData.district || null,
        province: formData.province || null,
        postal_code: formData.postalCode || null,
        google_map_url: formData.googleMapUrl || null,
        nearby_transport: formData.nearbyTransport || null,
        selected_stations: formData.selectedStations || [],
        listing_type: formData.listingType || null,
        description: formData.description || null,
        area: parseFloat(formData.area) || 0,
        land_area: parseFloat(formData.landArea) || 0,
        building_area: parseFloat(formData.buildingArea) || 0,
        floors: parseInt(formData.floors) || 0,
        floor_height: parseFloat(formData.floorHeight) || 0,
        parking_spaces: parseInt(formData.parkingSpaces) || 0,
        price_per_sqm: parseFloat(formData.pricePerSqm) || 0,
        frontage: parseFloat(formData.frontage) || 0,
        depth: parseFloat(formData.depth) || 0,
        road_width: parseFloat(formData.roadWidth) || 0,
        zoning: formData.zoning || null,
        building_age: parseInt(formData.buildingAge) || 0,
        shop_front: parseFloat(formData.shopFront) || 0,
        shop_depth: parseFloat(formData.shopDepth) || 0,
        has_mezzanine: formData.hasMezzanine || false,
        mezzanine_area: parseFloat(formData.mezzanineArea) || 0,
        has_basement: formData.hasBasement || false,
        basement_area: parseFloat(formData.basementArea) || 0,
        has_warehouse: formData.hasWarehouse || false,
        warehouse_area: parseFloat(formData.warehouseArea) || 0,
        seo_tags: formData.seoTags || null,
        facilities: formData.facilities || [],
        images: images.map(img => ({
          url: img.url || img.preview || null,
          public_id: img.public_id || null
        })),
        cover_image: coverImage ? (coverImage.preview || coverImage.url) : null
      }

      console.log('ส่งข้อมูลไป API:', commercialData)
      
      // Debug: ตรวจสอบ fields ที่อาจเป็น undefined
      const undefinedFields = Object.entries(commercialData)
        .filter(([key, value]) => value === undefined)
        .map(([key]) => key)
      
      if (undefinedFields.length > 0) {
        console.warn('⚠️ Fields ที่เป็น undefined:', undefinedFields)
        console.warn('⚠️ ข้อมูลทั้งหมด:', commercialData)
      }

      if (isEditing) {
        // แก้ไขโฮมออฟฟิศ/ตึกแถว
        const commercialId = id || commercial?.id
        if (!commercialId) {
          throw new Error('ไม่พบ ID ของโฮมออฟฟิศ/ตึกแถวที่ต้องการแก้ไข')
        }
        const result = await commercialApi.update(commercialId, commercialData)
        console.log('แก้ไขโฮมออฟฟิศ/ตึกแถวสำเร็จ:', result)
        alert('แก้ไขประกาศโฮมออฟฟิศ/ตึกแถวสำเร็จ!')
      } else {
        // สร้างโฮมออฟฟิศ/ตึกแถวใหม่
        const result = await commercialApi.create(commercialData)
        console.log('สร้างโฮมออฟฟิศ/ตึกแถวสำเร็จ:', result)
        alert('เพิ่มประกาศโฮมออฟฟิศ/ตึกแถวสำเร็จ!')
      }

      if (onSave) {
        onSave(commercialData)
      }

      if (onBack) {
        onBack()
      }
      
    } catch (error) {
      console.error('Error saving commercial:', error)
      alert(`เกิดข้อผิดพลาด: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

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
              {isEditing ? 'แก้ไขข้อมูลโฮมออฟฟิศ/ตึกแถว' : 'เพิ่มโฮมออฟฟิศ/ตึกแถวใหม่'}
            </h1>
            <p className="text-gray-600 font-prompt mt-1">
              กรอกข้อมูลโฮมออฟฟิศ/ตึกแถวให้ครบถ้วน
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
                ชื่อโครงการ
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="เช่น โฮมออฟฟิศ สุขุมวิท, ตึกแถว สีลม"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
                เลือกสถานะของผู้ประกาศ: เจ้าของโฮมออฟฟิศ หรือ ตัวแทนพิเศษอสังหาริมทรัพย์
              </p>
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
                  { value: 'shop_house', label: 'โฮมออฟฟิศ', icon: Building, color: 'from-orange-500 to-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
                  { value: 'shophouse', label: 'ตึกแถว', icon: Building, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
                  { value: 'commercial_building', label: 'อาคารพาณิชย์', icon: Building, color: 'from-green-500 to-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50' },
                  { value: 'office_building', label: 'อาคารสำนักงาน', icon: Building, color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' },
                  { value: 'mixed_use', label: 'อาคารผสมผสาน', icon: Building, color: 'from-indigo-500 to-indigo-600', borderColor: 'border-indigo-500', bgColor: 'bg-indigo-50' }
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
              {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
            </div>

            {/* ประเภทอาคาร */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ประเภทอาคาร
              </label>
              <select
                value={formData.buildingType}
                onChange={(e) => handleInputChange('buildingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="shop_house">โฮมออฟฟิศ (Shop House)</option>
                <option value="shophouse">ตึกแถว (Shophouse)</option>
                <option value="commercial_building">อาคารพาณิชย์</option>
                <option value="office_building">อาคารสำนักงาน</option>
                <option value="mixed_use">อาคารผสมผสาน</option>
              </select>
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
                  placeholder="เช่น 15000000"
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
                  placeholder="เช่น 80000"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* สถานที่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น : สถานที่
              </label>
              <div className="relative">
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="เช่น สุขุมวิท, สีลม, กรุงเทพฯ"
                  className={errors.location ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* เขต */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                เขต
              </label>
              <Input
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="เช่น คลองเตย, สาทร, บางรัก"
              />
            </div>

            {/* จังหวัด */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                จังหวัด
              </label>
              <Input
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                placeholder="เช่น กรุงเทพมหานคร, เชียงใหม่, ภูเก็ต"
              />
            </div>

            {/* รหัสไปรษณีย์ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                รหัสไปรษณีย์
              </label>
              <Input
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="เช่น 10110"
              />
            </div>

            {/* Google Map */}
            <div className="md:col-span-2">
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น BTS MRT ARL SRT :
              </label>
              {/* Search and select stations */}
              <div className="relative station-search-container">
                <div className="relative">
                  <input
                    type="text"
                    value={stationSearchTerm}
                    onChange={(e) => { setStationSearchTerm(e.target.value); setShowStationDropdown(true) }}
                    onFocus={() => setShowStationDropdown(true)}
                    placeholder="ค้นหาสถานี เช่น อโศก, สุขุมวิท, MRT..."
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                {showStationDropdown && (stationSearchTerm || filteredStations().length > 0) && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStations().length > 0 ? (
                      <div className="py-2">
                        {filteredStations().map((station) => (
                          <button
                            key={station.id}
                            type="button"
                            onClick={() => { handleStationToggle(station.id); setStationSearchTerm(''); setShowStationDropdown(false) }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${isStationSelected(station.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
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
                      <div className="px-4 py-3 text-gray-500 text-center">ไม่พบสถานีที่ค้นหา</div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected stations chips */}
              {Array.isArray(formData.selectedStations) && formData.selectedStations.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-700">สถานีที่เลือก ({formData.selectedStations.length} สถานี)</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, selectedStations: [] }))}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      ลบทั้งหมด
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedStations.map((stationId) => {
                      const station = allStations.find(s => s.id === stationId)
                      return station ? (
                        <span key={stationId} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {station.name}
                          <button type="button" onClick={() => handleStationToggle(stationId)} className="ml-2 text-blue-600 hover:text-blue-800 font-bold">×</button>
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              )}
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
                placeholder="อธิบายรายละเอียดของโฮมออฟฟิศ/ตึกแถว เช่น สภาพอาคาร การใช้งาน การตกแต่ง สิ่งอำนวยความสะดวก..."
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
            {/* พื้นที่รวม */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                พื้นที่รวม (ตารางเมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="เช่น 200.0"
                  className={errors.area ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ม.</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">พื้นที่รวมของทั้งโครงการ (ดิน + อาคาร)</p>
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            {/* พื้นที่ดิน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                พื้นที่ดิน (ตารางเมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.landArea}
                  onChange={(e) => handleInputChange('landArea', e.target.value)}
                  placeholder="เช่น 80.0"
                  className={errors.landArea ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ม.</span>
                </div>
              </div>
              {errors.landArea && <p className="text-red-500 text-sm mt-1">{errors.landArea}</p>}
            </div>

            {/* พื้นที่อาคาร */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                พื้นที่อาคาร (ตารางเมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.buildingArea}
                  onChange={(e) => handleInputChange('buildingArea', e.target.value)}
                  placeholder="เช่น 120.0"
                  className={errors.buildingArea ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ม.</span>
                </div>
              </div>
              {errors.buildingArea && <p className="text-red-500 text-sm mt-1">{errors.buildingArea}</p>}
            </div>

            {/* จำนวนชั้น */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                จำนวนชั้น
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  value={formData.floors}
                  onChange={(e) => handleInputChange('floors', e.target.value)}
                  placeholder="เช่น 3"
                  className={errors.floors ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.floors && <p className="text-red-500 text-sm mt-1">{errors.floors}</p>}
            </div>

            {/* ความสูงชั้น */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ความสูงชั้น (เมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={formData.floorHeight}
                  onChange={(e) => handleInputChange('floorHeight', e.target.value)}
                  placeholder="เช่น 3.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ม.</span>
                </div>
              </div>
            </div>

            {/* ที่จอดรถ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ที่จอดรถ
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.parkingSpaces}
                  onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                  placeholder="เช่น 2"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaCar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* หน้ากว้าง */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                หน้ากว้าง (เมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={formData.frontage}
                  onChange={(e) => handleInputChange('frontage', e.target.value)}
                  placeholder="เช่น 8.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ม.</span>
                </div>
              </div>
            </div>

            {/* ความลึก */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ความลึก (เมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={formData.depth}
                  onChange={(e) => handleInputChange('depth', e.target.value)}
                  placeholder="เช่น 15.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ม.</span>
                </div>
              </div>
            </div>

            {/* ความกว้างถนน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ความกว้างถนน (เมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={formData.roadWidth}
                  onChange={(e) => handleInputChange('roadWidth', e.target.value)}
                  placeholder="เช่น 12.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ม.</span>
                </div>
              </div>
            </div>

            {/* โซนนิ่ง */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โซนนิ่ง
              </label>
              <Input
                value={formData.zoning}
                onChange={(e) => handleInputChange('zoning', e.target.value)}
                placeholder="เช่น พาณิชยกรรม, ผสมผสาน"
              />
            </div>

            {/* อายุอาคาร */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                อายุอาคาร (ปี)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.buildingAge}
                  onChange={(e) => handleInputChange('buildingAge', e.target.value)}
                  placeholder="เช่น 5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ปี</span>
                </div>
              </div>
            </div>

            {/* ราคาต่อ per sq.m. */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาต่อ per sq.m. (ฟังก์ชันคำนวณอัตโนมัติ)
              </label>
              <div className="relative">
                <Input
                  value={formData.pricePerSqm ? `฿${parseFloat(formData.pricePerSqm).toLocaleString('th-TH', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} /ตร.ม.${formData.status === 'rent' ? '/เดือน' : ''}` : ''}
                  readOnly
                  className="bg-green-50 border-green-200 text-green-700 font-semibold"
                  placeholder="จะคำนวณอัตโนมัติเมื่อกรอกข้อมูลครบถ้วน"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calculator className="h-4 w-4 text-green-500" />
                </div>
              </div>
              
              {/* สถานะการคำนวณ */}
              {formData.pricePerSqm && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 font-medium">
                    ✅ คำนวณแล้ว: {formData.status === 'rent' ? 'จากราคาเช่า' : formData.status === 'sale' ? 'จากราคาขาย' : 'จากราคา'} 
                    = ฿{parseFloat(formData.pricePerSqm).toLocaleString('th-TH', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} /ตร.ม.{formData.status === 'rent' ? '/เดือน' : ''}
                  </p>
                </div>
              )}
              
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-1">ตัวอย่างการคำนวณ:</h4>
                {formData.status === 'rent' ? (
                  <div>
                    <p className="text-sm text-blue-700">
                      ราคาเช่า: 80,000 บาท/เดือน ÷ 200 ตารางเมตร = 400 บาท/ตร.ม./เดือน
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      การคำนวณ: ราคาเช่า ÷ พื้นที่ = ราคาต่อตารางเมตรต่อเดือน
                    </p>
                  </div>
                ) : formData.status === 'sale' ? (
                  <div>
                    <p className="text-sm text-blue-700">
                      ราคาขาย: 15,000,000 บาท ÷ 200 ตารางเมตร = 75,000 บาท/ตร.ม.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      การคำนวณ: ราคาขาย ÷ พื้นที่ = ราคาต่อตารางเมตร
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-blue-700">
                      15,000,000 บาท ÷ 200 ตารางเมตร = 75,000 บาท/ตร.ม.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      การคำนวณ: ราคา ÷ พื้นที่ = ราคาต่อตารางเมตร
                    </p>
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
        </Card>

        {/* ข้อมูลเฉพาะโฮมออฟฟิศ/ตึกแถว */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Store className="h-6 w-6 mr-3 text-blue-600" />
            ข้อมูลเฉพาะโฮมออฟฟิศ/ตึกแถว
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* หน้าร้าน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                หน้าร้าน (เมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={formData.shopFront}
                  onChange={(e) => handleInputChange('shopFront', e.target.value)}
                  placeholder="เช่น 8.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ม.</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">ความกว้างของหน้าร้าน</p>
            </div>

            {/* ความลึกร้าน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ความลึกร้าน (เมตร)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  value={formData.shopDepth}
                  onChange={(e) => handleInputChange('shopDepth', e.target.value)}
                  placeholder="เช่น 15.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ม.</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">ความลึกของร้าน</p>
            </div>

            {/* มีชั้นลอย */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                มีชั้นลอย
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasMezzanine"
                    value="true"
                    checked={formData.hasMezzanine === true}
                    onChange={(e) => handleInputChange('hasMezzanine', e.target.value === 'true')}
                    className="mr-2"
                  />
                  มี
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasMezzanine"
                    value="false"
                    checked={formData.hasMezzanine === false}
                    onChange={(e) => handleInputChange('hasMezzanine', e.target.value === 'true')}
                    className="mr-2"
                  />
                  ไม่มี
                </label>
              </div>
            </div>

            {/* พื้นที่ชั้นลอย */}
            {formData.hasMezzanine && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  พื้นที่ชั้นลอย (ตารางเมตร)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.mezzanineArea}
                    onChange={(e) => handleInputChange('mezzanineArea', e.target.value)}
                    placeholder="เช่น 60.0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-500">ตร.ม.</span>
                  </div>
                </div>
              </div>
            )}

            {/* มีชั้นใต้ดิน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                มีชั้นใต้ดิน
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasBasement"
                    value="true"
                    checked={formData.hasBasement === true}
                    onChange={(e) => handleInputChange('hasBasement', e.target.value === 'true')}
                    className="mr-2"
                  />
                  มี
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasBasement"
                    value="false"
                    checked={formData.hasBasement === false}
                    onChange={(e) => handleInputChange('hasBasement', e.target.value === 'true')}
                    className="mr-2"
                  />
                  ไม่มี
                </label>
              </div>
            </div>

            {/* พื้นที่ชั้นใต้ดิน */}
            {formData.hasBasement && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  พื้นที่ชั้นใต้ดิน (ตารางเมตร)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.basementArea}
                    onChange={(e) => handleInputChange('basementArea', e.target.value)}
                    placeholder="เช่น 80.0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-500">ตร.ม.</span>
                  </div>
                </div>
              </div>
            )}

            {/* มีโกดัง */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                มีโกดัง
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasWarehouse"
                    value="true"
                    checked={formData.hasWarehouse === true}
                    onChange={(e) => handleInputChange('hasWarehouse', e.target.value === 'true')}
                    className="mr-2"
                  />
                  มี
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasWarehouse"
                    value="false"
                    checked={formData.hasWarehouse === false}
                    onChange={(e) => handleInputChange('hasWarehouse', e.target.value === 'true')}
                    className="mr-2"
                  />
                  ไม่มี
                </label>
              </div>
            </div>

            {/* พื้นที่โกดัง */}
            {formData.hasWarehouse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  พื้นที่โกดัง (ตารางเมตร)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.warehouseArea}
                    onChange={(e) => handleInputChange('warehouseArea', e.target.value)}
                    placeholder="เช่น 100.0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-gray-500">ตร.ม.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* SEO Tag และ YouTube */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Search className="h-6 w-6 mr-3 text-blue-600" />
            SEO Tag และ YouTube
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEO Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                SEO Tag
              </label>
              <Input
                value={formData.seoTags}
                onChange={(e) => handleInputChange('seoTags', e.target.value)}
                placeholder="เช่น โฮมออฟฟิศ, ตึกแถว, พาณิชยกรรม, สุขุมวิท, สีลม, ขาย, เช่า"
              />
              <p className="text-sm text-gray-500 mt-1">ช่องให้กรอก tag สำหรับ SEO (แยกแท็กด้วยเครื่องหมายจุลภาค)</p>
            </div>

            {/* ลิงก์ YouTube */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt flex items-center">
                <svg className="h-5 w-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                ลิงก์ YouTube
              </label>
              <Input
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                placeholder="เช่น https://www.youtube.com/watch?v=..."
                className="focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-sm text-gray-500 mt-1">ลิงก์วิดีโอ YouTube สำหรับแสดงในหน้ารายละเอียด</p>
            </div>
          </div>
        </Card>

        {/* Project Facilities */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Star className="h-6 w-6 mr-3 text-blue-600" />
            สิ่งอำนวยความสะดวก (Project Facilities)
            {facilitiesLoading && (
              <div className="ml-3 text-sm text-blue-600">กำลังโหลด...</div>
            )}
          </h2>
          
          {facilitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">กำลังโหลดสิ่งอำนวยความสะดวก...</span>
            </div>
          ) : (
            <div>
              {/* แสดง facilities ที่เลือกแล้ว */}
              {formData.facilities.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-green-800 font-prompt">
                        ✅ สิ่งอำนวยความสะดวกที่เลือกแล้ว ({formData.facilities.length} รายการ)
                      </h3>
                    </div>
                  </div>
                  
                  {/* Selected Facilities Display */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {formData.facilities.map(facilityId => {
                      const facility = projectFacilities.find(f => f.id === facilityId)
                      if (!facility) return null
                      const IconComponent = facility.icon
                      return (
                        <div
                          key={facilityId}
                          className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-green-200 transition-colors"
                          onClick={() => handleFacilityToggle(facilityId)}
                        >
                          <div className="p-1 rounded-full bg-green-200">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="font-prompt text-xs">{facility.label}</span>
                          <X className="h-3 w-3 text-green-500 hover:text-green-700" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* All facilities for selection */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700 font-prompt">
                  📋 เลือกสิ่งอำนวยความสะดวกทั้งหมด ({availableFacilities.length} รายการ)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {projectFacilities.map(facility => {
                    const IconComponent = facility.icon
                    const isSelected = formData.facilities.includes(facility.id)
                    
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
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className={`text-xs font-medium font-prompt ${
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
          )}

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
                </div>
              ) : (
                <label className="cursor-pointer block text-center hover:bg-gray-50 rounded-lg p-4 transition-colors">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <span className="text-gray-600 font-prompt font-medium">คลิกเพื่อเลือกรูปภาพหน้าปก</span>
                  <p className="text-sm text-gray-500 mt-2">รองรับไฟล์ JPG, PNG, WebP</p>
                  <p className="text-xs text-gray-400 mt-1">แนะนำ: รูปภาพแสดงหน้าตาของโฮมออฟฟิศ/ตึกแถว</p>
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
              <p className="text-xs text-gray-500 mt-1">รูปภาพเพิ่มเติมของโฮมออฟฟิศ/ตึกแถว</p>
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
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-prompt">
              <span className="font-medium">💡 คำแนะนำ:</span> รูปภาพหน้าปกจะแสดงเป็นรูปหลักในรายการโฮมออฟฟิศ/ตึกแถว
              รูปภาพเพิ่มเติมจะแสดงในแกลลอรี่ของประกาศ สามารถอัปโหลดได้สูงสุด 100 รูป
            </p>
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
            disabled={loading || uploading || facilitiesLoading}
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

// Export CommercialForm component
export { CommercialForm }

// Wrapper component สำหรับ routing
export const CommercialFormWrapper = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [commercial, setCommercial] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'add') {
      // ดึงข้อมูลจาก API เมื่อแก้ไข
      const fetchCommercial = async () => {
        try {
          setLoading(true)
          const result = await commercialApi.getById(id)
          console.log('ดึงข้อมูลโฮมออฟฟิศ/ตึกแถวสำเร็จ:', result)
          setCommercial(result.data || result)
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error)
          alert('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง')
          navigate('/admin/commercial')
        } finally {
          setLoading(false)
        }
      }
      fetchCommercial()
    } else {
      setLoading(false)
    }
  }, [id, navigate])

  const handleBack = () => {
    navigate('/admin/commercial')
  }

  const handleSave = (commercialData) => {
    // บันทึกข้อมูลไปยัง API (CommercialForm จะจัดการเอง)
    console.log('บันทึกข้อมูลสำเร็จ:', commercialData)
    navigate('/admin/commercial')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <CommercialForm
      commercial={commercial}
      onBack={handleBack}
      onSave={handleSave}
      isEditing={id && id !== 'add'}
      id={id}
    />
  )
}

export default CommercialForm

// Demo Page Component สำหรับทดสอบ CommercialForm โดยไม่ต้องเชื่อมต่อ parent component
export const CommercialFormDemo = () => {
  const [commercials, setCommercials] = useState([])
  const [currentView, setCurrentView] = useState('list') // 'list' หรือ 'form'
  const [editingCommercial, setEditingCommercial] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleBack = () => {
    setCurrentView('list')
    setEditingCommercial(null)
    setIsEditing(false)
  }

  const handleSave = (commercialData) => {
    if (isEditing) {
      // แก้ไขข้อมูลที่มีอยู่
      setCommercials(prev => prev.map(c => 
        c.id === commercialData.id ? commercialData : c
      ))
    } else {
      // เพิ่มข้อมูลใหม่
      setCommercials(prev => [...prev, commercialData])
    }
    setCurrentView('list')
    setEditingCommercial(null)
    setIsEditing(false)
  }

  const handleEdit = (commercial) => {
    setEditingCommercial(commercial)
    setIsEditing(true)
    setCurrentView('form')
  }

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?')) {
      setCommercials(prev => prev.filter(c => c.id !== id))
    }
  }

  if (currentView === 'form') {
    return (
      <CommercialForm
        commercial={editingCommercial}
        onBack={handleBack}
        onSave={handleSave}
        isEditing={isEditing}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">
            ระบบจัดการโฮมออฟฟิศ/ตึกแถว (Demo)
          </h1>
          <p className="text-gray-600 font-prompt mt-1">
            หน้าทดสอบ CommercialForm โดยไม่ต้องเชื่อมต่อ API
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCommercial(null)
            setIsEditing(false)
            setCurrentView('form')
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มใหม่
        </Button>
      </div>

      {/* Commercial List */}
      {commercials.length === 0 ? (
        <Card className="p-12 text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 font-prompt">
            ยังไม่มีข้อมูลโฮมออฟฟิศ/ตึกแถว
          </h3>
          <p className="text-gray-500 mb-4 font-prompt">
            เริ่มต้นโดยการเพิ่มข้อมูลโฮมออฟฟิศ/ตึกแถวใหม่
          </p>
          <Button
            onClick={() => {
              setEditingCommercial(null)
              setIsEditing(false)
              setCurrentView('form')
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มข้อมูลใหม่
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commercials.map((commercial) => (
            <Card key={commercial.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Cover Image */}
              {commercial.coverImage && (
                <div className="mb-4">
                  <img
                    src={commercial.coverImage.url}
                    alt={commercial.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    commercial.status === 'sale' ? 'bg-green-100 text-green-800' :
                    commercial.status === 'rent' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {commercial.status === 'sale' ? 'ขาย' :
                     commercial.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {commercial.projectCode}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 font-prompt line-clamp-2">
                  {commercial.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="font-prompt">{commercial.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 font-prompt">พื้นที่:</span>
                    <span className="ml-1 font-medium">{commercial.area} ตร.ม.</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-prompt">ชั้น:</span>
                    <span className="ml-1 font-medium">{commercial.floors} ชั้น</span>
                  </div>
                </div>

                {commercial.price > 0 && (
                  <div className="text-lg font-bold text-green-600">
                    ฿{commercial.price.toLocaleString('th-TH')}
                  </div>
                )}

                {commercial.rentPrice > 0 && (
                  <div className="text-sm text-blue-600">
                    เช่า: ฿{commercial.rentPrice.toLocaleString('th-TH')}/เดือน
                  </div>
                )}

                {/* Facilities Preview */}
                {commercial.facilities.length > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {commercial.facilities.slice(0, 3).map((facilityId) => (
                        <span
                          key={facilityId}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {facilityId}
                        </span>
                      ))}
                      {commercial.facilities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{commercial.facilities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-3 border-t">
                  <Button
                    onClick={() => handleEdit(commercial)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    แก้ไข
                  </Button>
                  <Button
                    onClick={() => handleDelete(commercial.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    ลบ
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Demo Info */}
      <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-3 font-prompt">
          💡 ข้อมูลการทดสอบ
        </h3>
        <div className="text-sm text-blue-700 space-y-2 font-prompt">
          <p>• หน้านี้เป็นหน้าทดสอบ CommercialForm โดยไม่ต้องเชื่อมต่อ API</p>
          <p>• สามารถเพิ่ม แก้ไข ลบข้อมูลโฮมออฟฟิศ/ตึกแถวได้</p>
          <p>• รูปภาพจะถูกจำลองการอัปโหลดในเครื่อง (ไม่ส่งไปยัง server)</p>
          <p>• ข้อมูลจะถูกเก็บใน localStorage ของเบราว์เซอร์</p>
          <p>• ฟีเจอร์คำนวณราคาต่อตารางเมตรทำงานอัตโนมัติ</p>
        </div>
      </Card>
    </div>
  )
}