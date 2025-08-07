const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      // Password is only required if authProvider is 'manual'
      return this.authProvider === 'manual';
    },
  },
  description:{
    type:String,
    default:null,
  },
  googleId: {
    type: String,
    default: null,
  },
  otp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: null,
  },
  authProvider: {
    type: String,
    enum: ['manual', 'google'],
    default: 'manual',
  },
});

module.exports = mongoose.model('Users', userSchema);
