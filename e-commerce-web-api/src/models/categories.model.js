const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the category name'],
    },
    icon: {
        type: String,
        default: '',
    },
    color: {
        type: String,
        default: '',
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;