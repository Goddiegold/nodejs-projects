const productsRouter = require('express').Router();
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
    uploads
} = require('./products.controller')

productsRouter.get('/', httpGetProducts);
productsRouter.get('/:id', httpGetProductByID);
productsRouter.get('/get/count', httpGetProductsCount);
productsRouter.get('/get/featured/:count', httpGetFetaturedProducts);
productsRouter.post('/', uploads.single('image'), httpPostProduct);
productsRouter.put('/:id', uploads.single('image'), httpUpdateProduct);
productsRouter.put('/images/:id', uploads.array('images', 10), httpUpdateProductImages);
productsRouter.delete('/:id', httpDeleteProduct);

module.exports = productsRouter;