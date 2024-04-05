// src/utils/translateUtils.js

const translateText = async (text, targetLang) => {
    const apiKey = 'AIzaSyDJI8vViZS9_NFJ7yZkl6OsvJ__XGcQ69g'; // Be sure to replace this with your actual API key
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
        }),
      });
  
      const jsonResponse = await response.json();
      return jsonResponse.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return '';
    }
  };
  
  export { translateText };
  