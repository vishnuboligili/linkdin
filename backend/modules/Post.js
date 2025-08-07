// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  name: String,
  email: String,
  content: String,
  date: {
    type: Date,
    default: Date.now,
  },
  image: String, // ✅ add this
});

module.exports = mongoose.model('Post', PostSchema);
