const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title'],
        maxlength: [150, 'Name must be at most 150 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please enter your content'],
    },
    image: {
        type: String,
        required: [true, 'Please enter an image for post'],
    },
    category: {
        type: String,
        required: [true, 'Please enter a category for post'],
        lowercase: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;