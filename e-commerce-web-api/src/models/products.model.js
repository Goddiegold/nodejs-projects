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
    richDescription: {
        type: String,
        default: '',
        maxlength: [200, 'Rich description must be at most 200 characters'],
    },
    image: {
        type: String,
        default: ''
    },
    images: [{ type: String }],
    brand: {
        type: String,
        default: '',
        maxlength: [20, 'Brand must be at most 20 characters']
    },
    price : {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please enter the product category'],
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productSchema.set('toJSON', {
    virtuals: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;