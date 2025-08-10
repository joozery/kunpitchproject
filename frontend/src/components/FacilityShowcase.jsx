import React from 'react';
import * as FacilityIcons from './icons/FacilityIcons';

const FacilityShowcase = () => {
  const facilities = [
    { key: 'PassengerLift', name: 'ลิฟต์โดยสาร', nameEn: 'Passenger Lift' },
    { key: 'Jacuzzi', name: 'อ่างน้ำวน', nameEn: 'Jacuzzi' },
    { key: 'Gym', name: 'ฟิตเนส / ยิม', nameEn: 'Fitness / Gym' },
    { key: 'Shuttle', name: 'รถรับส่ง', nameEn: 'Shuttle Service' },
    { key: 'Garden', name: 'สวน', nameEn: 'Garden' },
    { key: 'Playground', name: 'สนามเด็กเล่น', nameEn: 'Kids Playground' },
    { key: 'Library', name: 'ห้องสมุด', nameEn: 'Library' },
    { key: 'Store', name: 'ร้านค้า / มินิมาร์ท', nameEn: 'Convenience Store / Minimart' },
    { key: 'AccessControl', name: 'ระบบควบคุมการเข้าออก', nameEn: 'Access Control (Fingerprint / Keycard)' },
    { key: 'Laundry', name: 'ซักรีด', nameEn: 'Laundry' },
    { key: 'Motorcycle', name: 'ที่จอดรถมอเตอร์ไซค์', nameEn: 'Motorcycle Parking' },
    { key: 'MeetingRoom', name: 'ห้องประชุม', nameEn: 'Meeting Room' },
    { key: 'Parking', name: 'ที่จอดรถ', nameEn: 'Parking' },
    { key: 'SteamRoom', name: 'ห้องอบไอน้ำ', nameEn: 'Steam Room' },
    { key: 'Security', name: 'รักษาความปลอดภัย 24 ชม.', nameEn: '24-hour Security with CCTV' },
    { key: 'Wifi', name: 'ไวไฟ', nameEn: 'WIFI' },
    { key: 'Pool', name: 'สระว่ายน้ำ', nameEn: 'Swimming Pool' },
    { key: 'Sauna', name: 'ซาวน่า', nameEn: 'Sauna' },
    { key: 'Restaurant', name: 'ร้านอาหาร', nameEn: 'Restaurant' },
    { key: 'EvCharger', name: 'ชาร์จรถไฟฟ้า', nameEn: 'EV Charger' },
    { key: 'Pet', name: 'อนุญาตสัตว์เลี้ยง', nameEn: 'Allow Pet' },
    { key: 'Stadium', name: 'สนามกีฬา', nameEn: 'Stadium' },
    { key: 'Lobby', name: 'ล็อบบี้', nameEn: 'Lobby' },
    { key: 'PrivateLift', name: 'ลิฟต์ส่วนตัว', nameEn: 'Private Lift' },
    { key: 'Lounge', name: 'พื้นที่นั่งเล่น', nameEn: 'Lounge Area' },
    { key: 'CoWorking', name: 'พื้นที่ทำงานร่วมกัน', nameEn: 'Co-Working Space' },
    { key: 'Cafe', name: 'คาเฟ่', nameEn: 'Cafe' },
    { key: 'DiningRoom', name: 'ห้องอาหารส่วนตัว / ห้องปาร์ตี้', nameEn: 'Private Dining Room / Party Room' },
    { key: 'Cinema', name: 'ห้องภาพยนตร์ / โรงละคร', nameEn: 'Cinema Room / Theatre' },
    { key: 'SportArea', name: 'พื้นที่กีฬา', nameEn: 'Sport Area' },
    { key: 'GolfSimulator', name: 'ซิมูเลเตอร์กอล์ฟ', nameEn: 'Golf Simulator' },
    { key: 'Clubhouse', name: 'คลับเฮาส์', nameEn: 'Clubhouse' },
    { key: 'PrivatePool', name: 'สระว่ายน้ำส่วนตัว', nameEn: 'Private Pool' },
    { key: 'CoKitchen', name: 'ครัวร่วมกัน', nameEn: 'Co-Kitchen' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          สิ่งอำนวยความสะดวกโครงการ
        </h2>
        <p className="text-lg text-gray-600">
          Project Facilities
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {facilities.map((facility) => {
          const IconComponent = FacilityIcons[facility.key];
          return (
            <div
              key={facility.key}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-12 h-12 flex items-center justify-center text-blue-600 mb-3">
                <IconComponent className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {facility.name}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {facility.nameEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacilityShowcase; 