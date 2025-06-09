const Blog = require('../models/Blog');

async function isAuthor(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    if (blog.author.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Forbidden: You are not the author');
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

module.exports = isAuthor;
