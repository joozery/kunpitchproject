# การ Debug ปัญหาฟิลด์ building_type และ selected_stations

## 🚨 ปัญหาที่พบ

**ฟิลด์ `building_type` และ `selected_stations` ไม่แสดงค่าในฟอร์มแก้ไข**

## 🔍 การตรวจสอบที่ทำไป

### 1. **เพิ่ม Console.log ใน Frontend**

#### ใน useEffect ที่โหลดข้อมูล:
```javascript
useEffect(() => {
  if (project) {
    console.log('🔍 Project data received:', project);
    console.log('🔍 Building type:', project.building_type, 'Type:', typeof project.building_type);
    console.log('🔍 Selected stations:', project.selected_stations, 'Type:', typeof project.selected_stations);
    
    // ... การจัดการข้อมูล
    
    console.log('✅ Form data set:', {
      selected_stations: projectSelectedStations,
      building_type: projectBuildingType
    });
  }
}, [project]);
```

#### ในฟังก์ชันตรวจสอบสถานะ:
```javascript
const isStationSelected = (stationId) => {
  const isSelected = formData.selected_stations && Array.isArray(formData.selected_stations) && formData.selected_stations.includes(stationId);
  console.log(`🔍 Station ${stationId} selected:`, isSelected, 'Available stations:', formData.selected_stations);
  return isSelected;
};

const isBuildingTypeSelected = (type) => {
  const isSelected = formData.building_type && Array.isArray(formData.building_type) && formData.building_type.includes(type);
  console.log(`🔍 Building type ${type} selected:`, isSelected, 'Available types:', formData.building_type);
  return isSelected;
};
```

### 2. **เพิ่ม Console.log ใน Backend API**

#### ใน GET /api/projects/:id:
```javascript
console.log('✅ Project fetched successfully');
console.log('🔍 Raw project data:', project);
console.log('🔍 Building type:', project.building_type, 'Type:', typeof project.building_type);
console.log('🔍 Selected stations:', project.selected_stations, 'Type:', typeof project.selected_stations);
console.log('🔍 Final project data:', projectData);
```

## 🛠️ แนวทางแก้ไข

### 1. **ตรวจสอบข้อมูลใน Console**

เปิด Developer Tools (F12) และดู Console เพื่อดู:
- ข้อมูลที่ได้รับจาก API
- ประเภทข้อมูลของ building_type และ selected_stations
- ข้อมูลที่ตั้งค่าใน formData

### 2. **ตรวจสอบฐานข้อมูล**

ตรวจสอบว่าข้อมูลถูกบันทึกในฐานข้อมูลหรือไม่:
```sql
SELECT id, name_th, building_type, selected_stations 
FROM projects 
WHERE id = [PROJECT_ID];
```

### 3. **ตรวจสอบการบันทึกข้อมูล**

ตรวจสอบว่าเมื่อบันทึกโครงการใหม่ ข้อมูลถูกบันทึกครบถ้วนหรือไม่

## 🔍 สาเหตุที่เป็นไปได้

### 1. **ข้อมูลไม่ถูกบันทึกในฐานข้อมูล**
- ฟิลด์ building_type และ selected_stations เป็น NULL
- การบันทึกข้อมูลล้มเหลว

### 2. **ข้อมูลถูกบันทึกเป็น JSON string แต่ไม่ถูก parse**
- ข้อมูลเป็น string แต่ไม่ใช่ JSON ที่ถูกต้อง
- การ parse JSON ล้มเหลว

### 3. **ข้อมูลถูกบันทึกในรูปแบบที่ไม่ถูกต้อง**
- ข้อมูลไม่ใช่ array
- ข้อมูลเป็น object แทน array

### 4. **API ไม่ส่งข้อมูลกลับมา**
- ข้อมูลหายไประหว่างการส่งจาก Backend ไป Frontend

## 📋 ขั้นตอนการ Debug

### 1. **เปิด Console และดู Log**
- ดูข้อมูลที่ได้รับจาก API
- ดูการ parse JSON
- ดูข้อมูลที่ตั้งค่าใน formData

### 2. **ตรวจสอบฐานข้อมูล**
- ดูข้อมูลจริงในตาราง projects
- ตรวจสอบประเภทข้อมูล

### 3. **ทดสอบการบันทึกข้อมูลใหม่**
- สร้างโครงการใหม่ที่มี building_type และ selected_stations
- ตรวจสอบว่าข้อมูลถูกบันทึกหรือไม่

### 4. **ตรวจสอบ Network Tab**
- ดู response จาก API
- ตรวจสอบว่าข้อมูลถูกส่งครบถ้วนหรือไม่

## 🎯 ผลลัพธ์ที่คาดหวัง

หลังจาก debug แล้ว ควรจะเห็น:
- ข้อมูล building_type และ selected_stations ใน Console
- ฟิลด์แสดงค่าที่ถูกต้องในฟอร์ม
- ไม่มี error ใน Console

## 📝 หมายเหตุ

**การแก้ไขนี้จะช่วยให้เห็นข้อมูลที่แท้จริงที่ได้รับจาก API และสามารถระบุสาเหตุของปัญหาได้**






















