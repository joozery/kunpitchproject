import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // ตรวจสอบภาษาจาก browser
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0];
    
    // ตรวจสอบภาษาที่เลือกไว้ใน localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else if (shortLang === 'th') {
      setCurrentLanguage('th');
    } else if (shortLang === 'zh') {
      setCurrentLanguage('zh');
    } else if (shortLang === 'ja') {
      setCurrentLanguage('ja');
    } else {
      setCurrentLanguage('en');
    }
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage,
      isThai: currentLanguage === 'th',
      isEnglish: currentLanguage === 'en',
      isChinese: currentLanguage === 'zh',
      isJapanese: currentLanguage === 'ja'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}; 