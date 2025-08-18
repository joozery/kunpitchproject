const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyDdOeOwdARar2SxGX18txVSUO4IvicYcQw';

export const googleTranslate = async (text, targetLang = 'en') => {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: 'th', // ภาษาไทยเป็นต้นฉบับ
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.translations && data.data.translations.length > 0) {
      return data.data.translations[0].translatedText;
    } else {
      throw new Error('No translation data received');
    }

  } catch (error) {
    console.error('Google Translate API Error:', error);
    // ถ้าแปลไม่ได้ให้แสดงข้อความเดิม
    return text;
  }
};

// แปลหลายข้อความพร้อมกัน (ประหยัด API calls)
export const googleTranslateMultiple = async (texts, targetLang = 'en') => {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          target: targetLang,
          source: 'th',
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.translations) {
      return data.data.translations.map(t => t.translatedText);
    } else {
      throw new Error('No translation data received');
    }

  } catch (error) {
    console.error('Google Translate API Error:', error);
    return texts; // ถ้าแปลไม่ได้ให้แสดงข้อความเดิม
  }
}; 