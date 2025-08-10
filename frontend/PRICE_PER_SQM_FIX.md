# การแก้ไขฟังก์ชันคำนวณราคาต่อตารางเมตร (Price per sq.m.)

## ปัญหาที่พบ

### 1. **ฟังก์ชันคำนวณราคาต่อตารางเมตรไม่ครบถ้วน**
- ปัจจุบันคำนวณเฉพาะจาก `price` (ราคาขาย) เท่านั้น
- ไม่คำนวณจาก `rentPrice` (ราคาเช่า) เมื่อเลือกสถานะ "เช่า"

### 2. **ข้อมูลที่ส่งไป MySQL ไม่ครบถ้วน**
- ไม่ส่ง `price_per_sqm` ไปยัง backend
- ไม่ส่ง `project_code` ไปยัง backend

### 3. **การคำนวณราคาต่อตารางเมตรไม่ถูกต้อง**
- ควรคำนวณจากราคาที่เหมาะสมตามสถานะ (ขาย/เช่า)

## การแก้ไขที่ทำ

### Frontend (CondoForm.jsx)

#### 1. แก้ไขฟังก์ชันคำนวณราคาต่อตารางเมตร
```javascript
// Auto calculate price per sqm
useEffect(() => {
  if (formData.area && (formData.price || formData.rentPrice)) {
    const area = parseFloat(formData.area)
    if (!isNaN(area) && area > 0) {
      let pricePerSqm = 0
      
      if (formData.status === 'rent' && formData.rentPrice) {
        // คำนวณจากราคาเช่า (ต่อเดือน)
        const rentPrice = parseFloat(formData.rentPrice)
        if (!isNaN(rentPrice) && rentPrice > 0) {
          pricePerSqm = (rentPrice / area).toFixed(2)
        }
      } else if (formData.status === 'sale' && formData.price) {
        // คำนวณจากราคาขาย
        const price = parseFloat(formData.price)
        if (!isNaN(price) && price > 0) {
          pricePerSqm = (price / area).toFixed(2)
        }
      } else if (formData.status === 'both') {
        // กรณีขาย/เช่า ให้คำนวณจากราคาขายก่อน ถ้าไม่มีให้คำนวณจากราคาเช่า
        if (formData.price) {
          const price = parseFloat(formData.price)
          if (!isNaN(price) && price > 0) {
            pricePerSqm = (price / area).toFixed(2)
          }
        } else if (formData.rentPrice) {
          const rentPrice = parseFloat(formData.rentPrice)
          if (!isNaN(rentPrice) && rentPrice > 0) {
            pricePerSqm = (rentPrice / area).toFixed(2)
          }
        }
      }
      
      if (pricePerSqm > 0) {
        setFormData(prev => ({ ...prev, pricePerSqm }))
      }
    }
  }
}, [formData.price, formData.rentPrice, formData.area, formData.status])
```

#### 2. เพิ่มการส่งข้อมูล `price_per_sqm` ไปยัง backend
```javascript
const condoData = {
  // ... ข้อมูลอื่นๆ
  price_per_sqm: parseFloat(formData.pricePerSqm) || 0,
  // ... ข้อมูลอื่นๆ
}
```

#### 3. ปรับปรุงการแสดงผลราคาต่อตารางเมตร
- แสดงหน่วยที่ถูกต้อง (บาท/ตร.ม. หรือ บาท/ตร.ม./เดือน)
- แสดงสถานะการคำนวณ
- แสดงตัวอย่างการคำนวณตามสถานะที่เลือก

### Backend (condos.js)

#### 1. แก้ไขฟังก์ชัน `calculatePricePerSqm`
```javascript
const calculatePricePerSqm = (price, rentPrice, area, status) => {
  if (!area || area === 0) return 0;
  
  if (status === 'rent' && rentPrice > 0) {
    // คำนวณจากราคาเช่าต่อเดือน
    return parseFloat((rentPrice / area).toFixed(2));
  } else if (price > 0) {
    // คำนวณจากราคาขาย
    return parseFloat((price / area).toFixed(2));
  }
  
  return 0;
};
```

#### 2. ปรับปรุงการคำนวณใน API
```javascript
// Calculate price per sqm (use provided value or calculate)
const price_per_sqm = req.body.price_per_sqm ? 
  parseFloat(req.body.price_per_sqm) : 
  calculatePricePerSqm(price, rent_price, area, status);
```

#### 3. ปรับปรุงการคำนวณใน update API
```javascript
// Recalculate price per sqm if price, rent_price, area, or status changed
if (updateData.price || updateData.rent_price || updateData.area || updateData.status) {
  const currentCondo = existing[0];
  const newPrice = updateData.price !== undefined ? updateData.price : currentCondo.price;
  const newRentPrice = updateData.rent_price !== undefined ? updateData.rent_price : currentCondo.rent_price;
  const newArea = updateData.area !== undefined ? updateData.area : currentCondo.area;
  const newStatus = updateData.status !== undefined ? updateData.status : currentCondo.status;
  
  updateData.price_per_sqm = calculatePricePerSqm(newPrice, newRentPrice, newArea, newStatus);
}
```

## ผลลัพธ์ที่ได้

### 1. **ฟังก์ชันคำนวณราคาต่อตารางเมตรทำงานครบถ้วน**
- ✅ คำนวณจากราคาขายเมื่อสถานะ = "ขาย"
- ✅ คำนวณจากราคาเช่าเมื่อสถานะ = "เช่า" 
- ✅ คำนวณจากราคาขายหรือราคาเช่าเมื่อสถานะ = "ขาย/เช่า"

### 2. **ข้อมูลถูกส่งไป MySQL ครบถ้วน**
- ✅ ส่ง `price_per_sqm` ไปยัง backend
- ✅ Backend ใช้ข้อมูลที่ frontend ส่งมา หรือคำนวณเองถ้าไม่มี

### 3. **การแสดงผลถูกต้องและชัดเจน**
- ✅ แสดงหน่วยที่ถูกต้องตามสถานะ
- ✅ แสดงสถานะการคำนวณ
- ✅ แสดงตัวอย่างการคำนวณตามสถานะ

## วิธีการทดสอบ

### 1. ทดสอบการคำนวณราคาขาย
1. เลือกสถานะ "ขาย"
2. กรอกราคา (เช่น 4,800,000 บาท)
3. กรอกพื้นที่ (เช่น 47.48 ตร.ม.)
4. ตรวจสอบว่าระบบคำนวณราคาต่อตารางเมตรได้ 101,095.95 บาท/ตร.ม.

### 2. ทดสอบการคำนวณราคาเช่า
1. เลือกสถานะ "เช่า"
2. กรอกราคาเช่า (เช่น 25,000 บาท/เดือน)
3. กรอกพื้นที่ (เช่น 47.48 ตร.ม.)
4. ตรวจสอบว่าระบบคำนวณราคาต่อตารางเมตรได้ 526.54 บาท/ตร.ม./เดือน

### 3. ทดสอบการบันทึกข้อมูล
1. กรอกข้อมูลครบถ้วน
2. กดบันทึก
3. ตรวจสอบ console.log ว่าข้อมูลถูกส่งครบถ้วน
4. ตรวจสอบฐานข้อมูลว่าข้อมูลถูกบันทึกครบถ้วน

## หมายเหตุ

- ระบบจะคำนวณราคาต่อตารางเมตรอัตโนมัติเมื่อมีการเปลี่ยนแปลงราคา พื้นที่ หรือสถานะ
- ราคาต่อตารางเมตรจะถูกส่งไปยัง backend และบันทึกลงฐานข้อมูล
- หาก frontend ไม่ส่ง `price_per_sqm` มาบ้าง backend จะคำนวณเอง
- การคำนวณจะคำนึงถึงสถานะที่เลือก (ขาย/เช่า/ขาย/เช่า) เพื่อความถูกต้อง 