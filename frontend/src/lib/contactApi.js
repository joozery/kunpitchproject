const PRIMARY_BASE_URL = 'https://kunpitch-backend-new-b63bd38838f8.herokuapp.com/api';
const ENV_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = ENV_BASE_URL || PRIMARY_BASE_URL;

// Try fetch with primary base URL first; on failure (CORS/network), retry with env base URL
const safeFetch = async (path, options = {}) => {
  const url1 = `${PRIMARY_BASE_URL}${path}`;
  const url2 = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(url1, options);
    return res;
  } catch (err) {
    try {
      const res2 = await fetch(url2, options);
      return res2;
    } catch (err2) {
      throw err2;
    }
  }
};

// ตรวจสอบสถานะการเชื่อมต่อ API
export const checkApiConnection = async () => {
  try {
    // ใช้ health endpoint หรือ contact-settings endpoint
    const response = await safeFetch(`/contact-settings`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000) // timeout 5 วินาทีสำหรับ Heroku
    });
    return response.ok;
  } catch (error) {
    console.log('API connection failed, using localStorage fallback');
    return false;
  }
};

// API service สำหรับการจัดการข้อมูลการติดต่อ
export const contactApi = {
  // ดึงข้อมูลการติดต่อ
  async getContactSettings() {
    try {
      const response = await safeFetch(`/contact-settings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      
      // Fallback to localStorage if API is not available
      console.log('Falling back to localStorage...');
      const savedContactInfo = localStorage.getItem('contactSettings');
      if (savedContactInfo) {
        try {
          return JSON.parse(savedContactInfo);
        } catch (err) {
          console.error('Error parsing localStorage data:', err);
        }
      }
      
      // Return empty data if no fallback available
      return {
        phone: '',
        line: '',
        messenger: '',
        whatsapp: '',
        facebook: '',
        instagram: ''
      };
    }
  },

  // บันทึกข้อมูลการติดต่อใหม่
  async createContactSettings(contactData) {
    try {
      const response = await safeFetch(`/contact-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating contact settings:', error);
      
      // Fallback to localStorage if API is not available
      console.log('Falling back to localStorage...');
      try {
        localStorage.setItem('contactSettings', JSON.stringify(contactData));
        return {
          message: 'บันทึกข้อมูลการติดต่อเรียบร้อยแล้ว (localStorage)',
          id: 'local',
          data: contactData
        };
      } catch (localStorageError) {
        console.error('Error saving to localStorage:', localStorageError);
        throw new Error('ไม่สามารถบันทึกข้อมูลได้');
      }
    }
  },

  // อัปเดตข้อมูลการติดต่อ
  async updateContactSettings(id, contactData) {
    try {
      const response = await safeFetch(`/contact-settings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating contact settings:', error);
      
      // Fallback to localStorage if API is not available
      console.log('Falling back to localStorage...');
      try {
        localStorage.setItem('contactSettings', JSON.stringify(contactData));
        return {
          message: 'อัปเดตข้อมูลการติดต่อเรียบร้อยแล้ว (localStorage)',
          id: id,
          data: contactData
        };
      } catch (localStorageError) {
        console.error('Error updating localStorage:', localStorageError);
        throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
      }
    }
  },

  // ลบข้อมูลการติดต่อ
  async deleteContactSettings(id) {
    try {
      const response = await safeFetch(`/contact-settings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting contact settings:', error);
      throw error;
    }
  },

  // ดึงข้อมูลการติดต่อทั้งหมด (สำหรับ admin)
  async getAllContactSettings() {
    try {
      const response = await safeFetch(`/contact-settings/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all contact settings:', error);
      throw error;
    }
  },

  // บันทึกหรืออัปเดตข้อมูลการติดต่อ (smart save)
  async saveContactSettings(contactData) {
    try {
      // ดึงข้อมูลปัจจุบัน
      const currentSettings = await this.getContactSettings();
      
      // ถ้ามีข้อมูลอยู่แล้ว ให้อัปเดต
      if (currentSettings.id) {
        return await this.updateContactSettings(currentSettings.id, contactData);
      } else {
        // ถ้าไม่มีข้อมูล ให้สร้างใหม่
        return await this.createContactSettings(contactData);
      }
    } catch (error) {
      console.error('Error saving contact settings:', error);
      
      // Fallback to localStorage if API is not available
      console.log('Falling back to localStorage...');
      try {
        localStorage.setItem('contactSettings', JSON.stringify(contactData));
        return {
          message: 'บันทึกข้อมูลการติดต่อเรียบร้อยแล้ว (localStorage)',
          data: contactData
        };
      } catch (localStorageError) {
        console.error('Error saving to localStorage:', localStorageError);
        throw new Error('ไม่สามารถบันทึกข้อมูลได้');
      }
    }
  }
};

// Helper functions
export const formatContactData = (data) => {
  return {
    phone: data.phone || '',
    line: data.line_id || data.line || '',
    messenger: data.messenger_url || data.messenger || '',
    whatsapp: data.whatsapp || '',
    facebook: data.facebook_url || data.facebook || '',
    instagram: data.instagram_url || data.instagram || ''
  };
};

export const validateContactData = (data) => {
  const errors = [];
  
  if (!data.phone && !data.line && !data.messenger && !data.whatsapp && !data.facebook && !data.instagram) {
    errors.push('กรุณากรอกข้อมูลการติดต่ออย่างน้อย 1 รายการ');
  }

  // ตรวจสอบเบอร์โทร
  if (data.phone && !/^[\d\-\+\s\(\)]+$/.test(data.phone)) {
    errors.push('เบอร์โทรศัพท์ไม่ถูกต้อง');
  }

  // ตรวจสอบ WhatsApp
  if (data.whatsapp && !/^[\d\-\+\s\(\)]+$/.test(data.whatsapp)) {
    errors.push('เบอร์ WhatsApp ไม่ถูกต้อง');
  }

  // ตรวจสอบ URL
  if (data.messenger && !isValidUrl(data.messenger)) {
    errors.push('ลิงก์ Facebook Messenger ไม่ถูกต้อง');
  }

  if (data.facebook && !isValidUrl(data.facebook)) {
    errors.push('ลิงก์ Facebook ไม่ถูกต้อง');
  }

  if (data.instagram && !isValidUrl(data.instagram)) {
    errors.push('ลิงก์ Instagram ไม่ถูกต้อง');
  }

  return errors;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}; 