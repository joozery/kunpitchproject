# Facility Icons

ชุด icon minimal สำหรับสิ่งอำนวยความสะดวกโครงการคอนโด

## การใช้งาน

### Import Icons

```jsx
// Import individual icons
import { PoolIcon, GymIcon, SecurityIcon } from './FacilityIcons';

// Import all icons
import * as FacilityIcons from './FacilityIcons';
```

### Basic Usage

```jsx
function MyComponent() {
  return (
    <div>
      <PoolIcon className="w-6 h-6 text-blue-500" />
      <GymIcon className="w-8 h-8 text-green-600" />
      <SecurityIcon className="w-10 h-10 text-red-500" />
    </div>
  );
}
```

### Using with FacilityIcons Object

```jsx
function FacilityList() {
  const facilities = [
    { key: 'Pool', name: 'สระว่ายน้ำ' },
    { key: 'Gym', name: 'ฟิตเนส' },
    { key: 'Security', name: 'รักษาความปลอดภัย' }
  ];

  return (
    <div>
      {facilities.map((facility) => {
        const IconComponent = FacilityIcons[facility.key];
        return (
          <div key={facility.key}>
            <IconComponent className="w-6 h-6" />
            <span>{facility.name}</span>
          </div>
        );
      })}
    </div>
  );
}
```

## Available Icons

| Icon Name | Thai Name | English Name |
|-----------|-----------|--------------|
| `PassengerLiftIcon` | ลิฟต์โดยสาร | Passenger Lift |
| `JacuzziIcon` | อ่างน้ำวน | Jacuzzi |
| `GymIcon` | ฟิตเนส / ยิม | Fitness / Gym |
| `ShuttleIcon` | รถรับส่ง | Shuttle Service |
| `GardenIcon` | สวน | Garden |
| `PlaygroundIcon` | สนามเด็กเล่น | Kids Playground |
| `LibraryIcon` | ห้องสมุด | Library |
| `StoreIcon` | ร้านค้า / มินิมาร์ท | Convenience Store / Minimart |
| `AccessControlIcon` | ระบบควบคุมการเข้าออก | Access Control |
| `LaundryIcon` | ซักรีด | Laundry |
| `MotorcycleIcon` | ที่จอดรถมอเตอร์ไซค์ | Motorcycle Parking |
| `MeetingRoomIcon` | ห้องประชุม | Meeting Room |
| `ParkingIcon` | ที่จอดรถ | Parking |
| `SteamRoomIcon` | ห้องอบไอน้ำ | Steam Room |
| `SecurityIcon` | รักษาความปลอดภัย 24 ชม. | 24-hour Security with CCTV |
| `WifiIcon` | ไวไฟ | WIFI |
| `PoolIcon` | สระว่ายน้ำ | Swimming Pool |
| `SaunaIcon` | ซาวน่า | Sauna |
| `RestaurantIcon` | ร้านอาหาร | Restaurant |
| `EvChargerIcon` | ชาร์จรถไฟฟ้า | EV Charger |
| `PetIcon` | อนุญาตสัตว์เลี้ยง | Allow Pet |
| `StadiumIcon` | สนามกีฬา | Stadium |
| `LobbyIcon` | ล็อบบี้ | Lobby |
| `PrivateLiftIcon` | ลิฟต์ส่วนตัว | Private Lift |
| `LoungeIcon` | พื้นที่นั่งเล่น | Lounge Area |
| `CoWorkingIcon` | พื้นที่ทำงานร่วมกัน | Co-Working Space |
| `CafeIcon` | คาเฟ่ | Cafe |
| `DiningRoomIcon` | ห้องอาหารส่วนตัว / ห้องปาร์ตี้ | Private Dining Room / Party Room |
| `CinemaIcon` | ห้องภาพยนตร์ / โรงละคร | Cinema Room / Theatre |
| `SportAreaIcon` | พื้นที่กีฬา | Sport Area |
| `GolfSimulatorIcon` | ซิมูเลเตอร์กอล์ฟ | Golf Simulator |
| `ClubhouseIcon` | คลับเฮาส์ | Clubhouse |
| `PrivatePoolIcon` | สระว่ายน้ำส่วนตัว | Private Pool |
| `CoKitchenIcon` | ครัวร่วมกัน | Co-Kitchen |

## Props

ทุก icon component รับ props เหล่านี้:

- `className`: CSS classes สำหรับ styling (default: "w-6 h-6")
- `...props`: SVG attributes อื่นๆ เช่น `stroke`, `fill`, `onClick` เป็นต้น

## Styling

Icon เหล่านี้ใช้ `stroke="currentColor"` ดังนั้นสามารถเปลี่ยนสีได้ผ่าน CSS color หรือ Tailwind classes:

```jsx
// เปลี่ยนสีด้วย Tailwind
<PoolIcon className="w-6 h-6 text-blue-500" />
<GymIcon className="w-8 h-8 text-green-600" />

// เปลี่ยนสีด้วย CSS
<SecurityIcon style={{ color: '#ef4444' }} />
```

## Responsive Design

Icon เหล่านี้ถูกออกแบบให้ responsive และสามารถปรับขนาดได้ตามต้องการ:

```jsx
// ขนาดต่างๆ
<PoolIcon className="w-4 h-4" />  // Small
<PoolIcon className="w-6 h-6" />  // Default
<PoolIcon className="w-8 h-8" />  // Medium
<PoolIcon className="w-12 h-12" /> // Large
```

## Example Component

ดูตัวอย่างการใช้งานใน `FacilityShowcase.jsx` ที่แสดง icon ทั้งหมดพร้อมชื่อภาษาไทยและอังกฤษ 