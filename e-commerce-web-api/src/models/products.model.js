const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the product name'],
        maxlength: [50, 'Name must be at most 50 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please enter the description'],
        maxlength: [200, 'Description must be at most 200 characters'],
    },
    image: {
        type: String,
        required: [true, 'Please upload an image for your product']
    },
    images: [{ type: String }],
    brand: {
        type: String,
        default: '',
        maxlength: [20, 'Brand must be at most 20 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter the price of your product']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please enter the product category'],
    },
    countInStock: {
        type: Number,
        default: 1,
        min: 0,
        max: 255
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;