const dotenv = require('dotenv');
dotenv.config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

module.exports = {
  cloudinary,
  storage,
};
