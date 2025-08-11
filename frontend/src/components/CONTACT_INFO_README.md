# ContactInfo Component

## ภาพรวม
ContactInfo component เป็น component ที่ใช้แสดงข้อมูลการติดต่อในหน้าเว็บไซต์สำหรับลูกค้า โดยจะดึงข้อมูลจาก localStorage ที่ admin ได้ตั้งค่าไว้

## ฟีเจอร์หลัก

### 1. การแสดงผลข้อมูลการติดต่อ
- แสดงข้อมูลการติดต่อในรูปแบบ card สวยงาม
- รองรับข้อมูล: เบอร์โทร, Line, Facebook Messenger, WhatsApp, Facebook, Instagram
- มีไอคอนและสีที่แตกต่างกันสำหรับแต่ละช่องทาง

### 2. การโต้ตอบกับผู้ใช้
- **เบอร์โทร** - คลิกเพื่อโทรออก
- **Line** - คัดลอก Line ID ไปยัง clipboard
- **WhatsApp** - เปิด WhatsApp Web/App
- **Social Media** - เปิดลิงก์ในแท็บใหม่

### 3. Responsive Design
- รองรับการแสดงผลบนอุปกรณ์ทุกขนาด
- Grid layout ที่ปรับตัวได้
- Hover effects และ animations

## การใช้งาน

### การ Import
```jsx
import ContactInfo from '../components/ContactInfo'
```

### การใช้งานใน Component
```jsx
function HomePage() {
  return (
    <div>
      <h1>หน้าแรก</h1>
      <ContactInfo />
    </div>
  )
}
```

### การใช้งานในหน้าเว็บไซต์
```jsx
// ตัวอย่างการใช้งานในหน้า Home
<ContactInfo />

// ตัวอย่างการใช้งานในหน้า About
<ContactInfo />

// ตัวอย่างการใช้งานใน Footer
<footer>
  <ContactInfo />
</footer>
```

## การทำงาน

### 1. การโหลดข้อมูล
- Component จะโหลดข้อมูลจาก localStorage เมื่อ mount
- ใช้ key: 'contactSettings'
- แสดง loading spinner ระหว่างโหลด

### 2. การแสดงผล
- ตรวจสอบว่ามีข้อมูลการติดต่อหรือไม่
- ถ้าไม่มีข้อมูล จะไม่แสดงผล (return null)
- แสดงเฉพาะข้อมูลที่มีค่า

### 3. การโต้ตอบ
- ใช้ `handleContactClick` function
- จัดการการเปิดลิงก์หรือแอปต่างๆ
- รองรับการคัดลอก Line ID

## การปรับแต่ง

### การเปลี่ยนสี
```jsx
const contactItems = [
  {
    key: 'phone',
    color: 'bg-green-500 hover:bg-green-600' // เปลี่ยนสีตรงนี้
  }
]
```

### การเพิ่มช่องทางใหม่
```jsx
const contactItems = [
  // ... existing items
  {
    key: 'telegram',
    label: 'Telegram',
    icon: MessageCircle,
    action: 'เปิด',
    color: 'bg-blue-400 hover:bg-blue-500'
  }
]
```

### การเปลี่ยน Layout
```jsx
// เปลี่ยนจาก grid เป็น flex
<div className="flex flex-col space-y-4">
  {contactItems.map(item => (
    // ... item rendering
  ))}
</div>
```

## การเชื่อมต่อกับ Backend

### ปัจจุบัน
- ใช้ localStorage เป็นแหล่งข้อมูล
- ข้อมูลถูกตั้งค่าโดย admin ใน ContactSettings

### อนาคต
```jsx
// ใช้ API แทน localStorage
useEffect(() => {
  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-settings')
      const data = await response.json()
      setContactInfo(data)
    } catch (error) {
      console.error('Error fetching contact info:', error)
    }
  }
  
  fetchContactInfo()
}, [])
```

## การทดสอบ

### Unit Tests
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ContactInfo from './ContactInfo'

test('renders contact info when data exists', () => {
  // Mock localStorage
  localStorage.setItem('contactSettings', JSON.stringify({
    phone: '081-234-5678'
  }))
  
  render(<ContactInfo />)
  expect(screen.getByText('เบอร์โทรศัพท์')).toBeInTheDocument()
})

test('does not render when no data', () => {
  localStorage.removeItem('contactSettings')
  const { container } = render(<ContactInfo />)
  expect(container.firstChild).toBeNull()
})
```

### Integration Tests
- ทดสอบการคลิกแต่ละช่องทาง
- ทดสอบการเปิดลิงก์
- ทดสอบการคัดลอก Line ID

## การ Deploy

### Frontend
- Build React app
- Deploy ไปยัง web server
- ตรวจสอบการทำงานของ localStorage

### Backend (อนาคต)
- Deploy API endpoints
- ตั้งค่า CORS
- ตรวจสอบการเชื่อมต่อ

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. ไม่แสดงข้อมูลการติดต่อ
- ตรวจสอบว่า admin ได้ตั้งค่าข้อมูลใน ContactSettings หรือไม่
- ตรวจสอบ localStorage ใน browser dev tools
- ตรวจสอบ console errors

#### 2. ลิงก์ไม่เปิด
- ตรวจสอบว่า URL ถูกต้องหรือไม่
- ตรวจสอบ popup blocker
- ตรวจสอบ CORS settings (ถ้าใช้ API)

#### 3. การแสดงผลผิด
- ตรวจสอบ Tailwind CSS classes
- ตรวจสอบ responsive breakpoints
- ตรวจสอบ font loading

### การ Debug
```jsx
// เพิ่ม console.log เพื่อ debug
useEffect(() => {
  const savedContactInfo = localStorage.getItem('contactSettings')
  console.log('Saved contact info:', savedContactInfo)
  
  if (savedContactInfo) {
    try {
      const parsed = JSON.parse(savedContactInfo)
      console.log('Parsed contact info:', parsed)
      setContactInfo(parsed)
    } catch (err) {
      console.error('Error parsing saved contact info:', err)
    }
  }
  setIsLoading(false)
}, [])
```

## สรุป
ContactInfo component เป็น component ที่ใช้งานง่ายและมีประโยชน์มากสำหรับการแสดงข้อมูลการติดต่อในหน้าเว็บไซต์ โดยจะทำงานร่วมกับ ContactSettings component ในส่วน admin เพื่อให้ admin สามารถจัดการข้อมูลการติดต่อได้ และลูกค้าสามารถติดต่อได้ง่ายขึ้น 