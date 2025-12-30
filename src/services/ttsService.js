// services/ttsService.js
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

// Đường dẫn key và thư mục output (dựa trên project root)
const KEY_FILE = path.join(__dirname, '../../tts-crd.json');
const AUDIO_DIR = path.join(__dirname, '../../public/uploads/audio');

// Đảm bảo thư mục tồn tại trước khi ghi file
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Khởi tạo client
const client = new textToSpeech.TextToSpeechClient({
    keyFilename: KEY_FILE // Trỏ đúng đến file JSON key của bạn
});

/**
 * Hàm tạo audio từ văn bản (trả về buffer)
 * @param {string} text - Từ cần đọc (Ví dụ: "你好")
 * @param {string} langCode - Mã ngôn ngữ (zh-CN, en-US, vi-VN)
 * @returns {Promise<Buffer>} - Trả về buffer chứa audio MP3 data
 */
async function generateAudio(text, langCode = 'zh-CN') {
  try {
    const request = {
      input: { text: text },
      // Chọn giọng đọc (Neural2 hoặc Standard)
      voice: { languageCode: langCode, ssmlGender: 'NEUTRAL' },
      // Cấu hình định dạng file
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    
    // Trả về buffer audio content (để upload tới Cloudinary)
    return response.audioContent;
  } catch (error) {
    console.error('TTS Error:', error);
    throw error; // Throw error để controller xử lý
  }
}

module.exports = { generateAudio, AUDIO_DIR };