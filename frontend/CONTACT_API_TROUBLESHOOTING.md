# Contact API - การแก้ไขปัญหา

## 🚨 ปัญหาที่พบบ่อย

### 1. **ERR_CONNECTION_REFUSED**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
:1991/api/contact-settings:1
```

**สาเหตุ**: Backend server ยังไม่ได้รัน

**วิธีแก้ไข**:
```bash
# 1. รัน Backend Server
cd /Volumes/Back\ up\ data\ Devjuu/backendkunpitch
npm run dev

# 2. ตรวจสอบว่า server รันอยู่
curl http://localhost:1991/health
```

### 2. **Failed to fetch**
```
Error fetching contact settings: TypeError: Failed to fetch
```

**สาเหตุ**: ไม่สามารถเชื่อมต่อกับ API ได้

**วิธีแก้ไข**: ระบบจะใช้ localStorage fallback โดยอัตโนมัติ

## 🔧 การแก้ไขปัญหาแบบเร่งด่วน

### 1. **ใช้ localStorage Fallback**
ระบบได้ถูกออกแบบให้ใช้ localStorage เมื่อ API ไม่สามารถเชื่อมต่อได้

### 2. **ตรวจสอบ Backend**
```bash
# ตรวจสอบว่า backend รันอยู่หรือไม่
ps aux | grep node

# ตรวจสอบ port 1991
lsof -i :1991

# ตรวจสอบ logs
cd backendkunpitch
npm run dev
```

### 3. **ตรวจสอบ Dependencies**
```bash
cd backendkunpitch
npm install

cd ../frontend
npm install
```

## 🚀 การรันระบบ

### 1. **รัน Backend ก่อน**
```bash
cd /Volumes/Back\ up\ data\ Devjuu/backendkunpitch

# ติดตั้ง dependencies
npm install

# รัน server
npm run dev
```

**Expected Output**:
```
🚀 Server is running on port 1991
📊 Environment: development
```

### 2. **รัน Frontend**
```bash
cd /Volumes/Back\ up\ data\ Devjuu/kunpitchproject/frontend

# ติดตั้ง dependencies
npm install

# รัน app
npm run dev
```

### 3. **ทดสอบ API**
```bash
# ทดสอบ health check
curl http://localhost:1991/health

# ทดสอบ contact API
curl http://localhost:1991/api/contact-settings
```

## 📋 Checklist การแก้ไขปัญหา

### ✅ **Backend**
- [ ] Server รันที่ port 1991
- [ ] ไม่มี error ใน console
- [ ] Database เชื่อมต่อได้
- [ ] Routes ถูกต้อง

### ✅ **Frontend**
- [ ] App รันได้
- [ ] ไม่มี error ใน console
- [ ] สามารถเชื่อมต่อ API ได้
- [ ] Fallback ทำงานได้

### ✅ **Database**
- [ ] ตาราง contact_settings สร้างแล้ว
- [ ] MySQL service รันอยู่
- [ ] Connection string ถูกต้อง

## 🔍 การ Debug

### 1. **Backend Debug**
```javascript
// เพิ่มใน server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

### 2. **Frontend Debug**
```javascript
// เพิ่มใน contactApi.js
console.log('API URL:', API_BASE_URL);
console.log('Request:', requestData);
```

### 3. **Database Debug**
```sql
-- ตรวจสอบตาราง
SHOW TABLES LIKE 'contact_settings';

-- ตรวจสอบข้อมูล
SELECT * FROM contact_settings;
```

## 🆘 เมื่อยังแก้ไขไม่ได้

### 1. **ใช้ localStorage แทน**
ระบบจะทำงานได้ปกติด้วย localStorage

### 2. **ตรวจสอบ Environment**
```bash
# ตรวจสอบ environment variables
echo $NODE_ENV
echo $PORT
echo $DB_HOST
```

### 3. **Restart Services**
```bash
# Restart MySQL
sudo service mysql restart

# Restart Node.js
pkill node
npm run dev
```

## 📞 การขอความช่วยเหลือ

### 1. **ข้อมูลที่ต้องส่ง**
- Error message ทั้งหมด
- Console logs
- Network tab ใน browser
- Environment details

### 2. **ขั้นตอนที่ทำไปแล้ว**
- คำสั่งที่รัน
- ผลลัพธ์ที่ได้
- การแก้ไขที่ลองแล้ว

## 🎯 สรุป

ระบบ Contact API ได้ถูกออกแบบให้:
- ✅ ใช้ API เมื่อเชื่อมต่อได้
- ✅ ใช้ localStorage fallback เมื่อ API ไม่เชื่อมต่อได้
- ✅ แสดงสถานะการเชื่อมต่อให้ user ทราบ
- ✅ ทำงานได้ทั้งสองโหมด

**คำแนะนำ**: รัน backend server ก่อน แล้วค่อยรัน frontend เพื่อให้ได้ประสบการณ์ที่ดีที่สุด 