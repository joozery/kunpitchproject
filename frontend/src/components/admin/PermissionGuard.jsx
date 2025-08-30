import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

/**
 * PermissionGuard Component
 * ใช้สำหรับแสดง/ซ่อน content ตามสิทธิ์ของผู้ใช้
 * 
 * @param {string} requiredPermission - สิทธิ์ที่ต้องการ (เช่น 'canDelete', 'canManageUsers')
 * @param {React.ReactNode} children - content ที่จะแสดงถ้ามีสิทธิ์
 * @param {React.ReactNode} fallback - content ที่จะแสดงถ้าไม่มีสิทธิ์ (default: null)
 * @param {boolean} showFallback - แสดง fallback หรือไม่ (default: true)
 * @param {string} fallbackMessage - ข้อความที่จะแสดงถ้าไม่มีสิทธิ์
 * @param {string} fallbackType - ประเภทของ fallback ('error', 'warning', 'info', 'hidden')
 */
const PermissionGuard = ({ 
  children, 
  requiredPermission, 
  fallback = null,
  showFallback = true,
  fallbackMessage = 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้',
  fallbackType = 'warning'
}) => {
  const { hasPermission, userRole } = usePermissions();
  
  // ตรวจสอบสิทธิ์
  if (hasPermission(requiredPermission)) {
    return children;
  }
  
  // ถ้าไม่แสดง fallback ให้ return null
  if (!showFallback) {
    return null;
  }
  
  // ถ้ามี fallback ที่กำหนดเอง ให้แสดง
  if (fallback) {
    return fallback;
  }
  
  // แสดง fallback ตามประเภท
  const getFallbackStyle = () => {
    switch (fallbackType) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'hidden':
        return 'hidden';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };
  
  const getFallbackIcon = () => {
    switch (fallbackType) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '🔒';
    }
  };
  
  if (fallbackType === 'hidden') {
    return null;
  }
  
  return (
    <div className={`border rounded-lg p-4 ${getFallbackStyle()}`}>
      <div className="flex items-center">
        <span className="text-lg mr-2">{getFallbackIcon()}</span>
        <div>
          <p className="font-medium">{fallbackMessage}</p>
          <p className="text-sm opacity-75">
            บทบาทปัจจุบัน: {getRoleDisplayName(userRole)}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * ฟังก์ชันแปลงชื่อบทบาทเป็นภาษาไทย
 */
const getRoleDisplayName = (role) => {
  const roleNames = {
    'owner': 'เจ้าของ',
    'admin': 'ผู้ดูแลระบบ',
    'project_manager': 'ผู้จัดการโครงการ',
    'property_manager': 'ผู้จัดการทรัพย์สิน',
    'editor': 'ผู้แก้ไข',
    'viewer': 'ผู้ดู',
    'guest': 'ผู้เยี่ยมชม'
  };
  return roleNames[role] || role;
};

/**
 * PermissionGuard สำหรับการแสดงปุ่มตามสิทธิ์
 */
export const ButtonPermissionGuard = ({ 
  children, 
  requiredPermission, 
  fallback = null,
  showFallback = false,
  className = "opacity-50 cursor-not-allowed"
}) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(requiredPermission)) {
    return children;
  }
  
  if (fallback) {
    return fallback;
  }
  
  if (showFallback) {
    return (
      <div className={className} title="คุณไม่มีสิทธิ์ใช้งานฟีเจอร์นี้">
        {children}
      </div>
    );
  }
  
  return null;
};

/**
 * PermissionGuard สำหรับการแสดงเมนูตามสิทธิ์
 */
export const MenuPermissionGuard = ({ 
  children, 
  requiredPermission, 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(requiredPermission)) {
    return children;
  }
  
  return fallback;
};

/**
 * PermissionGuard สำหรับการแสดงข้อมูลตามสิทธิ์
 */
export const DataPermissionGuard = ({ 
  children, 
  requiredPermission, 
  fallback = null,
  fallbackMessage = 'ข้อมูลนี้ถูกจำกัดการเข้าถึง'
}) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(requiredPermission)) {
    return children;
  }
  
  if (fallback) {
    return fallback;
  }
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-gray-600">{fallbackMessage}</p>
    </div>
  );
};

/**
 * HOC สำหรับ wrap component ด้วย PermissionGuard
 */
export const withPermission = (WrappedComponent, requiredPermission, fallback = null) => {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard requiredPermission={requiredPermission} fallback={fallback}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
};

export default PermissionGuard;

