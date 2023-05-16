const mongoose = require('mongoose');

const Order = require('../../models/orders.model');
const User = require('../../models/users.model');
const Product = require('../../models/products.model');
const Cart = require('../../models/carts.model');

async function httpGetOrders(req, res) {
    try {
        const orders = await Order.find({}, { '__v': 0 })
            .populate({ path: 'user', select: '-_id name' })
            .populate({ path: 'carts', select: '-_id name' })
            .sort('+createdAt')

        if (orders.length === 0) return res.status(404).json({ error: 'No Order found' });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetOrderByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid order Id' });
        
        const order = await Order.findById(req.params.id)
            .populate({ path: 'user', select: '-_id name' })
            .populate({ populate: { path: 'product', populate: 'category' } });

        if (!order) return res.status(404)
            .json({ error: `Order not found` });

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetUserOrdersByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid user Id' });
        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userOrders = await Order.find({ user: user._id })
            .populate({ path: 'user', select: '-_id name' })
            .populate({ populate: { path: 'product', populate: 'category' } });

        if (userOrders.length === 0) return res.status(404).json({ error: 'No Order found' });

        res.status(200).json({ userOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetTotalSales(req, res) {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ])
        
        if(!totalSales) return res.status(404).json({ error: 'No Order found' });

        res.status(200).json({ totalSales: totalSales.pop().totalSales });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetOrdersCount(req, res) {
    try {
        const OrdersCount = await Order.countDocuments();

        if (OrdersCount === 0) return res.status(404).json({ error: 'There is not order yet' });

        res.status(200).json({ OrdersCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpPostOrder(req, res) {
    try {
        if (!Array.isArray(req.body.carts)) {
            return res.status(400).json({ error: 'Invalid cart data' });
        }

        const cartItemIds = Promise.all(req.body.carts.map(async (cartItem) => {
            if (cartItem.product) {
                if (!mongoose.isValidObjectId(cartItem.product))
                return res.status(400).send('Invalid user Id');
                
                const product = await Product.findById(cartItem.product);
                if (!product) return res.status(404).json({ error: 'Product not found' });
            }

            if (cartItem.user) {
                if (!mongoose.isValidObjectId(cartItem.user))
                return res.status(400).send('Invalid product Id');
                
                const user = await User.findById(cartItem.user);
                if (!user) return res.status(404).json({ error: 'User not found' });
            }

            let newCreatedCart = await Cart.create(
                {
                    quantity: cartItem.quantity,
                    product: cartItem.product,
                    user: cartItem.user
                }
            )

            return newCreatedCart._id;
        }));

        const cartItemIdsResolved = await cartItemIds;

        const totalPriceCalculated = await Promise.all(cartItemIdsResolved.map(async (cartItemId) => {
            let cartItem = await Cart.findById(cartItemId)
                .populate('product', 'price')

            const totalPrice = cartItem.product.price * cartItem.quantity;
            return totalPrice;
        }));

        const totalPrice = totalPriceCalculated.reduce((a, b) => a + b, 0);

        const newCreatedOrder = await Order.create(
            {
                carts: cartItemIdsResolved,
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                totalPrice: totalPrice,
                user: req.body.user
            }
        )
            console.log('newCreatedOrder:', newCreatedOrder);
        res.status(201).json({ newCreatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateOrder(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid order Id');
        
        const id = await Order.findById(req.params.id);

        if (!id) return res.status(404).json({ error: 'Order not found' });

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )

        const updatedOrder = await order.save();

        res.status(200).json({ updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteOrder(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid user Id');
        
        const orderDetail = await Order.find({ user: req.params.id });
        if (!orderDetail) return res.status(404).json({ error: 'Order not found' });

        const items = orderDetail.carts;
        items.forEach(async item => {
            await Cart.deleteOne({ _id: item })
        });

        const order = await Order.deleteOne({ _id: orderDetail._id });

        if (order.deletedCount === 0) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json({ message: 'Order has been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    httpGetOrders,
    httpGetOrderByID,
    httpGetUserOrdersByID,
    httpGetTotalSales,
    httpGetOrdersCount,
    httpPostOrder,
    httpUpdateOrder,
    httpDeleteOrder
}