// Permission system for different user roles
export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Property Management
  PROPERTY_CREATE: 'property:create',
  PROPERTY_READ: 'property:read',
  PROPERTY_UPDATE: 'property:update',
  PROPERTY_DELETE: 'property:delete',
  
  // Project Management
  PROJECT_CREATE: 'project:create',
  PROJECT_READ: 'project:read',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  
  // Content Management
  CONTENT_CREATE: 'content:create',
  CONTENT_READ: 'content:read',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  
  // Article Management
  ARTICLE_CREATE: 'article:create',
  ARTICLE_READ: 'article:read',
  ARTICLE_UPDATE: 'article:update',
  ARTICLE_DELETE: 'article:delete',
  
  // System Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
};

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: [
    // Full access to everything
    ...Object.values(PERMISSIONS)
  ],
  
  editor: [
    // User Management - Read only
    PERMISSIONS.USER_READ,
    
    // Property Management - Create, Read, Update (no delete)
    PERMISSIONS.PROPERTY_CREATE,
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.PROPERTY_UPDATE,
    
    // Project Management - Create, Read, Update (no delete)
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.PROJECT_UPDATE,
    
    // Content Management - Create, Read, Update (no delete)
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_UPDATE,
    
    // Article Management - Create, Read, Update (no delete)
    PERMISSIONS.ARTICLE_CREATE,
    PERMISSIONS.ARTICLE_READ,
    PERMISSIONS.ARTICLE_UPDATE,
    
    // Settings - Read only
    PERMISSIONS.SETTINGS_READ,
  ],
  
  viewer: [
    // Read-only access
    PERMISSIONS.USER_READ,
    PERMISSIONS.PROPERTY_READ,
    PERMISSIONS.PROJECT_READ,
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.ARTICLE_READ,
    PERMISSIONS.SETTINGS_READ,
  ]
};

// Check if user has permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

// Check if user can perform action
export const canPerform = (userRole, action, resource) => {
  const permission = `${resource}:${action}`;
  return hasPermission(userRole, permission);
};

// Get user role from localStorage
export const getUserRole = () => {
  try {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user.role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Check current user permission
export const checkPermission = (permission) => {
  const userRole = getUserRole();
  return hasPermission(userRole, permission);
};

// Check current user can perform action
export const checkCanPerform = (action, resource) => {
  const userRole = getUserRole();
  return canPerform(userRole, action, resource);
};

// Permission components
export const PermissionGuard = ({ permission, children, fallback = null }) => {
  if (!checkPermission(permission)) {
    return fallback;
  }
  return children;
};

export const ActionGuard = ({ action, resource, children, fallback = null }) => {
  if (!checkCanPerform(action, resource)) {
    return fallback;
  }
  return children;
};
