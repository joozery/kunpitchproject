# Drag & Drop รูปภาพในฟอร์มต่างๆ

## ภาพรวม

ได้เพิ่มฟีเจอร์ drag and drop สำหรับรูปภาพเพิ่มเติมในฟอร์มต่างๆ ดังนี้:

- ✅ **ProjectForm** - ฟอร์มจัดการโครงการ (มีอยู่แล้ว)
- ✅ **CondoForm** - ฟอร์มจัดการคอนโด (เพิ่มใหม่)
- ✅ **HouseForm** - ฟอร์มจัดการบ้าน (เพิ่มใหม่)
- ✅ **LandForm** - ฟอร์มจัดการที่ดิน (เพิ่มใหม่)
- ✅ **CommercialForm** - ฟอร์มจัดการโฮมออฟฟิศ (เพิ่มใหม่)

## ฟีเจอร์ที่เพิ่ม

### 1. Drag & Drop การจัดเรียงรูปภาพ
- ลากรูปภาพเพื่อเปลี่ยนลำดับการแสดงผล
- แสดงลำดับปัจจุบันของแต่ละรูปภาพ
- แสดง SweetAlert2 ยืนยันการจัดเรียงสำเร็จ

### 2. UI ที่ปรับปรุง
- แสดงรูปภาพในรูปแบบ grid ที่สวยงาม
- แสดงสถานะการอัปโหลด (กำลังอัปโหลด, สำเร็จ, ล้มเหลว)
- แสดงขนาดไฟล์และชื่อไฟล์
- ปุ่มลบรูปภาพที่ใช้งานง่าย

### 3. การแสดงผลที่ปรับปรุง
- แสดงจำนวนรูปภาพทั้งหมด
- แสดงคำแนะนำการใช้งาน drag & drop
- แสดงสถานะการอัปโหลดแบบ real-time

## การใช้งาน

### สำหรับผู้ใช้
1. อัปโหลดรูปภาพผ่าน drag & drop หรือคลิกเลือกไฟล์
2. ลากรูปภาพเพื่อจัดเรียงลำดับใหม่
3. คลิกปุ่ม "×" เพื่อลบรูปภาพที่ไม่ต้องการ
4. ระบบจะแสดง SweetAlert2 ยืนยันการจัดเรียงสำเร็จ

### สำหรับ Developer
1. ใช้ `@dnd-kit` library สำหรับ drag & drop
2. ใช้ `SortableImage` component สำหรับแสดงรูปภาพแต่ละรูป
3. ใช้ `DndContext` และ `SortableContext` สำหรับจัดการ drag & drop
4. ใช้ `handleDragEnd` function สำหรับจัดการการจัดเรียง

## โครงสร้างโค้ด

### SortableImage Component
```jsx
const SortableImage = ({ image, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `image-${image.id}` });

  // ... component logic
};
```

### Drag & Drop Handlers
```jsx
const handleDragEnd = (event) => {
  const { active, over } = event;
  
  if (active.id !== over.id) {
    setImages(prev => {
      const oldIndex = prev.findIndex(img => `image-${img.id}` === active.id);
      const newIndex = prev.findIndex(img => `image-${img.id}` === over.id);
      
      const reorderedImages = arrayMove(prev, oldIndex, newIndex);
      
      // แสดง SweetAlert2 ยืนยัน
      Swal.fire({
        title: 'จัดเรียงรูปภาพสำเร็จ',
        text: `รูปภาพถูกจัดเรียงใหม่แล้ว (ตำแหน่ง ${oldIndex + 1} → ${newIndex + 1})`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      return reorderedImages;
    });
  }
};
```

### DndContext Setup
```jsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={images.map(img => `image-${img.id}`)}
    strategy={rectSortingStrategy}
  >
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {images.map((image, index) => (
        <SortableImage
          key={`image-${image.id}`}
          image={image}
          index={index}
          onRemove={handleRemoveImage}
        />
      ))}
    </div>
  </SortableContext>
</DndContext>
```

## Dependencies

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

## การปรับแต่งเพิ่มเติม

### เปลี่ยน Grid Layout
```jsx
// เปลี่ยนจาก 6 columns เป็น 4 columns
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
```

### เปลี่ยน Animation
```jsx
// ปรับ transition duration
transition: isDragging ? 0.1 : 0.3,
```

### เปลี่ยน Drag Activation
```jsx
// ปรับระยะทางที่ต้องลากก่อนเริ่ม drag
activationConstraint: {
  distance: 8, // เปลี่ยนเป็น 5 หรือ 10
},
```

## หมายเหตุ

- ฟีเจอร์นี้ใช้ `@dnd-kit` ซึ่งเป็น library ที่ทันสมัยและมีประสิทธิภาพ
- รองรับการใช้งานบน mobile และ desktop
- มี accessibility features ในตัว
- ทำงานร่วมกับ SweetAlert2 สำหรับการแจ้งเตือน
- รองรับการแสดงผลแบบ responsive

## การแก้ไขปัญหา

### รูปภาพไม่แสดง
- ตรวจสอบว่า `image.url` หรือ `image.preview` มีค่าถูกต้อง
- ตรวจสอบ console สำหรับ error messages

### Drag & Drop ไม่ทำงาน
- ตรวจสอบว่า `@dnd-kit` packages ถูกติดตั้งแล้ว
- ตรวจสอบว่า `sensors` ถูกกำหนดค่าถูกต้อง
- ตรวจสอบว่า `items` array ใน `SortableContext` มีค่าถูกต้อง

### Performance Issues
- ใช้ `React.memo` สำหรับ `SortableImage` component หากมีรูปภาพจำนวนมาก
- ใช้ `useCallback` สำหรับ `handleDragEnd` function
- ใช้ `useMemo` สำหรับ `items` array หากมีการคำนวณซับซ้อน
