const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
app.use(express.urlencoded({ extended: true }));
const { isLoggedIn } = require('./middlewares/auth');
const blogRoutes = require('./routes/blog'); // path to your routes file
const Blog = require('./models/Blog'); // or correct path
require('dotenv').config();
const isAuthor = require('./middlewares/isAuthor'); // or correct path
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or your multer config
const flash = require('connect-flash');

// Access template
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Access static files like (css, js, assets)
app.use(express.static(path.join(__dirname, "/public")));

// ejs-mate For layououts
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB;

const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(dbUrl);

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: dbUrl }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

const authRoutes = require('./routes/auth');
app.use(authRoutes);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use(blogRoutes);


// Setup flash middleware
app.use(flash());

// Make flash messages available in all views (optional)
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});


// Routes
app.get("/home", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("author");
    res.render('pages/home', { blogs, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route to handle category filtering
app.get("/category/:name", async (req, res) => {
  try {
    const categoryName = req.params.name;
    const blogs = await Blog.find({ category: categoryName }).populate("author");

    res.render("pages/category-blogs", {
      blogs,
      categoryName,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


app.get("/register", (req, res) => {
    res.render("pages/register")
});

app.get("/login", (req, res) => {
    res.render("pages/login")
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('pages/home');
  });
});

app.get('/dashboard', isLoggedIn, async (req, res) => {
  try {
    // Fetch blogs authored by the logged-in user
    const blogs = await Blog.find({ author: req.session.user._id }).sort({ publishDate: -1 });

    res.render('pages/dashboard', { user: req.session.user, blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});


// Blog Create
app.get("/blog/create", (req, res) => {
    res.render('pages/create-blog', { oldData: {} });
});


// Blog View
app.get('/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author');
  console.log()
  res.render('pages/view-blog', { blog });
});


// Blog Edit
app.get('/blogs/:id/edit', isAuthor, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.redirect('/home'); // or 404 page
    }
    res.render('pages/edit', { blog });
  } catch (error) {
    console.error(error);
    res.redirect('/home');
  }
});


app.put('/blogs/:id', isAuthor, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.redirect('/home');
    }

    blog.title = title;
    blog.category = category;
    blog.content = content;

    // If new image uploaded, update imageUrl
    if (req.file) {
      blog.imageUrl = req.file.path; // multer-cloudinary stores URL in path
    }

    await blog.save();
    res.redirect(`/blogs/${blog._id}`);
  } catch (error) {
    console.error(error);
    res.render('pages/edit', { blog: req.body, error: error.message });
  }
});

// Blog Delete
app.delete('/blogs/:id', isAuthor, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      req.flash('error', 'Blog not found or already deleted.');
      return res.redirect('/dashboard');
    }

    req.flash('success', 'Blog deleted successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error during deletion.');
    res.redirect('/dashboard');
  }
});


app.get("/explore", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("author") // ✅ This line is key
      .lean(); // Optional: speeds up EJS rendering
    res.render("pages/explore", { blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load blogs");
  }
});



app.get("/about", (req, res) => {
  res.render("pages/about.ejs");
})


app.listen(8080, () => {
  console.log("Server is listening");
});