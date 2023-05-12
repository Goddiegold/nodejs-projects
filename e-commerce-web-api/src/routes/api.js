const express = require('express');
const api = express.Router();

const categoriesRouter = require('./categories/categories.router');
const ordersRouter = require('./orders/orders.router');
const productsRouter = require('./products/products.router');
const usersRouter = require('./users/users.router');

api.use('/categories', categoriesRouter);
api.use('/orders', ordersRouter);
api.use('/products', productsRouter);
api.use('/users', usersRouter);

module.exports = api;