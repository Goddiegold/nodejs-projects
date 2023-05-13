const express = require('express');
const productsRouter = express.Router();
const { authenticateToken } = require('../authenticate/auth.controller');

const {
    httpGetProducts,
    httpGetProductByID,
    httpGetProductsCount,
    httpGetFetaturedProducts,
    httpPostProduct,
    httpUpdateProduct,
    httpDeleteProduct
} = require('./products.controller')

productsRouter.get('/', httpGetProducts);
productsRouter.get('/:id', httpGetProductByID);
productsRouter.get('/get/count', httpGetProductsCount);
productsRouter.get('/get/featured/:count', httpGetFetaturedProducts);
productsRouter.post('/', authenticateToken, httpPostProduct);
productsRouter.put('/:id', authenticateToken, httpUpdateProduct);
productsRouter.delete('/:id', authenticateToken, httpDeleteProduct);

module.exports = productsRouter;