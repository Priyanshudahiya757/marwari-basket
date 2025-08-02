const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary (optional for development)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
} else {
  console.log('⚠️  Cloudinary not configured. File uploads will be stored locally.');
}

exports.uploadToCloudinary = async (filePath) => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // Return local file path for development
      return {
        secure_url: `/uploads/${filePath.split('/').pop()}`,
        public_id: filePath.split('/').pop()
      };
    }
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'marwari-basket',
      resource_type: 'auto'
    });
    
    // Clean up local file
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('File upload failed');
  }
};

exports.deleteFromCloudinary = async (publicId) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.log('⚠️  Cloudinary not configured. Skipping file deletion.');
      return;
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
}; 