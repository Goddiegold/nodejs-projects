const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
    maxlength: [50, 'Name must be at most 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter a email address'],
    unique: [true, 'email address already exists'],
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    trim: true,
    minlength: [6, 'Please enter at least 6 characters'],
  },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.error(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;