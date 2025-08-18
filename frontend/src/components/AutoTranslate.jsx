import React from 'react';
import { useGoogleTranslate } from '../hooks/useGoogleTranslate';
import { RefreshCw, AlertCircle } from 'lucide-react';

const AutoTranslate = ({ 
  thaiText, 
  targetLang = 'en', 
  className = '',
  showLoading = true,
  showError = true,
  fallbackText = null
}) => {
  const { 
    translatedText, 
    isTranslating, 
    error, 
    retry 
  } = useGoogleTranslate(thaiText, targetLang);

  // ถ้าแปลไม่ได้และมี fallbackText ให้ใช้ fallbackText
  const displayText = error && fallbackText ? fallbackText : translatedText;

  return (
    <span className={className}>
      {isTranslating && showLoading ? (
        <span className="inline-flex items-center gap-1 text-gray-500">
          <RefreshCw className="h-3 w-3 animate-spin" />
          แปล...
        </span>
      ) : error && showError ? (
        <span className="inline-flex items-center gap-1 text-red-500 cursor-pointer" onClick={retry}>
          <AlertCircle className="h-3 w-3" />
          {displayText}
        </span>
      ) : (
        displayText
      )}
    </span>
  );
};

export default AutoTranslate; 