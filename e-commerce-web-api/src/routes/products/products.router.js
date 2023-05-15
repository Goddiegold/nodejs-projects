const express = require('express');
const productsRouter = express.Router();
// const { authenticateTokenAdmin } = require('../authenticate/auth.controller');

const {
    httpGetProducts,
    httpGetProductByID,
    httpGetProductsCount,
    httpGetFetaturedProducts,
    httpPostProduct,
    httpUpdateProduct,
    httpUpdateProductImages,
    httpDeleteProduct,
    uploadOptions
} = require('./products.controller')

productsRouter.get('/', httpGetProducts);
productsRouter.get('/:id', httpGetProductByID);
productsRouter.get('/get/count', httpGetProductsCount);
productsRouter.get('/get/featured/:count', httpGetFetaturedProducts);
productsRouter.post('/', uploadOptions.single('image'), httpPostProduct);
productsRouter.put('/:id', uploadOptions.single('image'), httpUpdateProduct);
productsRouter.put('/images/:id', uploadOptions.array('images', 10), httpUpdateProductImages);
productsRouter.delete('/:id', httpDeleteProduct);

module.exports = productsRouter;