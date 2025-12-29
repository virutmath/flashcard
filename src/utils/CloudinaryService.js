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

  static async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(`flashcard/${publicId}`);
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }
}

module.exports = CloudinaryService;
