const api = require('express').Router();

const authRouter = require('./authenticate/auth.router');
const cartsRouter = require('./carts/carts.router');
const categoriesRouter = require('./categories/categories.router');
const ordersRouter = require('./orders/orders.router');
const productsRouter = require('./products/products.router');
const usersRouter = require('./users/users.router');

api.use('/auth', authRouter);
api.use('/carts', cartsRouter);
api.use('/categories', categoriesRouter);
api.use('/orders', ordersRouter);
api.use('/products', productsRouter);
api.use('/users', usersRouter);

module.exports = api;