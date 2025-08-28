import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  ArrowLeft,
  Landmark,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Upload,
  Plus,
  X,
  Maximize,
  Search,
  Camera,
  Calculator,
  User
} from 'lucide-react'




const LandForm = ({ land = null, onBack, onSave, isEditing = false }) => {
  const [formData, setFormData] = React.useState({
    // ข้อมูลพื้นฐาน
    title: land?.title || '', // ชื่อโครงการ
    projectCode: land?.projectCode || '', // รหัสโครงการ (อัตโนมัติ)
    announcerStatus: land?.announcerStatus || 'agent', // สถานะผู้ประกาศ: เจ้าของ/นายหน้า
    status: land?.status || 'sale', // สถานะ: ขาย/เช่า
    price: land?.price?.toString() || '', // ราคา (บาท)
    rentPrice: land?.rentPrice?.toString() || '', // ราคาเช่า (บาท/เดือน)
    landOwnership: land?.landOwnership || 'thai', // กรรมสิทธ์ที่ดิน: คนสัญชาติไทย หรือต่างชาติ
    
    // โลเคชั่น
    location: land?.location || '', // สถานที่
    googleMapUrl: land?.googleMapUrl || '', // Google Map URL
    nearbyTransport: land?.nearbyTransport || '', // BTS/MRT/APL/SRT
    selectedStations: land?.selectedStations || [], // สถานีรถไฟฟ้าที่เลือก
    
    // ประเภททรัพย์
    propertyType: land?.propertyType || 'land', // ประเภททรัพย์: ที่ดิน/ที่ดินพร้อมสิ่งปลูกสร้าง
    listingType: land?.listingType || 'sale', // ขาย/เช่า
    
    // รายละเอียด
    description: land?.description || '',
    
    // ข้อมูลอสังหาริมทรัพย์
    area: land?.area?.toString() || '', // พื้นที่ (ตารางเมตร)
    squareWa: land?.squareWa?.toString() || '', // ตารางวา
    rai: land?.rai?.toString() || '', // ไร่
    ngan: land?.ngan?.toString() || '', // งาน
    wah: land?.wah?.toString() || '', // วา
    pricePerSqWa: land?.pricePerSqWa?.toString() || '', // ราคาต่อ sq.wa
    pricePerSqm: land?.pricePerSqm?.toString() || '', // ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
    rentPricePerSqWa: land?.rentPricePerSqWa?.toString() || '', // ราคาเช่าต่อ ตร.วา (คำนวณอัตโนมัติ)
    rentPricePerSqm: land?.rentPricePerSqm?.toString() || '', // ราคาเช่าต่อ ตร.ม. (คำนวณอัตโนมัติ)
    view: land?.view || '', // วิวที่มองเห็น
    unitNumber: land?.unitNumber || '', // เลขที่ยูนิต
    
    // SEO
    seoTags: land?.seoTags || '',
    
    // YouTube
    youtubeUrl: land?.youtube_url || land?.youtubeUrl || '',
    
    // Timestamps
    createdAt: land?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [coverImage, setCoverImage] = React.useState(null)
  const [images, setImages] = React.useState([])
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const listingTypes = [
    { value: 'sale', label: 'ขาย', icon: DollarSign },
    { value: 'rent', label: 'เช่า', icon: Calendar },
    { value: 'both', label: 'ขาย/เช่า', icon: Landmark }
  ]

  // State สำหรับการเลือกสถานีรถไฟฟ้า
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [dragActive, setDragActive] = useState(false)

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
    { id: 'srinakarin', name: 'BTS Srinakarin (ศรีนครินทร์)', line: 'BTS' },
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
    { id: 'srinakarin_silom', name: 'BTS Srinakarin (ศรีนครินทร์)', line: 'BTS' }
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
    { id: 'charoen_nakhon', name: 'MRT Charoen Nakhon (เจริญนคร)', line: 'MRT' },
    { id: 'khlong_san', name: 'MRT Khlong San (คลองสาน)', line: 'MRT' },
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

  // Prefill when editing: map API fields (snake_case) to form fields (camelCase) and images
  React.useEffect(() => {
    if (isEditing && land) {
      console.log('LandForm - Prefilling data for editing:', land) // Debug log
      console.log('LandForm - youtube_url from API:', land.youtube_url) // Debug log
      setFormData(prev => ({
        ...prev,
        title: land.title || '',
        projectCode: land.project_code || '',
        announcerStatus: land.announcer_status || 'agent',
        status: land.status || 'sale',
        price: land.price !== undefined && land.price !== null ? String(land.price) : '',
        rentPrice: land.rent_price !== undefined && land.rent_price !== null ? String(land.rent_price) : '',
        landOwnership: land.land_ownership || 'thai',
        location: land.location || '',
        googleMapUrl: land.google_map_url || '',
        nearbyTransport: land.nearby_transport || '',
        selectedStations: land.selected_stations || [], // เพิ่มสถานีที่เลือก
        propertyType: land.property_type || 'land',
        listingType: land.listing_type || 'sale',
        description: land.description || '',
        area: land.area !== undefined && land.area !== null ? String(land.area) : '',
        squareWa: land.square_wa !== undefined && land.square_wa !== null ? String(land.square_wa) : '',
        rai: land.rai !== undefined && land.rai !== null ? String(land.rai) : '',
        ngan: land.ngan !== undefined && land.ngan !== null ? String(land.ngan) : '',
        wah: land.wah !== undefined && land.wah !== null ? String(land.wah) : '',
        pricePerSqWa: land.price_per_sq_wa !== undefined && land.price_per_sq_wa !== null ? String(land.price_per_sq_wa) : '',
        view: land.view || '',
        unitNumber: land.unit_number || '',
        seoTags: land.seo_tags || '',
        youtubeUrl: land.youtube_url || land.youtubeUrl || '',

        createdAt: land.created_at || prev.createdAt,
        updatedAt: land.updated_at || new Date().toISOString()
      }))
      
      console.log('LandForm - formData.youtubeUrl after prefill:', formData.youtubeUrl) // Debug log

      // Set cover image
      const coverUrl = land.cover_image || null
      if (coverUrl) {
        setCoverImage({
          id: `cover-${Date.now()}`,
          preview: coverUrl,
          url: coverUrl,
          public_id: land.cover_public_id || undefined,
          uploading: false
        })
      } else {
        setCoverImage(null)
      }

      // Set gallery images (exclude cover if duplicated)
      const urls = Array.isArray(land.images) ? land.images : []
      const filtered = coverUrl ? urls.filter(u => u !== coverUrl) : urls
      const mappedImages = filtered.map((url, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        preview: url,
        url,
        public_id: undefined,
        uploading: false
      }))
      setImages(mappedImages)
    }
  }, [isEditing, land])

  // Generate auto project code (WS + ตัวเลข 7 หลัก)
  React.useEffect(() => {
    if (!isEditing && !formData.projectCode) {
      const timestamp = Date.now()
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const code = `WS${timestamp.toString().slice(-4)}${randomNum}` // รหัส WS + ตัวเลข 7 หลัก
      setFormData(prev => ({ ...prev, projectCode: code }))
    }
  }, [isEditing])

  // คำนวณราคาต่อ ตร.วา อัตโนมัติจากราคาและขนาดที่ดิน (ไร่/งาน/วา หรือ ตร.วา รวม)
  const computeTotalSquareWa = () => {
    const manualSquareWa = parseFloat(formData.squareWa)
    const rai = parseFloat(formData.rai)
    const ngan = parseFloat(formData.ngan)
    const wah = parseFloat(formData.wah)

    if (!isNaN(manualSquareWa) && manualSquareWa > 0) return manualSquareWa

    const totalFromParts =
      (isNaN(rai) ? 0 : rai * 400) +
      (isNaN(ngan) ? 0 : ngan * 100) +
      (isNaN(wah) ? 0 : wah)

    return totalFromParts > 0 ? totalFromParts : 0
  }

  React.useEffect(() => {
    const totalSqWa = computeTotalSquareWa()
    if (totalSqWa > 0) {
      // คำนวณราคาต่อ ตร.วา
      let pricePerSqWa = 0
      let rentPricePerSqWa = 0

      const price = parseFloat(formData.price)
      const rent = parseFloat(formData.rentPrice)
      if (!isNaN(price) && price > 0) pricePerSqWa = parseFloat((price / totalSqWa).toFixed(2))
      if (!isNaN(rent) && rent > 0) rentPricePerSqWa = parseFloat((rent / totalSqWa).toFixed(2))

      // คำนวณราคาต่อ ตร.ม. (1 ตร.วา = 4 ตร.ม.)
      const pricePerSqm = pricePerSqWa > 0 ? parseFloat((pricePerSqWa / 4).toFixed(2)) : 0
      const rentPricePerSqm = rentPricePerSqWa > 0 ? parseFloat((rentPricePerSqWa / 4).toFixed(2)) : 0

      const next = { ...formData }
      if (pricePerSqWa > 0) next.pricePerSqWa = String(pricePerSqWa)
      if (pricePerSqm > 0) next.pricePerSqm = String(pricePerSqm)
      if (rentPricePerSqWa > 0) next.rentPricePerSqWa = String(rentPricePerSqWa)
      if (rentPricePerSqm > 0) next.rentPricePerSqm = String(rentPricePerSqm)
      setFormData(next)
    }
  }, [formData.price, formData.rentPrice, formData.status, formData.squareWa, formData.rai, formData.ngan, formData.wah])





  // Handle cover image upload (local preview only)
  const handleCoverImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 10MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }

    try {
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadMultiple([file])
      
      if (response.success) {
        const uploaded = response.data?.[0] || response.data // Get first file from array
        const imageData = {
          id: Date.now().toString(),
          preview: uploaded.url,
          url: uploaded.url,
          public_id: uploaded.public_id,
          uploading: false
        }
        setCoverImage(imageData)
      } else {
        throw new Error(response.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading cover image:', error)
      alert(`อัปโหลดรูปภาพหน้าปกไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const preview = URL.createObjectURL(file)
      setCoverImage({
        id: Date.now().toString(),
        preview: preview,
        file: file,
        isExisting: false,
      })
    }
  }

  // Handle multiple images upload (local preview only)
  const handleImagesUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (images.length + files.length > 15) {
      alert('สามารถอัพโหลดรูปภาพได้สูงสุด 15 รูป')
      return
    }
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 10MB: ' + file.name)
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น: ' + file.name)
        return
      }
    }
    
    try {
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadMultiple(files)
      
      if (response.success) {
        const newImages = response.data.map((imageData, idx) => ({
          id: `${Date.now()}-${idx}`,
          preview: imageData.url,
          url: imageData.url,
          public_id: imageData.public_id,
          uploading: false,
        }))
        setImages(prev => [...prev, ...newImages])
      } else {
        throw new Error(response.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const newImages = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        preview: URL.createObjectURL(file),
        file: file,
        isExisting: false,
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

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
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadMultiple(files)
      
      if (response.success) {
        const newImages = response.data.map((imageData, idx) => ({
          id: `${Date.now()}-${idx}`,
          preview: imageData.url,
          url: imageData.url,
          public_id: imageData.public_id,
          uploading: false,
        }))
        setImages(prev => [...prev, ...newImages])
      } else {
        throw new Error(response.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const newImages = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        preview: URL.createObjectURL(file),
        file: file,
        isExisting: false,
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleImageUpload = async (file, isCover = false) => {
    try {
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadSingle(file)
      
      if (response.success) {
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
          setImages(prev => [...prev, imageData])
        }
      } else {
        throw new Error(response.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const preview = URL.createObjectURL(file)
      if (isCover) {
        setCoverImage({
          id: Date.now().toString(),
          preview: preview,
          file: file,
          isExisting: false,
        })
      } else {
        setImages(prev => [...prev, { 
          id: `${Date.now()}-${prev.length}`, 
          preview, 
          file,
          isExisting: false,
        }])
      }
    }
  }

  const handleRemoveImage = (imageId, isCover = false) => {
    if (isCover) {
      setCoverImage(null)
    } else {
      setImages(prev => prev.filter(img => img.id !== imageId))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title) newErrors.title = 'กรุณากรอกชื่อโครงการ'
    if (!formData.status) newErrors.status = 'กรุณาเลือกสถานะ'
    if (!formData.price && formData.status !== 'rent') newErrors.price = 'กรุณากรอกราคา'
    if (!formData.location) newErrors.location = 'กรุณากรอกสถานที่'
    if (!formData.area) newErrors.area = 'กรุณากรอกพื้นที่'
    if (!formData.landOwnership) newErrors.landOwnership = 'กรุณาเลือกกรรมสิทธ์ที่ดิน'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    const payload = buildPayload()
    try {
      // Prepare images for API: separate cover and gallery
      const cover_image = coverImage?.url || coverImage?.preview || null
      const galleryImages = images.map(img => ({ url: img.url || img.preview, public_id: img.public_id }))

      const apiPayload = {
        title: payload.title,
        status: payload.status,
        price: payload.price,
        rent_price: payload.rentPrice,
        location: formData.location,
        google_map_url: formData.googleMapUrl,
        nearby_transport: formData.nearbyTransport,
        selected_stations: formData.selectedStations, // เพิ่มสถานีที่เลือก
        listing_type: formData.listingType,
        description: payload.description,
        area: payload.area,
        rai: payload.rai,
        ngan: payload.ngan,
        wah: payload.wah,
        square_wa: payload.squareWa,
        price_per_sq_wa: payload.pricePerSqWa,
        land_ownership: payload.landOwnership,
        view: payload.view,
        unit_number: payload.unitNumber,
        seo_tags: formData.seoTags,
        images: galleryImages,
        cover_image,
      }

      const { landAPI } = await import('../../lib/api')
      if (isEditing && land?.id) {
        await landAPI.update(land.id, apiPayload)
      } else {
        await landAPI.create(apiPayload)
      }

      if (onSave) onSave(apiPayload)
      if (onBack) onBack()
    } catch (err) {
      console.error('Save land failed:', err)
      alert(err.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const buildPayload = () => {
    return {
      title: formData.title,
      description: formData.description,
      type: 'land',
      status: formData.status,
      price: formData.price ? Number(formData.price) : 0,
      rentPrice: formData.rentPrice ? Number(formData.rentPrice) : 0,
      area: Number(formData.area) || 0,
      squareWa: Number(formData.squareWa || 0),
      rai: Number(formData.rai || 0),
      ngan: Number(formData.ngan || 0),
      wah: Number(formData.wah || 0),
      landOwnership: formData.landOwnership,
      address: formData.address,
      district: formData.district,
      province: formData.province,
      postalCode: formData.postalCode,
      location: [formData.district, formData.province].filter(Boolean).join(', '),
      notes: formData.notes,
      pricePerSqWa: formData.pricePerSqWa ? Number(formData.pricePerSqWa) : 0,
      view: formData.view,
      unitNumber: formData.unitNumber,
      coverImage: coverImage || null,
      images: images,
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
              {isEditing ? 'แก้ไขข้อมูลที่ดิน' : 'เพิ่มที่ดินใหม่'}
            </h1>
            <p className="text-gray-600 font-prompt mt-1">
              กรอกข้อมูลที่ดินให้ครบถ้วน
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">


        {/* ข้อมูลพื้นฐาน */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Landmark className="h-6 w-6 mr-3 text-blue-600" />
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
                placeholder="เช่น ที่ดินรามคำแหง พร้อมสร้างบ้าน"
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
                เลือกสถานะของผู้ประกาศ: เจ้าของที่ดิน หรือ ตัวแทนพิเศษอสังหาริมทรัพย์
              </p>
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
                  { value: 'both', label: 'ขายและเช่า', icon: Landmark, color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' }
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
              <label className="block text-sm font-medium text-gray-3 font-prompt">
                ประเภททรัพย์ *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'land', label: 'ที่ดินเปล่า', icon: Landmark, color: 'from-orange-500 to-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
                  { value: 'land_with_building', label: 'ที่ดินพร้อมสิ่งปลูกสร้าง', icon: Landmark, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' }
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

            {/* กรรมสิทธ์ที่ดิน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                กรรมสิทธ์ที่ดิน *
              </label>
              <select
                value={formData.landOwnership}
                onChange={(e) => handleInputChange('landOwnership', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="thai">สัญชาติไทย</option>
                <option value="foreign">สัญชาติไทย/ต่างชาติ</option>
              </select>
              {errors.landOwnership && <p className="text-red-500 text-sm mt-1">{errors.landOwnership}</p>}
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
            <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <ReactQuill
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="อธิบายรายละเอียดของที่ดิน เช่น สภาพหน้าที่ การตกแต่ง สิ่งอำนวยความสะดวก..."
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
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
                    handleImagesUpload(e)
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
                    
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {/* {uploadProgress > 0 && ( // Removed as per new_code
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )} */}
          
          {/* {images.length > 0 && ( // Removed as per new_code
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
          )} */}
          
          {/* {uploadProgress > 0 && ( // Removed as per new_code
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )} */}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-prompt">
              <span className="font-medium">💡 คำแนะนำ:</span> รูปภาพหน้าปกจะแสดงเป็นรูปหลักในรายการ 
              รูปภาพเพิ่มเติมจะแสดงในแกลลอรี่ของประกาศ สามารถอัปโหลดได้สูงสุด 100 รูป
            </p>
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
                placeholder="เช่น ที่ดิน, รามคำแหง, ลุมพินี, ขาย, เช่า"
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

        {/* ข้อมูลอสังหาริมทรัพย์ */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Landmark className="h-6 w-6 mr-3 text-blue-600" />
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
                  className={errors.area ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ม.</span>
                </div>
              </div>
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            {/* ตารางวา */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ตารางวา
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.squareWa}
                  onChange={(e) => handleInputChange('squareWa', e.target.value)}
                  placeholder="เช่น 25.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตารางวา</span>
                </div>
              </div>
            </div>

            {/* ไร่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ไร่
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.rai}
                  onChange={(e) => handleInputChange('rai', e.target.value)}
                  placeholder="เช่น 2"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ไร่</span>
                </div>
              </div>
            </div>

            {/* งาน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                งาน
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.ngan}
                  onChange={(e) => handleInputChange('ngan', e.target.value)}
                  placeholder="เช่น 1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">งาน</span>
                </div>
              </div>
            </div>

            {/* วา */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                วา
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.wah}
                  onChange={(e) => handleInputChange('wah', e.target.value)}
                  placeholder="เช่น 50.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">วา</span>
                </div>
              </div>
            </div>

            {/* ราคาขายต่อ ตร.ม. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
              </label>
              <div className="relative">
                <Input
                  value={formData.pricePerSqm ? `฿${parseFloat(formData.pricePerSqm).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ม.` : ''}
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
                  value={formData.rentPricePerSqm ? `฿${parseFloat(formData.rentPricePerSqm).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ม./เดือน` : ''}
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

            {/* เลขที่ยูนิต */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                เลขที่ยูนิต
              </label>
              <Input
                value={formData.unitNumber}
                onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                placeholder="เช่น A-101 หรือ 15/123"
              />
            </div>

            {/* ราคาต่อ sq.wa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาต่อ sq.wa
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.pricePerSqWa}
                  onChange={(e) => handleInputChange('pricePerSqWa', e.target.value)}
                  placeholder="เช่น 50000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">฿/sq.wa</span>
                </div>
              </div>
            </div>

            {/* วิวที่มองเห็น */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                วิวที่มองเห็น
              </label>
              <Input
                value={formData.view}
                onChange={(e) => handleInputChange('view', e.target.value)}
                placeholder="เช่น วิวเมือง, วิวแม่น้ำ, วิวภูเขา, วิวทะเล"
              />
            </div>
          </div>
        </Card>



        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
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

export default LandForm