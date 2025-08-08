# โครงสร้าง Path และการจัดระเบียบ Routes

## ภาพรวม

ระบบจัดการ path ได้รับการจัดระเบียบใหม่เพื่อให้ง่ายต่อการนำทางและบำรุงรักษา โดยแบ่งเป็นหมวดหมู่ต่างๆ

## หมวดหมู่ Routes

### 1. หลัก (Main)
- **Path**: `/admin/dashboard`
- **Description**: หน้าหลักและภาพรวมระบบ
- **Breadcrumb**: `หน้าหลัก`

### 2. จัดการ Property (Property Management)
- **Path**: `/admin/properties` - จัดการ Property ทั้งหมด
- **Path**: `/admin/residential` - ที่อยู่อาศัย (บ้าน คอนโด ทาวน์เฮาส์)
- **Path**: `/admin/commercial` - เชิงพาณิชย์ (สำนักงาน ร้านค้า โรงแรม)
- **Path**: `/admin/land` - ที่ดิน (ที่ดินเปล่า ไร่นา สวน)
- **Breadcrumb**: `จัดการ Property > [หมวดหมู่ย่อย]`

### 3. ลูกค้า (Customer Management)
- **Path**: `/admin/customers` - จัดการข้อมูลลูกค้าและผู้ติดต่อ
- **Path**: `/admin/appointments` - จัดการการนัดหมายดูบ้าน
- **Breadcrumb**: `ลูกค้า > [หมวดหมู่ย่อย]`

### 4. ธุรกิจ (Business Management)
- **Path**: `/admin/contracts` - จัดการสัญญาเช่า-ขาย
- **Path**: `/admin/payments` - จัดการการชำระเงินและใบแจ้งหนี้
- **Path**: `/admin/reports` - รายงานยอดขายและสถิติ
- **Breadcrumb**: `ธุรกิจ > [หมวดหมู่ย่อย]`

### 5. เนื้อหา (Content Management)
- **Path**: `/admin/locations` - จัดการพื้นที่และโซน
- **Path**: `/admin/pricing` - จัดการราคาและโปรโมชั่น
- **Path**: `/admin/gallery` - จัดการรูปภาพและวิดีโอ
- **Breadcrumb**: `เนื้อหา > [หมวดหมู่ย่อย]`

### 6. การสื่อสาร (Communication)
- **Path**: `/admin/notifications` - จัดการการแจ้งเตือน
- **Path**: `/admin/messages` - จัดการข้อความและแชท
- **Breadcrumb**: `การสื่อสาร > [หมวดหมู่ย่อย]`

### 7. ระบบ (System Management)
- **Path**: `/admin/database` - จัดการฐานข้อมูลและข้อมูล
- **Path**: `/admin/security` - จัดการความปลอดภัยและสิทธิ์
- **Path**: `/admin/settings` - ตั้งค่าระบบและโปรไฟล์
- **Breadcrumb**: `ระบบ > [หมวดหมู่ย่อย]`

### 8. ช่วยเหลือ (Support)
- **Path**: `/admin/help` - คู่มือการใช้งานและ FAQ
- **Path**: `/admin/about` - ข้อมูลเกี่ยวกับระบบ
- **Breadcrumb**: `ช่วยเหลือ > [หมวดหมู่ย่อย]`

## การใช้งาน

### การเพิ่ม Route ใหม่

1. เพิ่ม route ใน `adminRoutes` array ใน `frontend/src/routes/adminRoutes.js`
2. กำหนด `category` และ `breadcrumb` ให้เหมาะสม
3. เพิ่ม component ที่เกี่ยวข้อง

```javascript
{
  path: '/admin/new-route',
  name: 'newRoute',
  title: 'หน้าใหม่',
  description: 'คำอธิบายหน้าใหม่',
  category: 'property', // เลือกหมวดหมู่ที่เหมาะสม
  breadcrumb: ['จัดการ Property', 'หน้าใหม่'],
  component: NewComponent
}
```

### การเพิ่มหมวดหมู่ใหม่

1. เพิ่ม category ใน `routeCategories` object
2. กำหนด icon และ description

```javascript
newCategory: {
  name: 'หมวดหมู่ใหม่',
  description: 'คำอธิบายหมวดหมู่ใหม่',
  icon: 'IconName'
}
```

## ฟีเจอร์

### Breadcrumb Navigation
- แสดง path ปัจจุบัน
- สามารถคลิกเพื่อนำทางกลับ
- อัปเดตอัตโนมัติตาม route

### Sidebar Categories
- จัดกลุ่มเมนูตามหมวดหมู่
- สามารถขยาย/ย่อหมวดหมู่ได้
- แสดง icon และคำอธิบาย

### Responsive Design
- รองรับการย่อ/ขยาย sidebar
- ปรับตัวตามขนาดหน้าจอ
- Animation ที่นุ่มนวล

## การบำรุงรักษา

### การอัปเดต Route
- แก้ไขใน `adminRoutes.js` เท่านั้น
- ตรวจสอบ breadcrumb ให้ถูกต้อง
- ทดสอบการนำทาง

### การเพิ่ม Component
- สร้าง component ใน `components/admin/`
- Import ใน `adminRoutes.js`
- เพิ่ม route configuration

## ตัวอย่างการใช้งาน

```javascript
// การนำทางไปยังหน้าใหม่
navigate('/admin/properties')

// การตรวจสอบ route ปัจจุบัน
const currentRoute = getRouteByPath(location.pathname)

// การดึง breadcrumb
const breadcrumb = getBreadcrumb(location.pathname)
``` 