const cloudinary = require('cloudinary').v2;
const config = require('../config/config');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

class CloudinaryService {
  static async uploadImage(filePath, publicId) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        folder: 'flashcard',
        resource_type: 'auto'
      });

      return result.secure_url;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  static async uploadAudio(bufferOrFilePath, publicId) {
    try {
      // Support both buffer and file path
      if (Buffer.isBuffer(bufferOrFilePath)) {
        // For buffer upload using stream with timeout
        return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Upload timeout after 60 seconds'));
          }, 60000); // 60 second timeout

          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'raw',
              public_id: publicId,
              folder: 'flashcard/audio',
              timeout: 60000
            },
            (error, result) => {
              clearTimeout(timeoutId);
              if (error) {
                console.error('Cloudinary stream error:', error);
                reject(new Error(`Stream upload failed: ${error.message || JSON.stringify(error)}`));
              } else {
                resolve(result.secure_url);
              }
            }
          );
          
          stream.end(bufferOrFilePath);
        });
      } else {
        // File path upload
        const result = await cloudinary.uploader.upload(bufferOrFilePath, {
          public_id: publicId,
          folder: 'flashcard/audio',
          resource_type: 'auto',
          timeout: 60000
        });
        return result.secure_url;
      }
    } catch (error) {
      console.error('Cloudinary audio upload error:', error);
      throw new Error(`Cloudinary audio upload failed: ${error.message}`);
    }
  }

  static async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(`flashcard/${publicId}`);
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }

  static async deleteAudio(publicId) {
    try {
      await cloudinary.uploader.destroy(`flashcard/audio/${publicId}`, { resource_type: 'raw' });
    } catch (error) {
      throw new Error(`Cloudinary audio delete failed: ${error.message}`);
    }
  }
}

module.exports = CloudinaryService;
