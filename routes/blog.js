const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { isLoggedIn } = require('../middlewares/auth');
const { cloudinary } = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const upload = multer({ storage });

router.post('/blog/create', isLoggedIn, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const imageUrl = req.file ? req.file.path : 'https://picsum.photos/400/250?random=1';

    const newBlog = new Blog({
      title,
      category,
      content,
      imageUrl,
      author: req.session.user._id,
      publishDate: new Date(),
    });

    await newBlog.save();
    res.redirect('/home');
  } catch (error) {
    console.error('Blog creation failed:', error);
    res.render('pages/create-blog', { oldData: req.body, error: error.message });
  }
});

module.exports = router;
