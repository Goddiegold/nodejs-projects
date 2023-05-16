const cartsRouter = require('express').Router();
// const { authenticateToken } = require('../authenticate/auth.controller');

const {
    httpGetCarts,
    httpGetCartByID,
    httpGetUserCartByID,
    httpPostCart,
    httpUpdateCart,
    httpDeleteCart
} = require('./carts.controller')

cartsRouter.get('/', httpGetCarts);
cartsRouter.get('/:id', httpGetCartByID);
cartsRouter.get('/user/:id', httpGetUserCartByID);
cartsRouter.post('/', httpPostCart);
cartsRouter.put('/:id', httpUpdateCart);
cartsRouter.delete('/:id', httpDeleteCart);

module.exports = cartsRouter;