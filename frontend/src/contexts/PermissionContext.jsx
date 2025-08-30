import React, { createContext, useContext, useState, useEffect } from 'react';

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 PermissionContext useEffect triggered');
    // ดึงข้อมูลผู้ใช้จาก localStorage หรือ API
    const loadUserPermissions = () => {
      try {
        // ใช้ key เดียวกันกับ RequireAuth
        const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
        const token = localStorage.getItem('auth_token');
        
        console.log('🔍 PermissionContext Debug:', { 
          user, 
          token, 
          userRole: user.role,
          localStorage: {
            auth_token: localStorage.getItem('auth_token'),
            auth_user: localStorage.getItem('auth_user')
          }
        });
        
        if (user.role && token) {
          console.log('✅ User authenticated:', { role: user.role, token: token ? 'exists' : 'missing' });
          setUserRole(user.role);
          
          // กำหนดสิทธิ์ตามบทบาท
          const userPermissions = {
            // Owner: ทำได้ทุกอย่าง
            owner: {
              canManageProjects: true,
              canManageProperties: true,
              canManageUsers: true,
              canDelete: true,
              canViewAll: true,
              canAccessContact: true,
              canAccessFindWithUs: true,
              canManageBanners: true,
              canManageArticles: true,
              canManageYoutube: true
            },
            // Admin: ทำได้ทุกอย่าง ยกเว้นผู้ใช้งาน
            admin: {
              canManageProjects: true,
              canManageProperties: true,
              canManageUsers: false,
              canDelete: true,
              canViewAll: true,
              canAccessContact: false,
              canAccessFindWithUs: false,
              canManageBanners: true,
              canManageArticles: true,
              canManageYoutube: true
            },
            // Project Manager: จัดการ project เท่านั้น
            project_manager: {
              canManageProjects: true,
              canManageProperties: false,
              canManageUsers: false,
              canDelete: false,
              canViewAll: false,
              canAccessContact: false,
              canAccessFindWithUs: false,
              canManageBanners: false,
              canManageArticles: false,
              canManageYoutube: false
            },
            // Property Manager: จัดการ property ทั้งสี่ประเภท
            property_manager: {
              canManageProjects: false,
              canManageProperties: true,
              canManageUsers: false,
              canDelete: false,
              canViewAll: false,
              canAccessContact: false,
              canAccessFindWithUs: false,
              canManageBanners: false,
              canManageArticles: false,
              canManageYoutube: false
            },
            // Editor: แก้ไขได้แต่ไม่สามารถลบได้
            editor: {
              canManageProjects: true,
              canManageProperties: true,
              canManageUsers: false,
              canDelete: false,
              canViewAll: true,
              canAccessContact: false,
              canAccessFindWithUs: false,
              canManageBanners: true,
              canManageArticles: true,
              canManageYoutube: true
            },
            // Viewer: ดูได้อย่างเดียว
            viewer: {
              canManageProjects: false,
              canManageProperties: false,
              canManageUsers: false,
              canDelete: false,
              canViewAll: true,
              canAccessContact: false,
              canAccessFindWithUs: false,
              canManageBanners: false,
              canManageArticles: false,
              canManageYoutube: false
            }
          };
          
          const finalPermissions = userPermissions[user.role] || {};
          console.log('✅ Permissions set:', { role: user.role, permissions: finalPermissions });
          setPermissions(finalPermissions);
        } else {
          console.log('❌ No user or token found');
          // ถ้าไม่มีข้อมูลผู้ใช้ ให้เป็น guest
          setUserRole('guest');
          setPermissions({
            canManageProjects: false,
            canManageProperties: false,
            canManageUsers: false,
            canDelete: false,
            canViewAll: false,
            canAccessContact: false,
            canAccessFindWithUs: false,
            canManageBanners: false,
            canManageArticles: false,
            canManageYoutube: false
          });
        }
      } catch (error) {
        console.error('Error loading user permissions:', error);
        setUserRole('guest');
        setPermissions({});
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPermissions();
  }, []);

  // ฟังก์ชันสำหรับอัปเดตสิทธิ์เมื่อ login/logout
  const updatePermissions = (user) => {
    if (user && user.role) {
      setUserRole(user.role);
      
      const userPermissions = {
        owner: {
          canManageProjects: true,
          canManageProperties: true,
          canManageUsers: true,
          canDelete: true,
          canViewAll: true,
          canAccessContact: true,
          canAccessFindWithUs: true,
          canManageBanners: true,
          canManageArticles: true,
          canManageYoutube: true
        },
        admin: {
          canManageProjects: true,
          canManageProperties: true,
          canManageUsers: false,
          canDelete: true,
          canViewAll: true,
          canAccessContact: false,
          canAccessFindWithUs: false,
          canManageBanners: true,
          canManageArticles: true,
          canManageYoutube: true
        },
        project_manager: {
          canManageProjects: true,
          canManageProperties: false,
          canManageUsers: false,
          canDelete: false,
          canViewAll: false,
          canAccessContact: false,
          canAccessFindWithUs: false,
          canManageBanners: false,
          canManageArticles: false,
          canManageYoutube: false
        },
        property_manager: {
          canManageProjects: false,
          canManageProperties: true,
          canManageUsers: false,
          canDelete: false,
          canViewAll: false,
          canAccessContact: false,
          canAccessFindWithUs: false,
          canManageBanners: false,
          canManageArticles: false,
          canManageYoutube: false
        },
        editor: {
          canManageProjects: true,
          canManageProperties: true,
          canManageUsers: false,
          canDelete: false,
          canViewAll: true,
          canAccessContact: false,
          canAccessFindWithUs: false,
          canManageBanners: true,
          canManageArticles: true,
          canManageYoutube: true
        },
        viewer: {
          canManageProjects: false,
          canManageProperties: false,
          canManageUsers: false,
          canDelete: false,
          canViewAll: true,
          canAccessContact: false,
          canAccessFindWithUs: false,
          canManageBanners: false,
          canManageArticles: false,
          canManageYoutube: false
        }
      };
      
      setPermissions(userPermissions[user.role] || {});
    } else {
      setUserRole('guest');
      setPermissions({});
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบสิทธิ์แบบง่าย
  const hasPermission = (permission) => {
    return permissions[permission] || false;
  };

  // ฟังก์ชันสำหรับตรวจสอบสิทธิ์หลายอย่าง
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions[permission]);
  };

  // ฟังก์ชันสำหรับตรวจสอบสิทธิ์ทั้งหมด
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions[permission]);
  };

  const value = {
    userRole,
    permissions,
    isLoading,
    updatePermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    // Helper functions สำหรับสิทธิ์หลัก
    canManageProjects: permissions.canManageProjects || false,
    canManageProperties: permissions.canManageProperties || false,
    canManageUsers: permissions.canManageUsers || false,
    canDelete: permissions.canDelete || false,
    canViewAll: permissions.canViewAll || false,
    canAccessContact: permissions.canAccessContact || false,
    canAccessFindWithUs: permissions.canAccessFindWithUs || false,
    canManageBanners: permissions.canManageBanners || false,
    canManageArticles: permissions.canManageArticles || false,
    canManageYoutube: permissions.canManageYoutube || false
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
