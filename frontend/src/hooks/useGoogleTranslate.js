import { useState, useEffect } from 'react';
import { googleTranslate } from '../services/googleTranslateService';

export const useGoogleTranslate = (thaiText, targetLang = 'en') => {
  const [translatedText, setTranslatedText] = useState(thaiText);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const translate = async () => {
      // ถ้าเป็นภาษาไทยให้แสดงข้อความเดิม
      if (targetLang === 'th') {
        setTranslatedText(thaiText);
        return;
      }

      // ถ้าไม่มีข้อความให้แปล
      if (!thaiText || thaiText.trim() === '') {
        setTranslatedText('');
        return;
      }

      setIsTranslating(true);
      setError(null);

      try {
        const result = await googleTranslate(thaiText, targetLang);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation failed:', error);
        setError(error.message);
        setTranslatedText(thaiText); // แสดงข้อความเดิมถ้าแปลไม่ได้
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [thaiText, targetLang]);

  const retry = () => {
    // ฟังก์ชันลองแปลใหม่
    if (targetLang !== 'th' && thaiText) {
      translate();
    }
  };

  return { 
    translatedText, 
    isTranslating, 
    error,
    retry
  };
}; 