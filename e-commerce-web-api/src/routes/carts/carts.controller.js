const mongoose = require('mongoose');

const Cart = require('../../models/carts.model');
const User = require('../../models/users.model');
const Product = require('../../models/products.model');

async function httpGetCarts(req, res) {
    try {
        const cart = await Cart.find({})
            .populate({ path: 'user', select: '-_id name' })
            .populate({ path: 'product', select: '-_id name' })
            .sort('+createdAt')

        if (cart.length === 0) return res.status(404).json({ message: 'No cart found' });

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetCartByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid Cart Id' });

        const cart = await Cart.findById(req.params.id)
            .populate({ path: 'user', select: '-_id name' })
            .populate({ path: 'product', select: '-_id name' })
            .select('-_id');

        if (!cart) return res.status(404)
            .json({ message: `Cart not found` });

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetUserCartByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid Cart Id' });
        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const cart = await Cart.find({ user: user._id })
            .populate({ path: 'user', select: '-_id name' })
            .populate({ path: 'product', select: '-_id name' })
            .select('-__v');

        if (!cart) return res.status(404)
            .json({ message: `Cart not found` });

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpPostCart(req, res) {
    try {
        if (req.body.user) {
            const user = await User.findById(req.body.user);

            if (!mongoose.isValidObjectId(user._id))
                return res.status(400).send('Invalid user Id');
            
            if (!user) return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.product) {
            const product = await Product.findById(req.body.product);

            if (!mongoose.isValidObjectId(product._id))
                return res.status(400).send('Invalid product Id');
            
            if (!product) return res.status(404).json({ error: 'Product not found' });
        }
        
        const newCreatedCategory = await Cart.create(
            {
                user: req.body.user,
                quantity: req.body.quantity,
                product: req.body.product
            }
        )
        const { _id, user, quantity, product } = newCreatedCategory;
        res.status(201).json({ _id, user, quantity, product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateCart(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid Category Id' });
        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.product) {
            const product = await Product.findById(req.body.product);

            if (!mongoose.isValidObjectId(product._id))
                return res.status(400).send('Invalid product Id');
            
            if (!product) return res.status(404).json({ error: 'Product not found' });
        }
             
        const cartDetail = await Cart.findById({ user: user._id });
        if (!cartDetail) return res.status(404).json({ message: 'Cart not found' });

        const cart = await Cart.findByIdAndUpdate(
            cartDetail._id,
            {
                user: req.body.user,
                quantity: req.body.quantity,
                product: req.body.product
            },
            { new: true }
        )

        const updatedCart = await cart.save();

        res.status(200).json({ updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteCart(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid Cart Id' });
        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const cartDetail = await Cart.findById({ user: user._id });
        
        const cart = await Cart.deleteOne({ _id: cartDetail._id });

        if (cart.deletedCount === 0) return res.status(404).json({ message: 'Cart not found' });

        res.status(200).json({ message: 'Cart has been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    httpGetCarts,
    httpGetCartByID,
    httpGetUserCartByID,
    httpPostCart,
    httpUpdateCart,
    httpDeleteCart
}