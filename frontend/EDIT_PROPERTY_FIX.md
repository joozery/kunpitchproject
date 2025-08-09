# Property Edit Feature Fix

## ปัญหาที่พบ
- ปุ่ม Edit ใน PropertyManagement ไม่มีฟังก์ชันการทำงาน
- PropertyForm ไม่รองรับการแก้ไข property ที่มีอยู่แล้ว
- ไม่สามารถโหลดข้อมูลและรูปภาพที่มีอยู่แล้วเมื่อแก้ไข

## การแก้ไข

### 1. PropertyManagement.jsx
- เพิ่ม state สำหรับการแก้ไข: `showEditForm`, `editingProperty`
- เพิ่มฟังก์ชัน `handleEditProperty` สำหรับดึงข้อมูล property และเปิดฟอร์มแก้ไข
- เพิ่มฟังก์ชัน `handleUpdateProperty` สำหรับจัดการหลังจากแก้ไขเสร็จ
- เชื่อมต่อปุ่ม Edit ทั้งใน table view และ grid view กับฟังก์ชัน `handleEditProperty`

### 2. PropertyForm.jsx
- เพิ่ม props: `property`, `isEditing`
- แก้ไข initial state ให้โหลดข้อมูลจาก property ที่ส่งมา
- เพิ่ม `useEffect` สำหรับโหลดรูปภาพที่มีอยู่แล้ว
- แก้ไข `handleSubmit` ให้รองรับทั้งการสร้างและแก้ไข
- ปรับ UI ให้แสดงข้อความที่เหมาะสมตาม mode

### 3. API Integration (api.js)
- ปรับปรุง `propertyAPI.update` ให้ส่ง headers ที่ถูกต้อง

### 4. Backend (properties.js)
- ปรับปรุง PUT route ให้จัดการรูปภาพที่มีอยู่แล้วได้ดีขึ้น
- แยกการจัดการรูปภาพใหม่และรูปภาพเก่า
- เพิ่มการตรวจสอบ public_id เพื่อระบุว่าเป็นรูปใหม่หรือเก่า

## ฟีเจอร์ใหม่

### การแก้ไข Property
1. **โหลดข้อมูลเดิม**: ดึงข้อมูล property ทั้งหมดรวมถึงรูปภาพ
2. **แสดงรูปภาพเดิม**: โหลดรูปภาพที่มีอยู่แล้วมาแสดงในฟอร์ม
3. **รองรับการเพิ่มรูปใหม่**: สามารถเพิ่มรูปภาพใหม่ได้โดยไม่ลบรูปเก่า
4. **อัพเดตข้อมูล**: บันทึกการเปลี่ยนแปลงลง database

### การจัดการรูปภาพ
- รูปภาพเดิมจะมี flag `isExisting: true`
- รูปภาพใหม่จะมี `public_id` จาก Cloudinary
- Backend จะแยกประมวลผลรูปใหม่และรูปเก่าแยกกัน

## วิธีการใช้งาน

### สำหรับผู้ใช้
1. ไปที่หน้า Property Management
2. คลิกปุ่ม Edit (ไอคอนดินสอ) ที่ property ที่ต้องการแก้ไข
3. ฟอร์มแก้ไขจะเปิดขึ้นพร้อมข้อมูลเดิม
4. แก้ไขข้อมูลตามต้องการ
5. คลิก "บันทึกการแก้ไข"

### สำหรับ Developer
```javascript
// ใช้ PropertyForm สำหรับแก้ไข
<PropertyForm 
  property={propertyData}
  isEditing={true}
  onBack={() => setShowEditForm(false)}
  onSave={handleUpdateProperty}
/>
```

## การทดสอบ
1. สร้าง property ใหม่พร้อมรูปภาพ
2. คลิกแก้ไข property นั้น
3. ตรวจสอบว่าข้อมูลและรูปภาพโหลดถูกต้อง
4. แก้ไขข้อมูลและเพิ่มรูปใหม่
5. บันทึกและตรวจสอบการเปลี่ยนแปลง

## หมายเหตุ
- รูปภาพเดิมจะไม่ถูกอัพโหลดซ้ำไป Cloudinary
- การแก้ไขจะอัพเดตเฉพาะข้อมูลที่เปลี่ยนแปลง
- รองรับการแก้ไขทั้งใน table view และ grid view