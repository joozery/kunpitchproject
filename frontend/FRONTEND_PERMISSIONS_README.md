# คู่มือการใช้งานระบบสิทธิ์ใน Frontend

## ภาพรวม

คู่มือนี้จะแนะนำการใช้งานระบบสิทธิ์ตามบทบาทใน frontend ของระบบแอดมิน

## ไฟล์ที่สร้าง

### 1. **`src/contexts/PermissionContext.jsx`**
Context หลักสำหรับจัดการสิทธิ์ทั่วทั้งแอป

### 2. **`src/components/admin/PermissionGuard.jsx`**
Component สำหรับแสดง/ซ่อน content ตามสิทธิ์

### 3. **`src/lib/permissionUtils.js`**
Utility functions สำหรับจัดการสิทธิ์

## การใช้งาน

### 1. การ Setup ใน App.jsx

```jsx
import { PermissionProvider } from './contexts/PermissionContext';

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <PermissionProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </ErrorBoundary>
        </PermissionProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
```

### 2. การใช้งาน PermissionContext

```jsx
import { usePermissions } from '../../contexts/PermissionContext';

const MyComponent = () => {
  const { 
    userRole, 
    canDelete, 
    canManageProjects, 
    canManageProperties,
    hasPermission 
  } = usePermissions();

  return (
    <div>
      <p>บทบาท: {userRole}</p>
      {canDelete && <button>ลบข้อมูล</button>}
      {canManageProjects && <Link to="/admin/projects">โครงการ</Link>}
      {hasPermission('canManageUsers') && <Link to="/admin/users">ผู้ใช้งาน</Link>}
    </div>
  );
};
```

### 3. การใช้งาน PermissionGuard

#### **PermissionGuard พื้นฐาน:**
```jsx
import PermissionGuard from './PermissionGuard';

<PermissionGuard requiredPermission="canDelete">
  <button onClick={handleDelete}>ลบข้อมูล</button>
</PermissionGuard>
```

#### **PermissionGuard พร้อม fallback:**
```jsx
<PermissionGuard 
  requiredPermission="canManageUsers"
  fallback={<p>คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ใช้งาน</p>}
>
  <Link to="/admin/users">ผู้ใช้งาน</Link>
</PermissionGuard>
```

#### **PermissionGuard แบบซ่อน:**
```jsx
<PermissionGuard 
  requiredPermission="canDelete"
  showFallback={false}
>
  <button onClick={handleDelete}>ลบข้อมูล</button>
</PermissionGuard>
```

#### **PermissionGuard แบบแสดงข้อความ:**
```jsx
<PermissionGuard 
  requiredPermission="canAccessContact"
  fallbackMessage="ข้อมูลนี้ถูกจำกัดการเข้าถึง"
  fallbackType="error"
>
  <ContactData />
</PermissionGuard>
```

### 4. การใช้งาน PermissionGuard แบบพิเศษ

#### **ButtonPermissionGuard:**
```jsx
import { ButtonPermissionGuard } from './PermissionGuard';

<ButtonPermissionGuard requiredPermission="canDelete">
  <button onClick={handleDelete}>ลบข้อมูล</button>
</ButtonPermissionGuard>
```

#### **MenuPermissionGuard:**
```jsx
import { MenuPermissionGuard } from './PermissionGuard';

<MenuPermissionGuard requiredPermission="canManageProjects">
  <li><Link to="/admin/projects">โครงการ</Link></li>
</MenuPermissionGuard>
```

#### **DataPermissionGuard:**
```jsx
import { DataPermissionGuard } from './PermissionGuard';

<DataPermissionGuard requiredPermission="canAccessContact">
  <ContactList />
</DataPermissionGuard>
```

### 5. การใช้งาน Utility Functions

```jsx
import { 
  getRoleDisplayName, 
  getRoleDescription, 
  getRoleBadge,
  getAccessibleMenus 
} from '../../lib/permissionUtils';

const UserInfo = ({ userRole }) => {
  const roleName = getRoleDisplayName(userRole);
  const roleDesc = getRoleDescription(userRole);
  const roleBadge = getRoleBadge(userRole);
  const menus = getAccessibleMenus(userRole);

  return (
    <div>
      <span className={`px-2 py-1 rounded-full border ${roleBadge.className}`}>
        {roleBadge.text}
      </span>
      <p>{roleDesc}</p>
      <ul>
        {menus.map(menu => (
          <li key={menu.id}>
            <Link to={menu.path}>{menu.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## ตัวอย่างการใช้งานใน Components

### 1. **Sidebar Component**

```jsx
import { usePermissions } from '../../contexts/PermissionContext';

const Sidebar = () => {
  const { 
    canManageProjects, 
    canManageProperties, 
    canManageUsers 
  } = usePermissions();

  return (
    <div className="sidebar">
      {/* Dashboard - แสดงได้ทุกคน */}
      <div className="menu-item">
        <Link to="/admin/dashboard">แดชบอร์ด</Link>
      </div>

      {/* Projects - แสดงเฉพาะผู้ที่มีสิทธิ์ */}
      {canManageProjects && (
        <div className="menu-item">
          <Link to="/admin/projects">โครงการ</Link>
        </div>
      )}

      {/* Properties - แสดงเฉพาะผู้ที่มีสิทธิ์ */}
      {canManageProperties && (
        <>
          <div className="menu-item">
            <Link to="/admin/houses">บ้าน</Link>
          </div>
          <div className="menu-item">
            <Link to="/admin/condos">คอนโด</Link>
          </div>
          <div className="menu-item">
            <Link to="/admin/lands">ที่ดิน</Link>
          </div>
          <div className="menu-item">
            <Link to="/admin/commercials">โฮมออฟฟิศ</Link>
          </div>
        </>
      )}

      {/* Users - แสดงเฉพาะ Owner */}
      {canManageUsers && (
        <div className="menu-item">
          <Link to="/admin/users">ผู้ใช้งาน</Link>
        </div>
      )}
    </div>
  );
};
```

### 2. **Form Component**

```jsx
import { usePermissions } from '../../contexts/PermissionContext';
import PermissionGuard from './PermissionGuard';

const ProjectForm = ({ project, onSave, onDelete }) => {
  const { canDelete } = usePermissions();

  return (
    <form onSubmit={onSave}>
      {/* Form fields */}
      
      {/* Delete button - แสดงเฉพาะผู้ที่มีสิทธิ์ลบ */}
      <PermissionGuard requiredPermission="canDelete">
        <button 
          type="button" 
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          ลบโครงการ
        </button>
      </PermissionGuard>
    </form>
  );
};
```

### 3. **Management Component**

```jsx
import { usePermissions } from '../../contexts/PermissionContext';
import PermissionGuard from './PermissionGuard';

const ProjectManagement = () => {
  const { canManageProjects } = usePermissions();

  // ถ้าไม่มีสิทธิ์จัดการ projects ให้แสดงข้อความ
  if (!canManageProjects) {
    return (
      <div className="access-denied">
        <h2>ไม่มีสิทธิ์เข้าถึง</h2>
        <p>คุณไม่มีสิทธิ์เข้าถึงหน้าจัดการโครงการ</p>
      </div>
    );
  }

  return (
    <div className="project-management">
      <table>
        <thead>
          <tr>
            <th>ชื่อโครงการ</th>
            <th>สถานะ</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.status}</td>
              <td>
                <button onClick={() => handleEdit(project)}>
                  แก้ไข
                </button>
                {/* Delete button - แสดงเฉพาะผู้ที่มีสิทธิ์ลบ */}
                <PermissionGuard requiredPermission="canDelete">
                  <button onClick={() => handleDelete(project.id)}>
                    ลบ
                  </button>
                </PermissionGuard>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 4. **Header Component**

```jsx
import { usePermissions } from '../../contexts/PermissionContext';
import { getRoleBadge, getRoleDescription } from '../../lib/permissionUtils';

const Header = () => {
  const { userRole } = usePermissions();
  const roleBadge = getRoleBadge(userRole);
  const roleDesc = getRoleDescription(userRole);

  return (
    <header className="header">
      <div className="user-info">
        <span className={`px-2 py-1 rounded-full border text-xs ${roleBadge.className}`}>
          {roleBadge.text}
        </span>
        <p className="text-sm text-gray-600">{roleDesc}</p>
      </div>
    </header>
  );
};
```

## การจัดการสิทธิ์แบบ Advanced

### 1. **การตรวจสอบสิทธิ์หลายอย่าง**

```jsx
const { hasAnyPermission, hasAllPermissions } = usePermissions();

// ตรวจสอบว่ามีสิทธิ์อย่างน้อยหนึ่งอย่าง
if (hasAnyPermission(['canManageProjects', 'canManageProperties'])) {
  // แสดงเมนูที่เกี่ยวข้อง
}

// ตรวจสอบว่ามีสิทธิ์ทั้งหมด
if (hasAllPermissions(['canDelete', 'canManageUsers'])) {
  // แสดงฟีเจอร์พิเศษ
}
```

### 2. **การสร้าง HOC ด้วย withPermission**

```jsx
import { withPermission } from './PermissionGuard';

const AdminOnlyComponent = () => (
  <div>เนื้อหาสำหรับ Admin เท่านั้น</div>
);

// Wrap component ด้วย permission
export default withPermission(AdminOnlyComponent, 'canManageUsers');
```

### 3. **การอัปเดตสิทธิ์เมื่อ login/logout**

```jsx
import { usePermissions } from '../../contexts/PermissionContext';

const LoginForm = () => {
  const { updatePermissions } = usePermissions();

  const handleLogin = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      if (response.success) {
        // บันทึกข้อมูลผู้ใช้
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        
        // อัปเดตสิทธิ์
        updatePermissions(response.user);
        
        // Redirect
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
};
```

## การทดสอบ

### 1. **ทดสอบการแสดงเมนู**

```jsx
// ทดสอบว่า Project Manager เห็นเฉพาะเมนู project
const { userRole } = usePermissions();
if (userRole === 'project_manager') {
  // ตรวจสอบว่าเห็นเฉพาะเมนูที่เกี่ยวข้อง
}
```

### 2. **ทดสอบการแสดงปุ่ม**

```jsx
// ทดสอบว่า Property Manager ไม่เห็นปุ่มลบ
const { canDelete } = usePermissions();
if (userRole === 'property_manager') {
  // ตรวจสอบว่า canDelete เป็น false
}
```

### 3. **ทดสอบการเข้าถึงข้อมูล**

```jsx
// ทดสอบว่า Admin ไม่สามารถเข้าถึงข้อมูล contact
const { canAccessContact } = usePermissions();
if (userRole === 'admin') {
  // ตรวจสอบว่า canAccessContact เป็น false
}
```

## หมายเหตุสำคัญ

1. **Context Provider:** ต้องครอบ App ด้วย PermissionProvider
2. **การตรวจสอบสิทธิ์:** ตรวจสอบทั้งใน frontend และ backend
3. **การอัปเดตสิทธิ์:** อัปเดตสิทธิ์เมื่อ login/logout
4. **Fallback:** กำหนด fallback ที่เหมาะสมสำหรับแต่ละกรณี
5. **Performance:** ใช้ useMemo สำหรับข้อมูลที่คำนวณซับซ้อน

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **PermissionContext not found:** ตรวจสอบการ import และการครอบ Provider
2. **สิทธิ์ไม่ถูกต้อง:** ตรวจสอบการอัปเดตสิทธิ์เมื่อ login
3. **เมนูไม่แสดง:** ตรวจสอบการใช้งาน PermissionGuard
4. **ปุ่มลบยังแสดง:** ตรวจสอบการใช้งาน canDelete

### การ Debug

```jsx
// เพิ่ม logging ใน component
const { userRole, permissions } = usePermissions();
console.log('User role:', userRole);
console.log('Permissions:', permissions);
console.log('Can delete:', permissions.canDelete);
```

## ขั้นตอนถัดไป

1. ✅ สร้างไฟล์ทั้งหมด
2. 🔄 อัปเดต App.jsx ด้วย PermissionProvider
3. 🔄 อัปเดต Sidebar ด้วยการตรวจสอบสิทธิ์
4. 🔄 อัปเดต Form components ด้วย PermissionGuard
5. 🔄 ทดสอบการทำงานของระบบสิทธิ์
6. 🔄 อัปเดต components อื่นๆ ตามต้องการ

