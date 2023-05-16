const ordersRouter = require('express').Router();
//const { authenticateToken } = require('../authenticate/auth.controller');

const {
    httpGetOrders,
    httpGetOrderByID,
    httpGetUserOrdersByID,
    httpGetTotalSales,
    httpGetOrdersCount,
    httpPostOrder,
    httpUpdateOrder,
    httpDeleteOrder
} = require('./orders.controller')

ordersRouter.get('/', httpGetOrders);
ordersRouter.get('/:id', httpGetOrderByID);
ordersRouter.get('/get/orders/:id', httpGetUserOrdersByID);
ordersRouter.get('/get/sales', httpGetTotalSales);
ordersRouter.get('/get/count', httpGetOrdersCount);
ordersRouter.post('/', httpPostOrder);
ordersRouter.put('/:id', httpUpdateOrder);
ordersRouter.delete('/:id', httpDeleteOrder);

module.exports = ordersRouter;