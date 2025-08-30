/**
 * Utility functions สำหรับจัดการสิทธิ์
 */

/**
 * แปลงชื่อบทบาทเป็นภาษาไทย
 * @param {string} role - บทบาทในภาษาอังกฤษ
 * @returns {string} ชื่อบทบาทในภาษาไทย
 */
export const getRoleDisplayName = (role) => {
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
 * แปลงชื่อบทบาทเป็นภาษาอังกฤษ
 * @param {string} thaiRole - ชื่อบทบาทในภาษาไทย
 * @returns {string} บทบาทในภาษาอังกฤษ
 */
export const getRoleFromThaiName = (thaiRole) => {
  const roleMap = {
    'เจ้าของ': 'owner',
    'ผู้ดูแลระบบ': 'admin',
    'ผู้จัดการโครงการ': 'project_manager',
    'ผู้จัดการทรัพย์สิน': 'property_manager',
    'ผู้แก้ไข': 'editor',
    'ผู้ดู': 'viewer',
    'ผู้เยี่ยมชม': 'guest'
  };
  return roleMap[thaiRole] || 'viewer';
};

/**
 * ตรวจสอบว่าบทบาทสามารถเข้าถึงได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @param {string} requiredRole - บทบาทที่ต้องการ
 * @returns {boolean} สามารถเข้าถึงได้หรือไม่
 */
export const canAccessRole = (userRole, requiredRole) => {
  const roleHierarchy = {
    'owner': ['owner', 'admin', 'project_manager', 'property_manager', 'editor', 'viewer'],
    'admin': ['admin', 'project_manager', 'property_manager', 'editor', 'viewer'],
    'project_manager': ['project_manager'],
    'property_manager': ['property_manager'],
    'editor': ['editor', 'viewer'],
    'viewer': ['viewer']
  };
  
  return roleHierarchy[userRole]?.includes(requiredRole) || false;
};

/**
 * ตรวจสอบว่าสามารถจัดการ project ได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถจัดการ project ได้หรือไม่
 */
export const canManageProjects = (userRole) => {
  return ['owner', 'admin', 'project_manager', 'editor'].includes(userRole);
};

/**
 * ตรวจสอบว่าสามารถจัดการ property ได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถจัดการ property ได้หรือไม่
 */
export const canManageProperties = (userRole) => {
  return ['owner', 'admin', 'property_manager', 'editor'].includes(userRole);
};

/**
 * ตรวจสอบว่าสามารถจัดการผู้ใช้งานได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถจัดการผู้ใช้งานได้หรือไม่
 */
export const canManageUsers = (userRole) => {
  return userRole === 'owner';
};

/**
 * ตรวจสอบว่าสามารถลบข้อมูลได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถลบข้อมูลได้หรือไม่
 */
export const canDelete = (userRole) => {
  return ['owner', 'admin'].includes(userRole);
};

/**
 * ตรวจสอบว่าสามารถเข้าถึงข้อมูลช่องทางติดต่อได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถเข้าถึงข้อมูลช่องทางติดต่อได้หรือไม่
 */
export const canAccessContact = (userRole) => {
  return userRole === 'owner';
};

/**
 * ตรวจสอบว่าสามารถเข้าถึงข้อมูล find with us ได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถเข้าถึงข้อมูล find with us ได้หรือไม่
 */
export const canAccessFindWithUs = (userRole) => {
  return userRole === 'owner';
};

/**
 * ตรวจสอบว่าสามารถจัดการ banner ได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถจัดการ banner ได้หรือไม่
 */
export const canManageBanners = (userRole) => {
  return ['owner', 'admin', 'editor'].includes(userRole);
};

/**
 * ตรวจสอบว่าสามารถจัดการ articles ได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถจัดการ articles ได้หรือไม่
 */
export const canManageArticles = (userRole) => {
  return ['owner', 'admin', 'editor'].includes(userRole);
};

/**
 * ตรวจสอบว่าสามารถจัดการ YouTube ได้หรือไม่
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {boolean} สามารถจัดการ YouTube ได้หรือไม่
 */
export const canManageYoutube = (userRole) => {
  return ['owner', 'admin', 'editor'].includes(userRole);
};

/**
 * สร้าง object สิทธิ์ตามบทบาท
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {object} object ที่มีสิทธิ์ต่างๆ
 */
export const createPermissionsObject = (userRole) => {
  return {
    canManageProjects: canManageProjects(userRole),
    canManageProperties: canManageProperties(userRole),
    canManageUsers: canManageUsers(userRole),
    canDelete: canDelete(userRole),
    canViewAll: ['owner', 'admin', 'editor', 'viewer'].includes(userRole),
    canAccessContact: canAccessContact(userRole),
    canAccessFindWithUs: canAccessFindWithUs(userRole),
    canManageBanners: canManageBanners(userRole),
    canManageArticles: canManageArticles(userRole),
    canManageYoutube: canManageYoutube(userRole)
  };
};

/**
 * ตรวจสอบสิทธิ์แบบง่าย
 * @param {string} userRole - บทบาทของผู้ใช้
 * @param {string} permission - สิทธิ์ที่ต้องการตรวจสอบ
 * @returns {boolean} มีสิทธิ์หรือไม่
 */
export const hasPermission = (userRole, permission) => {
  const permissions = createPermissionsObject(userRole);
  return permissions[permission] || false;
};

/**
 * ตรวจสอบสิทธิ์หลายอย่าง
 * @param {string} userRole - บทบาทของผู้ใช้
 * @param {Array<string>} permissionList - รายการสิทธิ์ที่ต้องการตรวจสอบ
 * @returns {boolean} มีสิทธิ์อย่างน้อยหนึ่งอย่างหรือไม่
 */
export const hasAnyPermission = (userRole, permissionList) => {
  return permissionList.some(permission => hasPermission(userRole, permission));
};

/**
 * ตรวจสอบสิทธิ์ทั้งหมด
 * @param {string} userRole - บทบาทของผู้ใช้
 * @param {Array<string>} permissionList - รายการสิทธิ์ที่ต้องการตรวจสอบ
 * @returns {boolean} มีสิทธิ์ทั้งหมดหรือไม่
 */
export const hasAllPermissions = (userRole, permissionList) => {
  return permissionList.every(permission => hasPermission(userRole, permission));
};

/**
 * สร้างรายการเมนูตามสิทธิ์
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {Array} รายการเมนูที่สามารถเข้าถึงได้
 */
export const getAccessibleMenus = (userRole) => {
  const allMenus = [
    { id: 'dashboard', name: 'แดชบอร์ด', path: '/admin/dashboard', icon: 'Dashboard' },
    { id: 'projects', name: 'โครงการ', path: '/admin/projects', icon: 'Building', permission: 'canManageProjects' },
    { id: 'houses', name: 'บ้าน', path: '/admin/houses', icon: 'Home', permission: 'canManageProperties' },
    { id: 'condos', name: 'คอนโด', path: '/admin/condos', icon: 'Building', permission: 'canManageProperties' },
    { id: 'lands', name: 'ที่ดิน', path: '/admin/lands', icon: 'MapPin', permission: 'canManageProperties' },
    { id: 'commercials', name: 'โฮมออฟฟิศ', path: '/admin/commercials', icon: 'Briefcase', permission: 'canManageProperties' },
    { id: 'users', name: 'ผู้ใช้งาน', path: '/admin/users', icon: 'Users', permission: 'canManageUsers' },
    { id: 'contacts', name: 'ข้อมูลติดต่อ', path: '/admin/contacts', icon: 'Mail', permission: 'canAccessContact' },
    { id: 'find-with-us', name: 'Find With Us', path: '/admin/find-with-us', icon: 'Search', permission: 'canAccessFindWithUs' },
    { id: 'banners', name: 'แบนเนอร์', path: '/admin/banners', icon: 'Image', permission: 'canManageBanners' },
    { id: 'articles', name: 'บทความ', path: '/admin/articles', icon: 'FileText', permission: 'canManageArticles' },
    { id: 'youtube', name: 'YouTube', path: '/admin/youtube', icon: 'Video', permission: 'canManageYoutube' }
  ];
  
  return allMenus.filter(menu => {
    if (!menu.permission) return true; // เมนูที่ไม่มี permission requirement
    return hasPermission(userRole, menu.permission);
  });
};

/**
 * สร้างข้อความอธิบายบทบาท
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {string} ข้อความอธิบายบทบาท
 */
export const getRoleDescription = (userRole) => {
  const descriptions = {
    'owner': 'คุณสามารถเข้าถึงและจัดการทุกอย่างได้',
    'admin': 'คุณสามารถจัดการได้ทุกอย่าง ยกเว้นผู้ใช้งาน',
    'project_manager': 'คุณสามารถจัดการโครงการได้ แก้ไขได้ แต่ลบไม่ได้',
    'property_manager': 'คุณสามารถจัดการทรัพย์สินได้ แก้ไขได้ แต่ลบไม่ได้',
    'editor': 'คุณสามารถแก้ไขข้อมูลได้ แต่ลบไม่ได้',
    'viewer': 'คุณสามารถดูข้อมูลได้อย่างเดียว',
    'guest': 'คุณยังไม่ได้เข้าสู่ระบบ'
  };
  return descriptions[userRole] || 'ไม่ทราบบทบาท';
};

/**
 * สร้าง badge สำหรับแสดงบทบาท
 * @param {string} userRole - บทบาทของผู้ใช้
 * @returns {object} object ที่มี className และ text สำหรับ badge
 */
export const getRoleBadge = (userRole) => {
  const badges = {
    'owner': {
      className: 'bg-purple-100 text-purple-800 border-purple-200',
      text: 'เจ้าของ'
    },
    'admin': {
      className: 'bg-red-100 text-red-800 border-red-200',
      text: 'ผู้ดูแลระบบ'
    },
    'project_manager': {
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      text: 'ผู้จัดการโครงการ'
    },
    'property_manager': {
      className: 'bg-green-100 text-green-800 border-green-200',
      text: 'ผู้จัดการทรัพย์สิน'
    },
    'editor': {
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      text: 'ผู้แก้ไข'
    },
    'viewer': {
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      text: 'ผู้ดู'
    },
    'guest': {
      className: 'bg-gray-100 text-gray-600 border-gray-200',
      text: 'ผู้เยี่ยมชม'
    }
  };
  
  return badges[userRole] || badges.guest;
};
