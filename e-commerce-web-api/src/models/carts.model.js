const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true })

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;