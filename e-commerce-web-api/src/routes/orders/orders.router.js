const express = require('express');
const ordersRouter = express.Router();

ordersRouter.get('/', (req, res) => {
    res.status(200).json({
        id: 1,
        name: 'orders'
    })
})

module.exports = ordersRouter;