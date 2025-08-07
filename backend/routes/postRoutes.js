const Post = require('../modules/Post'); // assuming your model is in modules/Post.js
const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();
const User = require('../modules/User'); // make sure this is your User model

// @route   POST /posts/add
// @desc    Add a new post
// @access  Protected
router.post('/add', fetchUser, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Post content is required' });
    }

    const userId = req.user.id;

    // Fetch name and email from User model
    const user=await User.findOne({ _id: userId});
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create new post
    const newPost = new Post({
      name: user.name,
      email: user.email,
      image:user.image,
      content,
    });

    await newPost.save();

    res.status(201).json({ success: true, message: 'Post added successfully', post: newPost });
  } catch (error) {
    console.error('Error in /posts/add:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//get a specific user posts
router.get('/user/:name', async (req, res) => {
    const username = req.params.name;
    console.log(username);
    try {
      // Get user info first (name, image)
      const user = await User.findOne({ email: username });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Get all posts by user name
      const posts = await Post.find({ email: username }).sort({ date: -1 });
  
     
    console.log(user);

      res.json({ success: true, posts: posts ,user:user});
    } catch (err) {
      console.error('Error fetching posts by user:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

// all posts
router.get('/all', async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
    console.log(posts);
      res.json({ success: true, posts });
    } catch (error) {
      console.error('Error fetching all posts:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  

module.exports = router;
