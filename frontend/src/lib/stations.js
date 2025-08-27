// Centralized station definitions for BTS/MRT and others used across app
// Keep this file as the single source of truth and import where needed

export const btsStations = [
  // Sukhumvit Line (partial)
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

  // Gold Line
  { id: 'krung_thon_buri', name: 'BTS Krung Thon Buri (กรุงธนบุรี)', line: 'BTS' },
  { id: 'charoen_nakhon', name: 'BTS Charoen Nakhon (เจริญนคร)', line: 'BTS' },
  { id: 'khlong_san', name: 'BTS Khlong San (คลองสาน)', line: 'BTS' },
]

export const mrtStations = [
  // Blue Line (partial + extended from admin)
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
  { id: 'thailand_cultural_centre', name: 'MRT Thailand Cultural Centre (ศูนย์การประชุมแห่งชาติสิริกิติ์)', line: 'MRT' },
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
  // Yellow line snippets used in admin
  { id: 'mahat_thai', name: 'MRT Mahat Thai (มหาดไทย)', line: 'MRT' },
  { id: 'lat_phrao_101', name: 'MRT Lat Phrao 101 (ลาดพร้าว 101)', line: 'MRT' },
  { id: 'bang_kapi', name: 'MRT Bang Kapi (บางกะปิ)', line: 'MRT' },
  { id: 'yaek_lam_sali', name: 'MRT Yaek Lam Sali (แยกลำสาลี)', line: 'MRT' },
  { id: 'si_kritha', name: 'MRT Si Kritha (ศรีกรีฑา)', line: 'MRT' },
]

export const arlStations = [
  { id: 'phaya_thai', name: 'Airport Rail Link Phaya Thai (พญาไท)', line: 'ARL' },
  { id: 'ratchaprarop', name: 'Airport Rail Link Ratchaprarop (ราชปรารภ)', line: 'ARL' },
  { id: 'makkasan', name: 'Airport Rail Link Makkasan (มักกะสัน)', line: 'ARL' },
  { id: 'ramkhamhaeng', name: 'Airport Rail Link Ramkhamhaeng (รามคำแหง)', line: 'ARL' },
  { id: 'huamark', name: 'Airport Rail Link Hua Mak (หัวหมาก)', line: 'ARL' },
  { id: 'ban_thap_chang', name: 'Airport Rail Link Ban Thap Chang (บ้านทับช้าง)', line: 'ARL' },
  { id: 'lat_krabang', name: 'Airport Rail Link Lat Krabang (ลาดกระบัง)', line: 'ARL' },
  { id: 'suvarnabhumi', name: 'Airport Rail Link Suvarnabhumi (สุวรรณภูมิ)', line: 'ARL' },
]

export const srtStations = [
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
  { id: 'bang_bamru', name: 'SRT Bang Bamru (บางบำหรุ)', line: 'SRT' },
]

// Build id -> label map
const stationEntries = [...btsStations, ...mrtStations, ...arlStations, ...srtStations]
const idToLabel = stationEntries.reduce((acc, s) => {
  acc[s.id] = s.name
  return acc
}, {})

export const getStationLabelById = (idOrObj) => {
  if (!idOrObj) return ''
  if (typeof idOrObj === 'object') {
    return idOrObj.name || idOrObj.name_th || idOrObj.label || idOrObj.title || ''
  }
  const key = String(idOrObj).trim()
  return idToLabel[key] || key
}

export default {
  btsStations,
  mrtStations,
  getStationLabelById,
}


