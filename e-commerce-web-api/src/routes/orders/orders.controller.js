const Order = require('../../models/orders.model');
const OrderItem = require('../../models/order_items.model');

async function httpGetOrders(req, res) {
    try {
        const orders = await Order.find({}, { '__v': 0 })
            .populate('user', 'name')
            .sort({ 'orderItemIds': -1 });

        if (orders.length === 0) return res.status(404).json({ error: 'No Order found' });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetOrderByID(req, res) {
    try {
        const id = req.params.id
        const order = await Order.findById(id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' }
            });

        if (!order) return res.status(404)
            .json({ error: `Order with ID ${id} not found` });

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetUserOrdersByID(req, res) {
    try {
        const userOrders = await Order.find({ user: req.params.id }, { '__v': 0 })
            .populate({
                path: 'orderItems',
                populate: { path: 'product', populate: 'category' }
            })
            .sort({ 'orderItemIds': -1 })

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
        const orderItemIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = await OrderItem.create(
                {
                    quantity: orderItem.quantity,
                    product: orderItem.product
                }
            )

            return newOrderItem._id;
        })); 

        const orderItemIdsResolved = await orderItemIds;

        const totalPriceCalculated = Promise.all(orderItemIdsResolved.map(async (orderItemId) => {
            let orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')

            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice.reduce((a, b) => a + b, 0);
        }));

        const newCreatedOrder = await Order.create(
            {
                orderItems: orderItemIdsResolved,
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                status: req.body.status,
                totalPrice: totalPriceCalculated,
                user: req.body.user
            }
        )

        res.status(201).json({ newCreatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateOrder(req, res) {
    try {
        const id = await Order.findById(req.params.id);

        if (!id) return res.status(404).json({ error: 'Order not found' });

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderItems: req.body.orderItems,
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                status: req.body.status,
                totalPrice: req.body.totalPrice,
                user: req.body.user
            },
            { new: true }
        )

        const updatedOrder = await order.save();

        res.status(200).json({ updatedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateOrderStatus(req, res) {
    try {
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
        const orderDetail = await Order.findById(req.params.id);
        if (!orderDetail) return res.status(404).json({ error: 'Order not found' });

        const items = orderDetail.orderItems;
        items.forEach(async item => {
            await OrderItem.deleteOne({ _id: item })
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
    httpUpdateOrderStatus,
    httpDeleteOrder
}