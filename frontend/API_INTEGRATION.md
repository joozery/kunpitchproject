# API Integration Guide

## 🔗 การเชื่อมต่อ API

Frontend ได้เชื่อมต่อกับ Backend API ที่ deploy บน Heroku แล้ว โดยใช้ **Axios** สำหรับการเรียก API

### Base URL
```
https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api
```

## 🛠️ การใช้งาน Axios

### 1. Axios Instance Configuration

```javascript
// ใน frontend/src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Request/Response Interceptors

```javascript
// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data; // Automatically parse JSON
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } else {
      // Something else happened
      throw new Error(error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
  }
);
```

## 📊 API Endpoints ที่ใช้งาน

### 1. Properties API

#### ดึงข้อมูล Property ทั้งหมด
```javascript
GET /api/properties
```

#### ดึงข้อมูล Property ตาม ID
```javascript
GET /api/properties/:id
```

#### สร้าง Property ใหม่
```javascript
POST /api/properties
Content-Type: application/json

{
  "title": "คอนโดใหม่",
  "description": "คอนโดมิเนียมใหม่ใจกลางเมือง",
  "type": "residential",
  "status": "available",
  "price": 2500000,
  "rentPrice": 15000,
  "area": 45,
  "bedrooms": 1,
  "bathrooms": 1,
  "parking": 1,
  "address": "123 ถนนสุขุมวิท",
  "district": "วัฒนา",
  "province": "กรุงเทพมหานคร",
  "contactName": "คุณสมชาย",
  "contactPhone": "0812345678",
  "contactEmail": "somchai@example.com",
  "features": ["สระว่ายน้ำ", "ฟิตเนส"]
}
```

#### อัปเดต Property
```javascript
PUT /api/properties/:id
```

#### ลบ Property
```javascript
DELETE /api/properties/:id
```

#### ค้นหา Property
```javascript
GET /api/properties/search?q=keyword&type=residential&status=available
```

### 2. Upload API

#### อัปโหลดรูปภาพเดี่ยว
```javascript
POST /api/upload/single
Content-Type: multipart/form-data

FormData:
- image: File
```

#### อัปโหลดรูปภาพหลายรูป
```javascript
POST /api/upload/multiple
Content-Type: multipart/form-data

FormData:
- images: File[] (max 10 files)
```

#### ลบรูปภาพ
```javascript
DELETE /api/upload/:publicId
```

## 🛠️ การใช้งานใน Frontend

### 1. Import API Service

```javascript
import { propertyAPI, uploadAPI } from '../../lib/api'
```

### 2. ดึงข้อมูล Property

```javascript
// ดึงข้อมูลทั้งหมด
const fetchProperties = async () => {
  try {
    const result = await propertyAPI.getAll()
    if (result.success) {
      setProperties(result.data)
    }
  } catch (error) {
    console.error('Failed to fetch properties:', error)
  }
}
```

### 3. สร้าง Property ใหม่

```javascript
// สร้าง Property
const createProperty = async (propertyData) => {
  try {
    const result = await propertyAPI.create(propertyData)
    if (result.success) {
      alert('บันทึก Property สำเร็จ!')
      // Refresh the list
      fetchProperties()
    }
  } catch (error) {
    console.error('Failed to create property:', error)
    alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message)
  }
}
```

### 4. อัปโหลดรูปภาพ

```javascript
// อัปโหลดรูปภาพเดี่ยว
const uploadSingleImage = async (file) => {
  try {
    const result = await uploadAPI.uploadSingle(file)
    if (result.success) {
      return result.data.url
    }
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

// อัปโหลดรูปภาพหลายรูป
const uploadMultipleImages = async (files) => {
  try {
    const result = await uploadAPI.uploadMultiple(files)
    if (result.success) {
      return result.data.map(item => item.url)
    }
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
```

## 🔄 ข้อมูลที่ส่งกลับ

### Property Object
```javascript
{
  id: 1,
  title: "คอนโดลุมพินี พาร์ค",
  description: "คอนโดมิเนียมหรูใจกลางลุมพินี",
  type: "residential", // residential, commercial, land
  status: "available", // available, sold, rented, pending
  price: 2500000,
  rent_price: 15000,
  area: 45,
  bedrooms: 1,
  bathrooms: 1,
  parking: 1,
  address: "123 ลุมพินี ถนนลุมพินี",
  district: "ลุมพินี",
  province: "กรุงเทพมหานคร",
  location: "ลุมพินี, กรุงเทพมหานคร",
  contact_name: "คุณสมชาย ใจดี",
  contact_phone: "0812345678",
  contact_email: "somchai@example.com",
  features: ["สระว่ายน้ำ", "ฟิตเนส", "ที่จอดรถ"],
  images: ["https://res.cloudinary.com/...", "https://res.cloudinary.com/..."],
  views: 245,
  featured: true,
  created_at: "2024-01-15T10:30:00.000Z",
  updated_at: "2024-01-15T10:30:00.000Z"
}
```

### Upload Response
```javascript
{
  success: true,
  message: "Image uploaded successfully",
  data: {
    url: "https://res.cloudinary.com/dwjwab2c4/image/upload/...",
    public_id: "kunpitch/uploads/abc123",
    width: 1200,
    height: 800,
    format: "jpg"
  }
}
```

## 🚨 Error Handling

### Axios Error Response
```javascript
// Error response structure
{
  success: false,
  message: "Error message",
  error: "Detailed error information"
}
```

### การจัดการ Error ใน Frontend
```javascript
try {
  const result = await propertyAPI.getAll()
  if (result.success) {
    // Handle success
  } else {
    // Handle API error
    console.error(result.message)
  }
} catch (error) {
  // Handle network/other errors
  console.error('Network error:', error)
  // Error message is already handled by axios interceptor
}
```

## 🔧 การตั้งค่า

### Dependencies
```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

### Environment Variables
```javascript
// ใน lib/api.js
const API_BASE_URL = 'https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api';
```

### CORS Configuration
Backend ได้ตั้งค่า CORS ให้รองรับ frontend ที่รันบน `http://localhost:5173`

## ✨ ข้อดีของ Axios

1. **Automatic JSON parsing** - ไม่ต้องเรียก `.json()` ทุกครั้ง
2. **Better error handling** - จัดการ error ได้ดีกว่า
3. **Request/Response interceptors** - สามารถ intercept requests/responses
4. **Request cancellation** - ยกเลิก request ได้
5. **Progress monitoring** - ติดตามความคืบหน้า upload
6. **Automatic transforms** - transform ข้อมูลอัตโนมัติ
7. **Timeout configuration** - ตั้งค่า timeout ได้
8. **Request/Response interceptors** - เพิ่ม headers, handle errors globally

## 📝 Notes

1. **รูปภาพ**: รูปภาพจะถูกอัปโหลดไปยัง Cloudinary และ URL จะถูกบันทึกลงในฐานข้อมูล
2. **Validation**: Backend มี validation สำหรับข้อมูลที่จำเป็น
3. **Error Handling**: ระบบมีการจัดการ error ที่ครอบคลุมด้วย axios interceptors
4. **Loading States**: Frontend แสดง loading states ระหว่างการเรียก API
5. **Real-time Updates**: ข้อมูลจะถูก refresh หลังจากสร้าง/ลบ Property
6. **Timeout**: ตั้งค่า timeout 30 วินาทีสำหรับทุก request

## 🐛 Troubleshooting

### ปัญหาที่พบบ่อย

1. **CORS Error**
   - ตรวจสอบว่า frontend URL ถูกต้อง
   - ตรวจสอบ CORS configuration ใน backend

2. **Upload Failed**
   - ตรวจสอบ file size (max 10MB)
   - ตรวจสอบ file type (images only)
   - ตรวจสอบ Cloudinary credentials

3. **Database Connection**
   - ตรวจสอบ database credentials
   - ตรวจสอบ network connectivity

4. **API Not Found**
   - ตรวจสอบ API endpoint URL
   - ตรวจสอบ HTTP method
   - ตรวจสอบ request headers

5. **Timeout Issues**
   - ตรวจสอบ timeout configuration (30 seconds)
   - ตรวจสอบ network speed
   - ตรวจสอบ server response time 