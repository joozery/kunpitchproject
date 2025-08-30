import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';
import PermissionGuard, { 
  ButtonPermissionGuard, 
  MenuPermissionGuard, 
  DataPermissionGuard 
} from './PermissionGuard';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

/**
 * ตัวอย่างการใช้งาน PermissionGuard Components
 * ไฟล์นี้แสดงวิธีการใช้งาน PermissionGuard ต่างๆ
 */
const PermissionExamples = () => {
  const { 
    userRole, 
    canDelete, 
    canManageProjects, 
    canManageProperties,
    canManageUsers,
    canAccessContact,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  } = usePermissions();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900 font-prompt">
        ตัวอย่างการใช้งานระบบสิทธิ์
      </h1>

      {/* ข้อมูลผู้ใช้ปัจจุบัน */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลผู้ใช้ปัจจุบัน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>บทบาท:</strong> {userRole}</p>
            <p><strong>สามารถลบได้:</strong> {canDelete ? 'ใช่' : 'ไม่'}</p>
            <p><strong>สามารถจัดการโครงการได้:</strong> {canManageProjects ? 'ใช่' : 'ไม่'}</p>
            <p><strong>สามารถจัดการทรัพย์สินได้:</strong> {canManageProperties ? 'ใช่' : 'ไม่'}</p>
            <p><strong>สามารถจัดการผู้ใช้งานได้:</strong> {canManageUsers ? 'ใช่' : 'ไม่'}</p>
            <p><strong>สามารถเข้าถึงข้อมูลติดต่อได้:</strong> {canAccessContact ? 'ใช่' : 'ไม่'}</p>
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่าง PermissionGuard พื้นฐาน */}
      <Card>
        <CardHeader>
          <CardTitle>PermissionGuard พื้นฐาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">ปุ่มลบข้อมูล (แสดงเฉพาะผู้ที่มีสิทธิ์)</h4>
            <PermissionGuard requiredPermission="canDelete">
              <Button variant="destructive">ลบข้อมูล</Button>
            </PermissionGuard>
          </div>

          <div>
            <h4 className="font-medium mb-2">ปุ่มจัดการโครงการ (แสดงเฉพาะผู้ที่มีสิทธิ์)</h4>
            <PermissionGuard requiredPermission="canManageProjects">
              <Button variant="default">จัดการโครงการ</Button>
            </PermissionGuard>
          </div>

          <div>
            <h4 className="font-medium mb-2">ปุ่มจัดการผู้ใช้งาน (แสดงเฉพาะ Owner)</h4>
            <PermissionGuard requiredPermission="canManageUsers">
              <Button variant="secondary">จัดการผู้ใช้งาน</Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่าง PermissionGuard พร้อม fallback */}
      <Card>
        <CardHeader>
          <CardTitle>PermissionGuard พร้อม Fallback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">ข้อมูลที่จำกัดการเข้าถึง</h4>
            <PermissionGuard 
              requiredPermission="canAccessContact"
              fallback={<p className="text-red-600">คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้</p>}
            >
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p>ข้อมูลติดต่อที่สำคัญ</p>
                <p>อีเมล: contact@example.com</p>
                <p>โทร: 02-123-4567</p>
              </div>
            </PermissionGuard>
          </div>

          <div>
            <h4 className="font-medium mb-2">เมนูที่จำกัดการเข้าถึง</h4>
            <PermissionGuard 
              requiredPermission="canManageProperties"
              fallback={<p className="text-yellow-600">เมนูนี้ถูกจำกัดการเข้าถึง</p>}
            >
              <Button variant="outline">จัดการทรัพย์สิน</Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่าง ButtonPermissionGuard */}
      <Card>
        <CardHeader>
          <CardTitle>ButtonPermissionGuard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">ปุ่มที่ถูกปิดใช้งาน (แสดงแต่คลิกไม่ได้)</h4>
            <ButtonPermissionGuard 
              requiredPermission="canDelete"
              showFallback={true}
            >
              <Button variant="destructive">ลบข้อมูล</Button>
            </ButtonPermissionGuard>
          </div>

          <div>
            <h4 className="font-medium mb-2">ปุ่มที่ซ่อน (ไม่แสดงเลย)</h4>
            <ButtonPermissionGuard 
              requiredPermission="canManageUsers"
              showFallback={false}
            >
              <Button variant="secondary">จัดการผู้ใช้งาน</Button>
            </ButtonPermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่าง MenuPermissionGuard */}
      <Card>
        <CardHeader>
          <CardTitle>MenuPermissionGuard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <MenuPermissionGuard requiredPermission="canManageProjects">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800">เมนูจัดการโครงการ</p>
              </div>
            </MenuPermissionGuard>

            <MenuPermissionGuard requiredPermission="canManageProperties">
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800">เมนูจัดการทรัพย์สิน</p>
              </div>
            </MenuPermissionGuard>

            <MenuPermissionGuard requiredPermission="canManageUsers">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                <p className="text-purple-800">เมนูจัดการผู้ใช้งาน</p>
              </div>
            </MenuPermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่าง DataPermissionGuard */}
      <Card>
        <CardHeader>
          <CardTitle>DataPermissionGuard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">ข้อมูลที่จำกัดการเข้าถึง</h4>
            <DataPermissionGuard 
              requiredPermission="canAccessContact"
              fallbackMessage="ข้อมูลนี้ถูกจำกัดการเข้าถึงสำหรับผู้ใช้ทั่วไป"
            >
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h5 className="font-medium text-blue-800 mb-2">ข้อมูลติดต่อลูกค้า</h5>
                <ul className="text-blue-700 space-y-1">
                  <li>• อีเมล: customer@example.com</li>
                  <li>• โทร: 02-123-4567</li>
                  <li>• Line: @example</li>
                </ul>
              </div>
            </DataPermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่างการตรวจสอบสิทธิ์แบบ Advanced */}
      <Card>
        <CardHeader>
          <CardTitle>การตรวจสอบสิทธิ์แบบ Advanced</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">ตรวจสอบสิทธิ์หลายอย่าง</h4>
            <p>มีสิทธิ์อย่างน้อยหนึ่งอย่าง: {hasAnyPermission(['canManageProjects', 'canManageProperties']) ? 'ใช่' : 'ไม่'}</p>
            <p>มีสิทธิ์ทั้งหมด: {hasAllPermissions(['canDelete', 'canManageUsers']) ? 'ใช่' : 'ไม่'}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">การแสดงเนื้อหาตามสิทธิ์</h4>
            {hasPermission('canDelete') && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">คุณมีสิทธิ์ลบข้อมูลได้</p>
              </div>
            )}
            
            {hasPermission('canManageProjects') && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800">คุณสามารถจัดการโครงการได้</p>
              </div>
            )}

            {hasPermission('canManageUsers') && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                <p className="text-purple-800">คุณสามารถจัดการผู้ใช้งานได้</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่างการใช้งานในชีวิตจริง */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวอย่างการใช้งานในชีวิตจริง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Dashboard สำหรับแต่ละบทบาท</h4>
            
            {/* Owner Dashboard */}
            {userRole === 'owner' && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                <h5 className="font-medium text-purple-800 mb-2">Dashboard สำหรับเจ้าของ</h5>
                <p className="text-purple-700">คุณสามารถเข้าถึงและจัดการทุกอย่างได้</p>
                <div className="mt-3 space-x-2">
                  <Button variant="outline" size="sm">จัดการผู้ใช้งาน</Button>
                  <Button variant="outline" size="sm">ดูรายงานทั้งหมด</Button>
                  <Button variant="outline" size="sm">ตั้งค่าระบบ</Button>
                </div>
              </div>
            )}

            {/* Admin Dashboard */}
            {userRole === 'admin' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h5 className="font-medium text-red-800 mb-2">Dashboard สำหรับผู้ดูแลระบบ</h5>
                <p className="text-red-700">คุณสามารถจัดการได้ทุกอย่าง ยกเว้นผู้ใช้งาน</p>
                <div className="mt-3 space-x-2">
                  <Button variant="outline" size="sm">จัดการโครงการ</Button>
                  <Button variant="outline" size="sm">จัดการทรัพย์สิน</Button>
                  <Button variant="outline" size="sm">ดูรายงาน</Button>
                </div>
              </div>
            )}

            {/* Project Manager Dashboard */}
            {userRole === 'project_manager' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h5 className="font-medium text-blue-800 mb-2">Dashboard สำหรับผู้จัดการโครงการ</h5>
                <p className="text-blue-700">คุณสามารถจัดการโครงการได้ แก้ไขได้ แต่ลบไม่ได้</p>
                <div className="mt-3 space-x-2">
                  <Button variant="outline" size="sm">จัดการโครงการ</Button>
                  <Button variant="outline" size="sm">ดูรายงานโครงการ</Button>
                </div>
              </div>
            )}

            {/* Property Manager Dashboard */}
            {userRole === 'property_manager' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h5 className="font-medium text-green-800 mb-2">Dashboard สำหรับผู้จัดการทรัพย์สิน</h5>
                <p className="text-green-700">คุณสามารถจัดการทรัพย์สินได้ แก้ไขได้ แต่ลบไม่ได้</p>
                <div className="mt-3 space-x-2">
                  <Button variant="outline" size="sm">จัดการบ้าน</Button>
                  <Button variant="outline" size="sm">จัดการคอนโด</Button>
                  <Button variant="outline" size="sm">จัดการที่ดิน</Button>
                  <Button variant="outline" size="sm">จัดการโฮมออฟฟิศ</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionExamples;
