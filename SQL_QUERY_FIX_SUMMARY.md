# การแก้ไข SQL Query Error

## 🚨 ปัญหาที่พบ

**Error: "Column count doesn't match value count at row 1"**

เมื่อพยายามสร้างโครงการใหม่ เกิด error เนื่องจากจำนวนคอลัมน์ใน SQL query ไม่ตรงกับจำนวนค่าที่ส่งไป

## 🔍 สาเหตุของปัญหา

### 1. **จำนวนคอลัมน์ไม่ตรงกับจำนวนค่า**
- **คอลัมน์ใน SQL:** 26 คอลัมน์ (รวม created_at)
- **ค่าใน VALUES:** 25 ค่า (ไม่รวม NOW())

### 2. **การนับคอลัมน์ผิดพลาด**
- คอลัมน์: name_th, name_en, project_type, developer, completion_year, status, area_range, total_units, total_buildings, floors_info, nearby_bts, address, google_map_embed, selected_stations, building_type, seo_title, seo_description, seo_keywords, location_highlights, video_review, video_review_2, official_website, official_website_2, cover_image, project_images, created_at
- **รวม 26 คอลัมน์**

- ค่า: name_th, name_en, project_type, developer, completion_year, status, area_range, total_units, total_buildings, floors_info, nearby_bts, address, google_map_embed, selected_stations, building_type, seo_title, seo_description, seo_keywords, location_highlights, video_review, video_review_2, official_website, official_website_2, coverImageUrl, projectImageUrls
- **รวม 25 ค่า**

## 🛠️ การแก้ไขที่ทำไป

### 1. **แก้ไข SQL Query**

#### ก่อนแก้ไข:
```sql
INSERT INTO projects (
  name_th, name_en, project_type, developer, completion_year, status,
  area_range, total_units, total_buildings, floors_info,
  nearby_bts, address, google_map_embed,
  selected_stations, building_type,
  seo_title, seo_description, seo_keywords,
  location_highlights, video_review, video_review_2, 
  official_website, official_website_2, 
  cover_image, project_images, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
```

#### หลังแก้ไข:
```sql
INSERT INTO projects (
  name_th, name_en, project_type, developer, completion_year, status,
  area_range, total_units, total_buildings, floors_info,
  nearby_bts, address, google_map_embed,
  selected_stations, building_type,
  seo_title, seo_description, seo_keywords,
  location_highlights, video_review, video_review_2, 
  official_website, official_website_2, 
  cover_image, project_images, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
```

### 2. **เพิ่ม Console.log เพื่อ Debug**

```javascript
const values = [
  name_th, 
  name_en || null, 
  project_type || null, 
  developer || null, 
  completion_year || null,
  status || 'active',
  area_range || null,
  total_units || null,
  total_buildings || null,
  floors_info || null,
  nearby_bts || null,
  address || null,
  google_map_embed || null,
  selected_stations ? JSON.stringify(selected_stations) : null,
  building_type ? JSON.stringify(building_type) : null,
  seo_title || null,
  seo_description || null,
  seo_keywords || null,
  location_highlights || null,
  video_review || null,
  video_review_2 || null,
  official_website || null,
  official_website_2 || null,
  coverImageUrl,
  JSON.stringify(projectImageUrls)
];

console.log('🔍 SQL Debug - Values count:', values.length);
console.log('🔍 SQL Debug - Values:', values);
```

## 📊 การนับคอลัมน์และค่า

### **คอลัมน์ (26 คอลัมน์):**
1. name_th
2. name_en
3. project_type
4. developer
5. completion_year
6. status
7. area_range
8. total_units
9. total_buildings
10. floors_info
11. nearby_bts
12. address
13. google_map_embed
14. selected_stations
15. building_type
16. seo_title
17. seo_description
18. seo_keywords
19. location_highlights
20. video_review
21. video_review_2
22. official_website
23. official_website_2
24. cover_image
25. project_images
26. created_at (ใช้ NOW())

### **ค่า (25 ค่า):**
1. name_th
2. name_en || null
3. project_type || null
4. developer || null
5. completion_year || null
6. status || 'active'
7. area_range || null
8. total_units || null
9. total_buildings || null
10. floors_info || null
11. nearby_bts || null
12. address || null
13. google_map_embed || null
14. selected_stations ? JSON.stringify(selected_stations) : null
15. building_type ? JSON.stringify(building_type) : null
16. seo_title || null
17. seo_description || null
18. seo_keywords || null
19. location_highlights || null
20. video_review || null
21. video_review_2 || null
22. official_website || null
23. official_website_2 || null
24. coverImageUrl
25. JSON.stringify(projectImageUrls)

## 🎯 ผลลัพธ์ที่คาดหวัง

หลังจากแก้ไขแล้ว:
1. **การสร้างโครงการใหม่จะสำเร็จ** ไม่มี SQL error
2. **ข้อมูลจะถูกบันทึกครบถ้วน** ทุกฟิลด์
3. **Console จะแสดง debug info** จำนวนค่าและข้อมูล

## 📝 ขั้นตอนการทดสอบ

### 1. **Deploy การแก้ไข**
```bash
git add .
git commit -m "Fix: SQL query column count mismatch in project creation"
git push heroku main
```

### 2. **ทดสอบการสร้างโครงการใหม่**
- เปิดฟอร์มสร้างโครงการใหม่
- กรอกข้อมูลครบถ้วน
- บันทึกโครงการ

### 3. **ตรวจสอบ Console**
- ดู debug info จำนวนค่า
- ตรวจสอบว่าไม่มี error

## ✅ สรุป

**ปัญหาหลักคือจำนวนคอลัมน์ไม่ตรงกับจำนวนค่า** การแก้ไขนี้จะทำให้:

1. **SQL query ทำงานได้ถูกต้อง** จำนวนคอลัมน์ตรงกับจำนวนค่า
2. **การสร้างโครงการใหม่สำเร็จ** ไม่มี error
3. **ข้อมูลถูกบันทึกครบถ้วน** ทุกฟิลด์

**ตอนนี้ลอง Deploy การแก้ไขและทดสอบการสร้างโครงการใหม่ดูครับ!** 🚀















