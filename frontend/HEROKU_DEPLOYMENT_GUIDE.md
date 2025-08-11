# Heroku Deployment Guide - Contact API

## 🚀 **สถานะการ Deploy**

✅ **Backend**: Deployed to Heroku  
🔗 **URL**: https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/  
🌐 **API Base**: https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api  

## 📋 **API Endpoints ที่ใช้งานได้**

### 1. **Health Check**
```
GET https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/health
```

### 2. **Contact Settings**
```
GET    https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings
POST   https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings
PUT    https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings/:id
DELETE https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings/:id
GET    https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings/all
```

## 🧪 **การทดสอบ API**

### 1. **ทดสอบด้วย cURL**
```bash
# Health Check
curl https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/health

# ดึงข้อมูลการติดต่อ
curl https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings

# บันทึกข้อมูลใหม่
curl -X POST https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings \
  -H "Content-Type: application/json" \
  -d '{"phone":"081-234-5678","line":"@whalespace"}'
```

### 2. **ทดสอบด้วย Postman**
- Import collection ที่มี endpoints ทั้งหมด
- เปลี่ยน base URL เป็น Heroku URL
- ทดสอบการทำงานของ API

### 3. **ทดสอบใน Browser**
```
https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings
```

## 🔧 **การตั้งค่า Frontend**

### 1. **Environment Variables**
```bash
# สร้างไฟล์ .env ใน frontend folder
VITE_API_URL=https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api
```

### 2. **อัปเดต API Configuration**
```javascript
// ใน contactApi.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api';
```

### 3. **Build และ Deploy Frontend**
```bash
cd frontend
npm run build
# Deploy dist folder ไปยัง web server
```

## 📊 **การตรวจสอบการทำงาน**

### 1. **ตรวจสอบ Backend Status**
```bash
# ตรวจสอบ Heroku logs
heroku logs --tail -a backendkunpitch-app-43efa3b2a3ab

# ตรวจสอบ Heroku status
heroku ps -a backendkunpitch-app-43efa3b2a3ab
```

### 2. **ตรวจสอบ Database**
```bash
# เข้า Heroku Postgres
heroku pg:psql -a backendkunpitch-app-43efa3b2a3ab

# ตรวจสอบตาราง
\dt

# ตรวจสอบข้อมูล
SELECT * FROM contact_settings;
```

### 3. **ตรวจสอบ API Response**
```bash
# ตรวจสอบ response time
time curl https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings

# ตรวจสอบ headers
curl -I https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api/contact-settings
```

## 🚨 **การแก้ไขปัญหา**

### 1. **API ไม่ตอบสนอง**
```bash
# ตรวจสอบ Heroku status
heroku status

# ตรวจสอบ app status
heroku ps -a backendkunpitch-app-43efa3b2a3ab

# Restart app
heroku restart -a backendkunpitch-app-43efa3b2a3ab
```

### 2. **Database Connection Error**
```bash
# ตรวจสอบ database
heroku pg:info -a backendkunpitch-app-43efa3b2a3ab

# Reset database (ถ้าจำเป็น)
heroku pg:reset DATABASE_URL -a backendkunpitch-app-43efa3b2a3ab
```

### 3. **CORS Error**
- ตรวจสอบ CORS configuration ใน backend
- ตรวจสอบ allowed origins
- ตรวจสอบ preflight requests

## 📈 **Performance Monitoring**

### 1. **Heroku Metrics**
```bash
# ดู metrics
heroku metrics:web -a backendkunpitch-app-43efa3b2a3ab

# ดู response time
heroku metrics:web --timeframe=1h -a backendkunpitch-app-43efa3b2a3ab
```

### 2. **Database Performance**
```bash
# ดู database metrics
heroku pg:info -a backendkunpitch-app-43efa3b2a3ab

# ดู slow queries
heroku pg:ps -a backendkunpitch-app-43efa3b2a3ab
```

## 🔒 **Security Considerations**

### 1. **HTTPS**
- Heroku ใช้ HTTPS โดยอัตโนมัติ
- ไม่ต้องตั้งค่า SSL certificates

### 2. **Environment Variables**
- เก็บ sensitive data ใน Heroku config vars
- ไม่ commit .env files

### 3. **Rate Limiting**
- ตั้งค่า rate limiting ใน backend
- ป้องกัน abuse

## 🎯 **ขั้นตอนการใช้งาน**

### 1. **รัน Frontend**
```bash
cd frontend
npm run dev
```

### 2. **ทดสอบการเชื่อมต่อ**
- เข้าไปที่ `/admin/contact`
- ตรวจสอบว่าแสดง "เชื่อมต่อ API สำเร็จ"
- ทดสอบการบันทึกข้อมูล

### 3. **ตรวจสอบการแสดงผล**
- ข้อมูลถูกบันทึกใน Heroku database
- แสดงผลในหน้าเว็บไซต์
- ข้อมูลอัปเดตทันที

## 🎉 **สรุป**

✅ **Backend**: Deployed to Heroku  
✅ **API**: ใช้งานได้จริง  
✅ **Database**: Heroku Postgres  
✅ **HTTPS**: รองรับโดยอัตโนมัติ  
✅ **Frontend**: พร้อมใช้งาน  

ระบบ Contact API พร้อมใช้งานจริงแล้วครับ! 🚀 