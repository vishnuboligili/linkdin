
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemail');
const Users = require('../modules/User');
const generateOTP = require('../utils/otp');
const fetchUser = require('../middleware/fetchUser');
const requireRegisterSession = require('../middleware/requireRegisterSession');
const Post = require('../modules/Post'); // assuming your model is in modules/Post.js
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

//google login
router.post('/google-login', async (req, res) => {
    try {
      const { name, email, googleId, picture } = req.body;
      console.log(name);
  
      if (!email || !googleId) {
        return res.status(400).json({ success: false, message: "Missing credentials" });
      }
  
      let user = await Users.findOne({ email });
  
      if (!user) {
        // New Google user
        user = new Users({
          name,
          email,
          googleId,
          image: picture || null,
          isVerified: true,
          authProvider: 'google',
        });
        await user.save();
      } else {
        if (!user.googleId) {
          user.googleId = googleId;
          user.authProvider = 'google';
          await user.save();
        }
      }
      console.log(user.image)
      // Generate JWT
      const token = jwt.sign({
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image || null,
        }
      }, JWT_SECRET, { expiresIn: '7d' });
  
      res.status(200).json({ success: true, token });
  
    } catch (error) {
      console.error('Google login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Prevent Google users from logging in with password
      if (user.authProvider === 'google' && user.password.length==0) {
        return res.status(403).json({ success: false, message: 'Please use Google login' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
  
      if (!user.isVerified) {
        return res.status(403).json({ success: false, message: 'Email not verified' });
      }
  
      const token = jwt.sign({
        user: {
          id: user._id.toString(),
          name: user.name,
          image: user.image || null,
          email: user.email,
        }
      }, JWT_SECRET, { expiresIn: '1h' });
  
      return res.status(200).json({ success: true, token });
  
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });


// REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password} = req.body;
    try {
      let existingUser = await Users.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser.authProvider === 'google') {
        await Users.findOneAndDelete({ email: email.toLowerCase() });
        existingUser = await Users.findOne({ email: email.toLowerCase() });
      }
      if (existingUser && existingUser.isVerified)
        return res.status(400).json({ success: false, message: 'Email already exists' });

      
      
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      if (existingUser) await Users.findOneAndDelete({ email: email.toLowerCase() });
  
      const lastUser = await Users.findOne().sort({ id: -1 });
      const nextId = lastUser ? lastUser.id + 1 : 1;
      console.log(otp);
      const newUser = new Users({
        id: nextId,
        name: username,
        email: email.toLowerCase(),
        password: hashedPassword,
        otp,
        authProvider: 'manual',
      });
      
      await newUser.save();
  
      req.session.userEmail = email.toLowerCase();
  
      await transporter.sendMail({
        from: "boligilivishnuvardhan@gmail.com",
        to: email,
        subject: "Email Verification",
        html: `<p>Verification Code: ${otp}</p>`
      });
  
      res.status(201).json({ success: true, message: "OTP generated successfully" });
    } catch (err) {
      console.error('Register Error:', err.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  router.get('/otp', requireRegisterSession, (req, res) => {
    res.status(200).json({ success: true, email: req.session.userEmail });
  });

  router.post('/otp', requireRegisterSession, async (req, res) => {
    const { otp } = req.body;
    try {
      const email = req.session.userEmail;
      const user = await Users.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
      if (String(user.otp) !== String(otp)) {
        return res.status(401).json({ success: false, message: 'Invalid OTP' });
      }
  
      await Users.findOneAndUpdate({ email: email.toLowerCase() }, { isVerified: true });
      delete req.session.userEmail;
  
      res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (err) {
      console.error('OTP Validation Error:', err.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  

  // FORGOT PASSWORD FLOW
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await Users.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
      const otp = generateOTP();
      req.session.userEmail = email.toLowerCase();
      console.log(req.session.userEmail);
      await Users.findOneAndUpdate({ email: email.toLowerCase() }, { otp });
  
      await transporter.sendMail({
        from: "boligilivishnuvardhan@gmail.com",
        to: email,
        subject: "Password Reset OTP",
        html: `<p>Verification Code: ${otp}</p>`
      });
  
      res.status(201).json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
      console.error('Forgot Password Error:', err.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  router.post('/forgot-otp', requireRegisterSession, async (req, res) => {
    const { otp } = req.body;
    try {
      const email = req.session.userEmail;
      const user = await Users.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
      if (String(user.otp) !== String(otp))
        return res.status(401).json({ success: false, message: 'Invalid OTP' });
  
      res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (err) {
      console.error('Forgot OTP Error:', err.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  router.post('/password', requireRegisterSession, async (req, res) => {
    const { password } = req.body;
    try {
      const email = req.session.userEmail;
      const hashedPassword = await bcrypt.hash(password, 10);
      await Users.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashedPassword });
      delete req.session.userEmail;
  
      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
      console.error('Password Update Error:', err.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
// PROFILE
router.post('/profile', fetchUser, async (req, res) => {
    const user = await Users.findOne({ _id: req.user.id });
    res.status(200).json({ success: true, user });
  });
  
  router.post('/edit', fetchUser, async (req, res) => {
    const { name, image, description} = req.body;
    try {
      await Users.findOneAndUpdate({ _id: req.user.id }, { name, image ,description});
      await Post.fin
      const user=await Users.findOne({ _id: req.user.id });
      await Post.updateMany(
        { email: user.email },
        { $set: { name: user.name, image: user.image } }
      );
  
      const token = jwt.sign({
        user: {
          id: user._id.toString(),
          name: user.name,
          image: user.image,
          email:user.email,
        }
      }, JWT_SECRET, { expiresIn: '1h' });
      // console.log(token);
      res.status(200).json({ success: true, message: "User data updated successfully" ,token});
    } catch (err) {
      console.error('Edit Error:', err.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // Get all users (for search)
router.get('/all', async (req, res) => {
  try {
    const users = await Users.find({}, 'name image email'); // only necessary fields
    res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

    

  module.exports = router;