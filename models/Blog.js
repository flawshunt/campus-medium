const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,  // e.g., "Technology"
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Draft',
  },
  imageUrl: {
    type: String, // URL of blog image
    default: 'https://picsum.photos/400/250?random=1',
  },
  content: {
    type: String,  // full blog content (HTML or text)
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // assuming you have a User model
  },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
