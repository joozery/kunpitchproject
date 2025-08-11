# หน้าการติดต่อ (Contact Settings)

## ภาพรวม
หน้าการติดต่อเป็นส่วนหนึ่งของระบบ admin ที่ใช้สำหรับตั้งค่าข้อมูลการติดต่อต่างๆ ที่ลูกค้าสามารถใช้ติดต่อได้

## ฟีเจอร์หลัก

### 1. ข้อมูลการติดต่อที่รองรับ
- **เบอร์โทรศัพท์** - เบอร์โทรสำหรับติดต่อลูกค้า
- **Line ID** - Line ID สำหรับติดต่อผ่าน Line
- **Facebook Messenger** - ลิงก์ Facebook Messenger
- **WhatsApp** - เบอร์ WhatsApp สำหรับติดต่อ
- **Facebook** - ลิงก์ Facebook Page
- **Instagram** - ลิงก์ Instagram Profile

### 2. ฟังก์ชันการทำงาน
- **บันทึกข้อมูล** - บันทึกข้อมูลการติดต่อลง localStorage
- **รีเซ็ต** - ยกเลิกการเปลี่ยนแปลงและกลับไปใช้ข้อมูลเดิม
- **ตัวอย่างการแสดงผล** - แสดงตัวอย่างการแสดงผลข้อมูลในหน้าเว็บไซต์
- **คำแนะนำการใช้งาน** - คำแนะนำสำหรับผู้ใช้งาน

### 3. การจัดเก็บข้อมูล
- ข้อมูลจะถูกบันทึกใน localStorage ของเบราว์เซอร์
- ในอนาคตจะเชื่อมต่อกับฐานข้อมูล backend
- รองรับการ import/export ข้อมูล

## การใช้งาน

### การเข้าถึง
1. เข้าสู่ระบบ admin
2. คลิกเมนู "การติดต่อ" ใน sidebar
3. หรือไปที่ URL: `/admin/contact`

### การตั้งค่า
1. กรอกข้อมูลการติดต่อในฟอร์ม
2. คลิกปุ่ม "บันทึกการตั้งค่า"
3. ระบบจะแสดงข้อความยืนยันการบันทึก

### การแก้ไข
1. แก้ไขข้อมูลในฟอร์ม
2. คลิกปุ่ม "บันทึกการตั้งค่า"
3. หรือคลิกปุ่ม "รีเซ็ต" เพื่อยกเลิกการเปลี่ยนแปลง

## โครงสร้างไฟล์

```
ContactSettings.jsx          # Component หลัก
├── State Management        # การจัดการ state
├── Form Fields            # ฟิลด์ฟอร์มต่างๆ
├── Save/Reset Functions   # ฟังก์ชันบันทึกและรีเซ็ต
├── Preview Section        # ส่วนแสดงตัวอย่าง
└── Instructions          # คำแนะนำการใช้งาน
```

## การเชื่อมต่อกับ Backend (อนาคต)

### API Endpoints ที่จะใช้
```javascript
// GET /api/contact-settings
// ดึงข้อมูลการติดต่อ

// POST /api/contact-settings
// บันทึกข้อมูลการติดต่อ

// PUT /api/contact-settings/:id
// อัปเดตข้อมูลการติดต่อ
```

### Database Schema
```sql
CREATE TABLE contact_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(20),
  line_id VARCHAR(100),
  messenger_url TEXT,
  whatsapp VARCHAR(20),
  facebook_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## การแสดงผลในหน้าเว็บไซต์

### Component ที่จะใช้
```jsx
import ContactInfo from '../components/ContactInfo'

// ใช้ในหน้าเว็บไซต์
<ContactInfo />
```

### การแสดงผล
- แสดงข้อมูลการติดต่อในรูปแบบ card
- มีไอคอนสำหรับแต่ละช่องทาง
- รองรับการ responsive design
- สามารถคลิกเพื่อเปิดลิงก์หรือโทรได้

## การปรับแต่ง

### การเพิ่มฟิลด์ใหม่
1. เพิ่มฟิลด์ใน `contactFields` array
2. เพิ่ม state ใน `contactInfo`
3. เพิ่ม UI component สำหรับฟิลด์ใหม่

### การเปลี่ยนธีม
- ใช้ Tailwind CSS classes
- สามารถปรับแต่งสีและสไตล์ได้
- รองรับ dark mode (ในอนาคต)

## การทดสอบ

### Unit Tests
- ทดสอบการบันทึกข้อมูล
- ทดสอบการรีเซ็ตข้อมูล
- ทดสอบการ validate ข้อมูล

### Integration Tests
- ทดสอบการเชื่อมต่อกับ backend
- ทดสอบการแสดงผลในหน้าเว็บไซต์

## การ Deploy

### Frontend
- Build และ deploy React app
- ตรวจสอบ routing และ navigation

### Backend
- Deploy API endpoints
- ตั้งค่าฐานข้อมูล
- ตรวจสอบ CORS และ security

## สรุป
หน้าการติดต่อเป็นฟีเจอร์สำคัญที่ช่วยให้ลูกค้าสามารถติดต่อได้ง่ายขึ้น และช่วยให้ admin สามารถจัดการข้อมูลการติดต่อได้อย่างมีประสิทธิภาพ 