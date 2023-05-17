const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: '',
    maxlength: [20, 'First name must be at most 20 characters'],
  },
  surname: {
    type: String,
    default: '',
    maxlength: [20, 'Surname must be at most 20 characters'],
  },
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    maxlength: [20, 'username must be at most 20 characters'],
    unique: [true, 'username already exists'],
    lowercase: true,
    trim: true,
    set: value => {
      if (value) return value.replace(/\s/g, '');
      return value;
    },
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
  profilePicture: {
    type: String,
    default: "",
  }
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