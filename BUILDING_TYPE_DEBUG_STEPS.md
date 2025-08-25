# ขั้นตอนการ Debug ฟิลด์ประเภทอาคาร

## 🚨 ปัญหาที่พบ

**ฟิลด์ประเภทอาคารไม่แสดงขึ้นมาเมื่อกดแก้ไข**

## 🔍 สาเหตุที่เป็นไปได้

### 1. **ฟิลด์ project_type ไม่ถูกส่งมาจาก API**
- API ไม่ส่ง `project_type` กลับมา
- `project_type` เป็น null หรือ undefined

### 2. **ฟิลด์ project_type ไม่ตรงกับเงื่อนไข**
- `shouldShowBuildingType()` ต้องการ `'คอนโดมิเนียม'` หรือ `'อพาร์ตเมนท์'`
- แต่ `project_type` อาจเป็นค่าอื่น

### 3. **ข้อมูลไม่ถูกตั้งค่าใน formData**
- `formData.project_type` ไม่ถูกต้อง
- การอัปเดต formData ล้มเหลว

## 🛠️ การ Debug ที่ทำไป

### 1. **เพิ่ม Console.log ใน Frontend**

#### ใน useEffect ที่โหลดข้อมูล:
```javascript
console.log('✅ Form data set:', {
  selected_stations: projectSelectedStations,
  building_type: projectBuildingType,
  building_type_original: project.building_type,
  building_type_type: typeof project.building_type,
  project_type: project.project_type,           // ← เพิ่ม
  project_type_type: typeof project.project_type, // ← เพิ่ม
  all_project_data: project                     // ← เพิ่ม
});
```

#### ในฟังก์ชัน shouldShowBuildingType:
```javascript
const shouldShowBuildingType = () => {
  const shouldShow = formData.project_type === 'คอนโดมิเนียม' || formData.project_type === 'อพาร์ตเมนท์';
  console.log('🔍 Should show building type:', shouldShow, 'Project type:', formData.project_type, 'Form data:', formData);
  return shouldShow;
};
```

### 2. **เพิ่ม Console.log ใน Backend API**

#### ใน PUT /api/projects/:id:
```javascript
console.log('🔍 Response data - project_type:', project_type || existingProject[0].project_type);
```

## 📋 ขั้นตอนการทดสอบ

### 1. **เปิดฟอร์มแก้ไขโครงการ**
- เปิด Developer Tools (F12)
- ไปที่ Console tab

### 2. **ดู Console Log**
ควรจะเห็น:
```
🔍 Project data received: { ... }
🔍 Building type: Low-rise Type: string
🔍 Selected stations: [ 'phraek_sa', 'kheha' ] Type: object
✅ Form data set: { ... }
🔍 Should show building type: true Project type: คอนโดมิเนียม Form data: { ... }
```

### 3. **ตรวจสอบข้อมูลที่สำคัญ**
- `project_type` ควรเป็น `'คอนโดมิเนียม'` หรือ `'อพาร์ตเมนท์'`
- `building_type` ควรเป็น `["Low-rise"]` (array)
- `shouldShowBuildingType()` ควร return `true`

## 🎯 ผลลัพธ์ที่คาดหวัง

### 1. **ถ้า project_type ถูกต้อง**
- ฟิลด์ประเภทอาคารจะแสดงขึ้นมา
- ปุ่ม High-rise และ Low-rise จะปรากฏ
- Low-rise จะแสดงสถานะถูกเลือก

### 2. **ถ้า project_type ไม่ถูกต้อง**
- ฟิลด์ประเภทอาคารจะไม่แสดง
- Console จะแสดง `shouldShowBuildingType: false`

### 3. **ถ้า building_type ไม่ถูกต้อง**
- Console จะแสดง warning เกี่ยวกับ building_type
- ฟิลด์จะแสดงแต่ไม่มีค่าที่ถูกเลือก

## 🔧 การแก้ไขที่อาจต้องทำ

### 1. **แก้ไข project_type ในฐานข้อมูล**
```sql
UPDATE projects 
SET project_type = 'คอนโดมิเนียม' 
WHERE id = 8;
```

### 2. **แก้ไขการส่งข้อมูลใน API**
- ตรวจสอบว่า API ส่ง `project_type` ครบถ้วน
- ตรวจสอบการจัดการค่า null/undefined

### 3. **แก้ไขการแสดงผลในฟอร์ม**
- ตรวจสอบเงื่อนไขใน `shouldShowBuildingType()`
- ตรวจสอบการตั้งค่า `formData.project_type`

## 📝 ขั้นตอนต่อไป

1. **เปิดฟอร์มแก้ไขและดู Console**
2. **แจ้งผลลัพธ์ที่เห็นใน Console**
3. **ฉันจะช่วยวิเคราะห์และแก้ไขปัญหา**

**ลองเปิดฟอร์มแก้ไขและดู Console log ดูครับ จะเห็นข้อมูลที่แท้จริงที่ได้รับจาก API!** 🔍



















