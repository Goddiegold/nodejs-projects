const express = require('express');
const productsRouter = express.Router();

const {
    httpGetProducts,
    httpGetProductByID,
    httpGetProductsCount,
    httpGetFetaturedProducts,
    httpPostProduct,
    httpUpdateProduct,
    httpDeleteProduct
} = require('./categories.controller')

productsRouter.get('/', httpGetProducts);
productsRouter.get('/:id', httpGetProductByID);
productsRouter.get('/count', httpGetProductsCount);
productsRouter.get('/featured:count', httpGetFetaturedProducts);
productsRouter.post('/', httpPostProduct);
productsRouter.patch('/:id', httpUpdateProduct);
productsRouter.delete('/:id', httpDeleteProduct);

module.exports = productsRouter;