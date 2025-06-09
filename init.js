const mongoose = require('mongoose');
const Blog = require('./models/Blog'); // Adjust path if needed

mongoose.connect('mongodb://127.0.0.1:27017/campus-medium', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB connected");
}).catch(err => {
  console.error("DB connection error:", err);
});

// Replace with your real user ID from MongoDB
const authorId = '665f0aa03e674adfe25492e1'; // Replace with your own ObjectId from Users collection

const fakeBlogs = [
  {
    title: "The Rise of Quantum Computing",
    category: "Technology",
    status: "Published",
    imageUrl: "https://picsum.photos/400/250?random=10",
    contentPreview: "Discover how quantum computers will revolutionize problem-solving.",
    author: authorId,
  },
  {
    title: "Top 10 CSS Tricks for Modern Web Design",
    category: "Design",
    status: "Draft",
    imageUrl: "https://picsum.photos/400/250?random=20",
    contentPreview: "Elevate your front-end design with these powerful CSS tricks.",
    author: authorId,
  },
  {
    title: "AI and the Future of Education",
    category: "Education",
    status: "Published",
    imageUrl: "https://picsum.photos/400/250?random=30",
    contentPreview: "How artificial intelligence is reshaping learning experiences.",
    author: authorId,
  }
];

async function seedDB() {
  try {
    await Blog.deleteMany({ author: authorId }); // Optional: clear old data
    const result = await Blog.insertMany(fakeBlogs);
    console.log(`${result.length} fake blogs inserted.`);
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
