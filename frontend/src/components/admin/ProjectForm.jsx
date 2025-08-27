import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  FaBuilding, FaCar, FaLock, FaShuttleVan, FaBolt,
  FaVideo, FaUsers, FaDumbbell, FaSwimmingPool, FaBath,
  FaChild, FaFilm, FaPaw, FaLaptop, FaHamburger, FaCoffee,
  FaDoorOpen, FaCouch, FaHome, FaStore, FaBook, FaTshirt, FaSeedling, FaWifi, FaSubway, FaUtensils
} from 'react-icons/fa';

import { MdLocalDining, MdSportsTennis } from 'react-icons/md';
import { GiGolfTee } from 'react-icons/gi';

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
    selected_stations: [],
    address: '',
    google_map_embed: '',
    
    // ประเภทอาคาร (สำหรับคอนโด/อพาร์ตเมนท์)
    building_type: [],
    
    // SEO
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    
    // จุดเด่น
    location_highlights: '',
    
    // สิ่งอำนวยความสะดวก
    facilities: [],
    
    // สื่อ
    video_review: '',
    video_review_2: '',
    official_website: '',
    official_website_2: '',
    
    // รูปภาพ
    cover_image: null,
    project_images: [],
    
    // รูปภาพที่ถูกลบ (สำหรับโหมดแก้ไข)
    deleted_images: [],
    deleted_cover_image: null
  });

  const [facilitiesList, setFacilitiesList] = useState([
    // Transport
    { id: 'passengerLift', label: 'Passenger Lift', category: 'transport', icon: 'lift' },
    { id: 'shuttleService', label: 'Shuttle Service', category: 'transport', icon: 'shuttle' },
    { id: 'evCharger', label: 'EV Charger', category: 'transport', icon: 'ev-charger' },
    { id: 'parking', label: 'Parking', category: 'transport', icon: 'parking' },
    
    // Security
    { id: 'security24h', label: '24-hour security with CCTV', category: 'security', icon: 'cctv' },
    { id: 'accessControl', label: 'Access control System', category: 'security', icon: 'access-control' },
    
    // Recreation
    { id: 'fitness', label: 'Fitness / Gym', category: 'recreation', icon: 'gym' },
    { id: 'swimmingPool', label: 'Swimming Pool', category: 'recreation', icon: 'pool' },
    { id: 'sauna', label: 'Sauna', category: 'recreation', icon: 'sauna' },
    { id: 'steamRoom', label: 'Steam Room', category: 'recreation', icon: 'steam' },
    { id: 'sportArea', label: 'Sport Area', category: 'recreation', icon: 'sport' },
    { id: 'golfSimulator', label: 'Golf simulator', category: 'recreation', icon: 'golf' },
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
    { id: 'charoen_nakhon', name: 'MRT Charoen Nakhon (เจริญนคร)', line: 'MRT' },
    { id: 'khlong_san', name: 'MRT Khlong San (คลองสาน)', line: 'MRT' },
    // Missing Blue Line Thonburi side
    { id: 'bang_phai', name: 'MRT Bang Phai (บางไผ่)', line: 'MRT' },
    { id: 'bang_wa_mrt', name: 'MRT Bang Wa (บางหว้า)', line: 'MRT' },
    // Blue Line extensions Thonburi side already included above
    // Yellow Line (Lat Phrao – Samrong)
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
    // Pink Line (Khae Rai – Min Buri)
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

  // State Railway of Thailand (SRT Red Line)
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

  // ฟังก์ชันสำหรับแสดง React Icons
  const getFacilityIcon = (iconName) => {
    const iconMap = {
      // Transport
      'lift': <img src="https://img.icons8.com/dotty/80/elevator-doors.png" alt="Passenger Lift" className="w-5 h-5" />,
      'shuttle': <FaShuttleVan className="w-5 h-5" />,
      'ev-charger': <FaBolt className="w-5 h-5" />,
      'parking': <FaCar className="w-5 h-5" />,
      
      // Security
      'cctv': <FaVideo className="w-5 h-5" />,
      'access-control': <FaLock className="w-5 h-5" />,
      
      // Recreation
      'gym': <FaDumbbell className="w-5 h-5" />,
      'pool': <FaSwimmingPool className="w-5 h-5" />,
      'sauna': <img src="https://img.icons8.com/ios-glyphs/30/sauna.png" alt="Sauna" className="w-5 h-5" />,
      'steam': <FaBath className="w-5 h-5" />,
      'sport': <MdSportsTennis className="w-5 h-5" />,
      'golf': <GiGolfTee className="w-5 h-5" />,
      'playground': <FaChild className="w-5 h-5" />,
      'cinema': <FaFilm className="w-5 h-5" />,
      
      // Pet & Business
      'pet': <FaPaw className="w-5 h-5" />,
      'meeting': <FaUsers className="w-5 h-5" />,
      'coworking': <FaLaptop className="w-5 h-5" />,
      
      // Dining
      'restaurant': <FaHamburger className="w-5 h-5" />,
      'cafe': <FaCoffee className="w-5 h-5" />,
      'dining-room': <MdLocalDining className="w-5 h-5" />,
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
      

    };
    
    return iconMap[iconName] || <FaBuilding className="w-5 h-5" />;
  };

  // โหลดข้อมูล project ถ้ามี
  useEffect(() => {
    if (project) {
      console.log('🔍 Project data received:', project);
      console.log('🔍 Building type:', project.building_type, 'Type:', typeof project.building_type);
      
      // จัดการ building_type
      let projectBuildingType = project.building_type;
      console.log('🔍 Original building_type:', projectBuildingType, 'Type:', typeof projectBuildingType);
      
      // ตรวจสอบว่า building_type เป็น string (JSON) หรือไม่
      if (typeof projectBuildingType === 'string') {
        try {
          projectBuildingType = JSON.parse(projectBuildingType);
          console.log('✅ Parsed building_type:', projectBuildingType);
        } catch (e) {
          console.warn('Failed to parse building_type as JSON, treating as single value:', e);
          // ถ้า parse JSON ไม่ได้ ให้ถือว่าเป็นค่าเดียว
          projectBuildingType = [projectBuildingType];
        }
      }
      
      // ตรวจสอบว่า building_type เป็น array หรือไม่
      if (!Array.isArray(projectBuildingType)) {
        console.warn('building_type is not array, converting to array:', projectBuildingType);
        // ถ้าไม่ใช่ array ให้แปลงเป็น array
        projectBuildingType = projectBuildingType ? [projectBuildingType] : [];
      }
      
      console.log('🔍 Final processed building_type:', projectBuildingType);
      
      // จัดการ selected_stations
      let projectSelectedStations = project.selected_stations;
      
      // ตรวจสอบว่า selected_stations เป็น string (JSON) หรือไม่
      if (typeof projectSelectedStations === 'string') {
        try {
          projectSelectedStations = JSON.parse(projectSelectedStations);
          console.log('✅ Parsed selected_stations:', projectSelectedStations);
        } catch (e) {
          console.warn('Failed to parse selected_stations:', e);
          projectSelectedStations = [];
        }
      }
      
      // ตรวจสอบว่า selected_stations เป็น array หรือไม่
      if (!Array.isArray(projectSelectedStations)) {
        console.warn('selected_stations is not array:', projectSelectedStations);
        projectSelectedStations = [];
      }
      
      setFormData({
        ...project,
        video_review_2: project.video_review_2 || '',
        official_website_2: project.official_website_2 || '',
        selected_stations: projectSelectedStations,
        building_type: projectBuildingType,
        seo_title: project.seo_title || '',
        seo_description: project.seo_description || '',
        seo_keywords: project.seo_keywords || '',
        project_images: Array.isArray(project.project_images) ? project.project_images : [],
        cover_image: project.cover_image || null,
        facilities: Array.isArray(project.facilities) ? project.facilities : []
      });
      
      console.log('✅ Form data set with building_type:', projectBuildingType);
      
      // จัดการ facilities
      let projectFacilities = project.facilities;
      
      // ตรวจสอบว่า facilities เป็น string (JSON) หรือไม่
      if (typeof projectFacilities === 'string') {
        try {
          projectFacilities = JSON.parse(projectFacilities);
        } catch (e) {
          console.warn('Failed to parse facilities:', e);
          projectFacilities = [];
        }
      }
      
      // ตั้งค่า selected facilities
      if (projectFacilities && Array.isArray(projectFacilities)) {
        setSelectedFacilities(projectFacilities);
      } else {
        setSelectedFacilities([]);
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

  // ฟังก์ชันจัดการการเลือกสถานี
  const handleStationToggle = (stationId) => {
    setFormData(prev => {
      const currentStations = prev.selected_stations && Array.isArray(prev.selected_stations) ? prev.selected_stations : [];
      
      if (currentStations.includes(stationId)) {
        return {
          ...prev,
          selected_stations: currentStations.filter(id => id !== stationId)
        };
      } else {
        return {
          ...prev,
          selected_stations: [...currentStations, stationId]
        };
      }
    });
  };

  // ฟังก์ชันตรวจสอบสถานีที่เลือก
  const isStationSelected = (stationId) => {
    const isSelected = formData.selected_stations && Array.isArray(formData.selected_stations) && formData.selected_stations.includes(stationId);
    return isSelected;
  };

  // ฟังก์ชันจัดการการเลือกประเภทอาคาร
  const handleBuildingTypeToggle = (type) => {
    console.log('🔍 Toggling building type:', type);
    console.log('🔍 Current formData.building_type:', formData.building_type);
    
    setFormData(prev => {
      const currentTypes = prev.building_type && Array.isArray(prev.building_type) ? prev.building_type : [];
      console.log('🔍 Current building types from prev:', currentTypes);
      
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

  // ฟังก์ชันตรวจสอบว่าควรแสดงประเภทอาคารหรือไม่
  const shouldShowBuildingType = () => {
    // แสดงสำหรับทุกประเภทโครงการ
    return true;
  };

  // State สำหรับการค้นหาสถานี
  const [stationSearchTerm, setStationSearchTerm] = useState('');
  const [showStationDropdown, setShowStationDropdown] = useState(false);

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

  // เพิ่มฟังก์ชันลบรูปภาพเดิม
  const removeExistingProjectImage = (index) => {
    Swal.fire({
      title: 'ลบรูปภาพเดิม',
      text: `คุณต้องการลบรูปภาพเดิมที่ ${index + 1} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        // เพิ่มรูปภาพเดิมที่ถูกลบเข้าไปใน deleted_images
        const imageToDelete = project.project_images[index];
        
        // ตรวจสอบว่ารูปภาพนี้ถูกลบไปแล้วหรือไม่
        const isAlreadyDeleted = formData.deleted_images && formData.deleted_images.some(deletedImg => 
          (deletedImg.id && deletedImg.id === imageToDelete.id) || 
          (deletedImg.url && deletedImg.url === imageToDelete.url)
        );
        
        if (!isAlreadyDeleted) {
          setFormData(prev => ({
            ...prev,
            deleted_images: [...(prev.deleted_images || []), imageToDelete]
          }));
          
          console.log('ลบรูปภาพ:', imageToDelete);
          console.log('รูปภาพที่ถูกลบแล้ว:', [...(formData.deleted_images || []), imageToDelete]);
        }
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
          cover_image: null,
          deleted_cover_image: project?.cover_image || null
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
        // เพิ่มรูปภาพเดิมทั้งหมดเข้าไปใน deleted_images
        if (project && project.project_images && project.project_images.length > 0) {
          setFormData(prev => ({
            ...prev,
            project_images: [],
            deleted_images: [...(prev.deleted_images || []), ...project.project_images]
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            project_images: []
          }));
        }
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
    formDataToSend.append('address', formData.address || '');
    formDataToSend.append('google_map_embed', formData.google_map_embed || '');
    formDataToSend.append('location_highlights', formData.location_highlights || '');
    formDataToSend.append('video_review', formData.video_review || '');
    formDataToSend.append('video_review_2', formData.video_review_2 || '');
    formDataToSend.append('official_website', formData.official_website || '');
    formDataToSend.append('official_website_2', formData.official_website_2 || '');
    
    // เพิ่มสถานีที่เลือก
    if (formData.selected_stations && Array.isArray(formData.selected_stations) && formData.selected_stations.length > 0) {
      // กรองเอาเฉพาะค่าที่ไม่ใช่ '[]' หรือ 'null'
      const validStations = formData.selected_stations.filter(station => 
        station !== '[]' && station !== 'null' && station !== null
      );
      
      if (validStations.length > 0) {
        validStations.forEach(station => {
          formDataToSend.append('selected_stations', station);
        });
        console.log('🔍 Appending valid stations:', validStations);
      } else {
        // ไม่มีสถานีที่ถูกต้อง ให้ส่ง '[]' เพื่อสั่งล้าง
        console.log('🔍 No valid stations found, sending empty array');
        formDataToSend.append('selected_stations', '[]');
      }
    } else {
      // ไม่มีสถานีที่เลือก ให้ส่ง '[]' เพื่อสั่งล้าง
      console.log('🔍 No selected_stations, sending empty array');
      formDataToSend.append('selected_stations', '[]');
    }
    
    // เพิ่มประเภทอาคาร
    console.log('🔍 Submitting building_type:', formData.building_type);
    if (formData.building_type && Array.isArray(formData.building_type) && formData.building_type.length > 0) {
      // กรองเอาเฉพาะค่าที่ไม่ใช่ '[]' หรือ 'null'
      const validBuildingTypes = formData.building_type.filter(type => 
        type !== '[]' && type !== 'null' && type !== null
      );
      
      if (validBuildingTypes.length > 0) {
        validBuildingTypes.forEach(type => {
          formDataToSend.append('building_type', type);
          console.log('🔍 Appending building_type:', type);
        });
      } else {
        // ไม่มีประเภทอาคารที่ถูกต้อง
        console.log('🔍 No valid building types found, sending empty array');
      }
    } else {
      // ไม่มีประเภทอาคารที่เลือก
      console.log('🔍 No building_type, sending empty array');
    }
    
    // เพิ่ม SEO
    formDataToSend.append('seo_title', formData.seo_title || '');
    formDataToSend.append('seo_description', formData.seo_description || '');
    formDataToSend.append('seo_keywords', formData.seo_keywords || '');
    
    // เพิ่ม facilities
    if (selectedFacilities && Array.isArray(selectedFacilities) && selectedFacilities.length > 0) {
      selectedFacilities.forEach(facility => {
        formDataToSend.append('facilities', facility);
      });
    } else {
      // ส่ง array ว่างถ้าไม่มี facilities
      formDataToSend.append('facilities', '[]');
    }


    
    // เพิ่มรูปปก (ถ้ามี)
    if (formData.cover_image) {
      formDataToSend.append('cover_image', formData.cover_image);
    }
    
    // เพิ่มรูปปกเดิม (ถ้ามีและยังไม่ถูกลบ)
    if (project && project.cover_image && !formData.deleted_cover_image) {
      formDataToSend.append('existing_cover_image', JSON.stringify(project.cover_image));
    }
    
    // เพิ่มรูปภาพโครงการ (ถ้ามี)
    if (formData.project_images && formData.project_images.length > 0) {
      formData.project_images.forEach((image, index) => {
        formDataToSend.append('project_images', image);
      });
    }
    
    // เพิ่มรูปภาพเดิม (ถ้ามี) เพื่อให้ API รู้ว่าต้องเก็บไว้ (เฉพาะรูปที่ยังไม่ถูกลบ)
    if (project && project.project_images && project.project_images.length > 0) {
      const remainingImages = project.project_images.filter(image => {
        if (!image) return false;
        
        // ตรวจสอบว่ารูปภาพนี้ถูกลบไปแล้วหรือไม่
        const isDeleted = formData.deleted_images && formData.deleted_images.some(deletedImg => 
          (deletedImg.id && image.id && deletedImg.id === image.id) || 
          (deletedImg.url && image.url && deletedImg.url === image.url)
        );
        
        return !isDeleted;
      });
      
      remainingImages.forEach((image, index) => {
        formDataToSend.append('existing_project_images', JSON.stringify(image));
      });
    }
    
    // เพิ่มข้อมูลรูปภาพที่ถูกลบ (ถ้ามี)
    if (formData.deleted_images && formData.deleted_images.length > 0) {
      formData.deleted_images.forEach((image, index) => {
        formDataToSend.append('deleted_images', JSON.stringify(image));
      });
    }
    
    // เพิ่มข้อมูลรูปปกที่ถูกลบ (ถ้ามี)
    if (formData.deleted_cover_image) {
      formDataToSend.append('deleted_cover_image', JSON.stringify(formData.deleted_cover_image));
    }
    

    
    // แสดง SweetAlert2 สำหรับข้อมูลที่จะส่ง
    Swal.fire({
      title: 'กำลังส่งข้อมูลโครงการ...',
      html: `
        <div class="text-left">
          <p><strong>ชื่อโครงการ:</strong> ${formData.name_th}</p>
          <p><strong>ประเภท:</strong> ${formData.project_type}</p>
          <p><strong>ผู้พัฒนา:</strong> ${formData.developer}</p>
          <p><strong>ประเภทอาคาร:</strong> ${formData.building_type && Array.isArray(formData.building_type) ? formData.building_type.join(', ') : 'ไม่มี'}</p>
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
                <Label htmlFor="name_th">ชื่อโครงการ (ภาษาไทย)</Label>
                <Input
                  id="name_th"
                  value={formData.name_th}
                  onChange={(e) => handleInputChange('name_th', e.target.value)}
                  placeholder="ชื่อโครงการภาษาไทย"
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
                <Label htmlFor="project_type">ประเภทโครงการ</Label>
                <select
                  id="project_type"
                  value={formData.project_type}
                  onChange={(e) => handleInputChange('project_type', e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">เลือกประเภทโครงการ</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="developer">เจ้าของโครงการ / ผู้พัฒนา</Label>
                <Input
                  id="developer"
                  value={formData.developer}
                  onChange={(e) => handleInputChange('developer', e.target.value)}
                  placeholder="ชื่อบริษัทผู้พัฒนา"
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
                <Label htmlFor="status">สถานะโครงการ</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">เลือกสถานะโครงการ</option>
                  {projectStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ประเภทอาคาร (แสดงเฉพาะคอนโด/อพาร์ตเมนท์) */}
            {shouldShowBuildingType() && (
              <div className="space-y-3">
                <Label>ประเภทอาคาร</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                      <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="font-medium">High-rise</div>
                      <div className="text-xs opacity-75">อาคารสูง</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {isBuildingTypeSelected('high-rise') ? '✅ เลือกแล้ว' : '❌ ไม่ได้เลือก'}
                      </div>
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
                      <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="font-medium">Low-rise</div>
                      <div className="text-xs opacity-75">อาคารต่ำ</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {isBuildingTypeSelected('low-rise') ? '✅ เลือกแล้ว' : '❌ ไม่ได้เลือก'}
                      </div>
                    </div>
                  </button>
                </div>
                
                {/* แสดงประเภทที่เลือก */}
                {formData.building_type && Array.isArray(formData.building_type) && formData.building_type.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-2">
                      ประเภทอาคารที่เลือก: {JSON.stringify(formData.building_type)}
                    </p>
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
            )}

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

            {/* ที่ตั้งรถไฟฟ้า (ไม่บังคับ) */}
            <div className="space-y-4">
              <div>
                <Label>ที่ตั้งรถไฟฟ้า (ไม่บังคับ)</Label>
                <p className="text-sm text-gray-600 mt-1">เลือกสถานีรถไฟฟ้าที่ใกล้เคียงกับโครงการ (สามารถข้ามได้)</p>
              </div>
              
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
              {formData.selected_stations && formData.selected_stations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-blue-700">
                      สถานีที่เลือก ({formData.selected_stations.length} สถานี)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, selected_stations: [] }));
                        // ส่งสัญญาณล้างค่าแบบชัดเจนให้ backend ทราบ
                        const fd = new FormData();
                        fd.append('selected_stations', '[]');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      ลบทั้งหมด
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.selected_stations.map((stationId) => {
                      const allStations = [...btsStations, ...mrtStations, ...arlStations, ...srtStations];
                      const station = allStations.find(s => s.id === stationId);
                      return station ? (
                        <span
                          key={stationId}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          <FaSubway className="w-4 h-4 mr-1" />
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>พิมพ์ชื่อสถานีหรือสายรถไฟฟ้าเพื่อค้นหา เช่น "อโศก", "BTS", "MRT"</span>
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
              <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
                <ReactQuill
                  value={formData.location_highlights}
                  onChange={(value) => handleInputChange('location_highlights', value)}
                  placeholder="ใกล้อะไรบ้าง เช่น ห้าง, โรงเรียน, โรงพยาบาล"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                  style={{ height: '150px' }}
                  className="font-prompt"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">ใช้เครื่องมือด้านบนเพื่อจัดรูปแบบข้อความ</p>
            </div>

            {/* SEO สำหรับ Google */}
            <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <Label className="text-lg font-semibold text-blue-800">SEO สำหรับ Google</Label>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_title" className="text-blue-700 font-medium">
                    SEO Title (ชื่อที่แสดงใน Google) *
                  </Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    placeholder="คอนโดหรูใจกลางสุขุมวิท ใกล้ BTS อโศก - Park Origin Thonglor"
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>ควรมีชื่อโครงการและคำสำคัญที่คนค้นหา</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_description" className="text-blue-700 font-medium">
                    SEO Description (คำอธิบายใน Google) *
                  </Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    placeholder="คอนโดหรูใจกลางสุขุมวิท ใกล้ BTS อโศก พร้อมสิ่งอำนวยความสะดวกครบครัน เริ่มต้น 2.5 ล้านบาท"
                    rows={3}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>อธิบายจุดเด่นของโครงการใน 150-160 ตัวอักษร</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo_keywords" className="text-blue-700 font-medium">
                    SEO Keywords (คำค้นหา) *
                  </Label>
                  <Textarea
                    id="seo_keywords"
                    value={formData.seo_keywords}
                    onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                    placeholder="คอนโดสุขุมวิท, คอนโดอโศก, คอนโดทองหล่อ, คอนโดหรู, คอนโดใกล้รถไฟฟ้า, Park Origin"
                    rows={2}
                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>ใส่คำค้นหาที่คนมักใช้ คั่นด้วยเครื่องหมายจุลภาค (,)</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700 mb-3">ตัวอย่างการแสดงผลใน Google:</h4>
                <div className="space-y-2">
                  <div className="text-blue-600 font-medium text-sm">
                    {formData.seo_title || 'ชื่อโครงการจะแสดงที่นี่'}
                  </div>
                  <div className="text-green-600 text-sm">
                    {formData.seo_title ? window.location.origin + '/project/...' : 'URL จะแสดงที่นี่'}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {formData.seo_description || 'คำอธิบายโครงการจะแสดงที่นี่'}
                  </div>
                </div>
              </div>
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



            {/* สื่อ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="video_review">วิดีโอรีวิวโครงการ (YouTube) - ช่องที่ 1</Label>
                <Input
                  id="video_review"
                  value={formData.video_review}
                  onChange={(e) => handleInputChange('video_review', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video_review_2">วิดีโอรีวิวโครงการ (YouTube) - ช่องที่ 2</Label>
                <Input
                  id="video_review_2"
                  value={formData.video_review_2}
                  onChange={(e) => handleInputChange('video_review_2', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="official_website">เว็บไซต์อย่างเป็นทางการ - ช่องที่ 1</Label>
                <Input
                  id="official_website"
                  value={formData.official_website}
                  onChange={(e) => handleInputChange('official_website', e.target.value)}
                  placeholder="https://www.project-official.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="official_website_2">เว็บไซต์อย่างเป็นทางการ - ช่องที่ 2</Label>
                <Input
                  id="official_website_2"
                  value={formData.official_website_2}
                  onChange={(e) => handleInputChange('official_website_2', e.target.value)}
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
                {(formData.cover_image || (project && project.cover_image && !formData.deleted_cover_image)) && (
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
                          src={formData.cover_image && formData.cover_image instanceof File ? URL.createObjectURL(formData.cover_image) : (project && project.cover_image && !formData.deleted_cover_image ? project.cover_image : '')}
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
                          รูปภาพที่เลือก ({formData.project_images ? formData.project_images.length : 0} รูปใหม่ + {(() => {
                            if (!project || !project.project_images) return 0;
                            return project.project_images.filter(image => {
                              if (!image) return false;
                              
                              // ตรวจสอบว่ารูปภาพนี้ถูกลบไปแล้วหรือไม่
                              const isDeleted = formData.deleted_images && formData.deleted_images.some(deletedImg => 
                                (deletedImg.id && image.id && deletedImg.id === image.id) || 
                                (deletedImg.url && image.url && deletedImg.url === image.url)
                              );
                              
                              return !isDeleted;
                            }).length;
                          })()} รูปเดิม)
                        </p>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {(formData.project_images ? formData.project_images.length : 0) + (() => {
                            if (!project || !project.project_images) return 0;
                            return project.project_images.filter(image => {
                              if (!image) return false;
                              
                              // ตรวจสอบว่ารูปภาพนี้ถูกลบไปแล้วหรือไม่
                              const isDeleted = formData.deleted_images && formData.deleted_images.some(deletedImg => 
                                (deletedImg.id && image.id && deletedImg.id === image.id) || 
                                (deletedImg.url && image.url && deletedImg.url === image.url)
                              );
                              
                              return !isDeleted;
                            }).length;
                          })()}/100 รูป
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
                          {(() => {
                            // กรองเอาเฉพาะรูปที่ยังไม่ถูกลบ
                            const remainingImages = project.project_images.filter(image => {
                              if (!image) return false;
                              
                              // ตรวจสอบว่ารูปภาพนี้ถูกลบไปแล้วหรือไม่
                              const isDeleted = formData.deleted_images && formData.deleted_images.some(deletedImg => 
                                (deletedImg.id && image.id && deletedImg.id === image.id) || 
                                (deletedImg.url && image.url && deletedImg.url === image.url)
                              );
                              
                              console.log('รูปภาพ:', image, 'ถูกลบ:', isDeleted);
                              
                              return !isDeleted;
                            });
                            
                            console.log('รูปภาพที่เหลือ:', remainingImages);
                            console.log('รูปภาพที่ถูกลบ:', formData.deleted_images);
                            
                            // ถ้าไม่มีรูปที่เหลือ ให้แสดงข้อความ
                            if (remainingImages.length === 0) {
                              return (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p>ไม่มีรูปภาพเดิมเหลืออยู่</p>
                                </div>
                              );
                            }
                            
                            // แสดงรูปภาพที่เหลือ
                            return remainingImages.map((image, index) => {
                              // Safety check สำหรับ image
                              if (!image) {
                                return null;
                              }
                              
                              const imageUrl = image.url || image;
                              if (!imageUrl) {
                                return null;
                              }
                              
                              return (
                                <div key={`existing-${image.id || index}`} className="relative group">
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
                                  {/* ปุ่มลบรูปภาพเดิม */}
                                  <button
                                    type="button"
                                    onClick={() => removeExistingProjectImage(project.project_images.indexOf(image))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                    title="ลบรูปภาพเดิม"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            });
                          })()}
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