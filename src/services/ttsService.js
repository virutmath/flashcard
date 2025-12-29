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
 * Hàm tạo audio từ văn bản
 * @param {string} text - Từ cần đọc (Ví dụ: "你好")
 * @param {string} filename - Tên file muốn lưu (Ví dụ: "nihao_uuid")
 * @param {string} langCode - Mã ngôn ngữ (zh-CN, en-US, vi-VN)
 * @returns {Promise<string>} - Trả về đường dẫn file tương đối để lưu vào DB
 */
async function generateAudio(text, filename, langCode = 'zh-CN') {
  try {
    const request = {
      input: { text: text },
      // Chọn giọng đọc (Neural2 hoặc Standard)
      voice: { languageCode: langCode, ssmlGender: 'NEUTRAL' },
      // Cấu hình định dạng file
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    
    // Tạo đường dẫn file vật lý
    const finalFileName = `${filename}.mp3`;
    const savePath = path.join(AUDIO_DIR, finalFileName);
    
    // Ghi file (binary) vào ổ cứng
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(savePath, response.audioContent, 'binary');
    
    console.log(`Audio content written to file: ${savePath}`);
    
    // Trả về đường dẫn public (để frontend truy cập)
    // Ví dụ: /uploads/audio/uuid.mp3
    return `/uploads/audio/${finalFileName}`;
  } catch (error) {
    console.error('TTS Error:', error);
    return null; // Trả về null nếu lỗi để không chết app
  }
}

module.exports = { generateAudio, AUDIO_DIR };