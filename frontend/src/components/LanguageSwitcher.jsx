import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  // Function to get current language display name
  const getCurrentLanguageName = () => {
    switch (currentLanguage) {
      case 'th':
        return 'ไทย';
      case 'en':
        return 'EN';
      case 'zh':
        return '中文';
      case 'ja':
        return '日本語';
      default:
        return 'EN';
    }
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200" style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {getCurrentLanguageName()}
        </span>
        <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[120px]">
        <button
          onClick={() => handleLanguageChange('th')}
          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg transition-colors duration-200 ${
            currentLanguage === 'th' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
          }`}
        >
          🇹🇭 ไทย
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200 ${
            currentLanguage === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
          }`}
        >
          🇺🇸 English
        </button>
        <button
          onClick={() => handleLanguageChange('zh')}
          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200 ${
            currentLanguage === 'zh' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
          }`}
        >
          🇨🇳 中文
        </button>
        <button
          onClick={() => handleLanguageChange('ja')}
          className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-b-lg transition-colors duration-200 ${
            currentLanguage === 'ja' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
          }`}
        >
          🇯🇵 日本語
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 