const express = require('express');
const categoriesRouter = express.Router();
// const { authenticateToken } = require('../authenticate/auth.controller');

const {
    httpGetCategories,
    httpGetCategoryByID,
    httpPostCategory,
    httpUpdateCategory,
    httpDeleteCategory
} = require('./categories.controller')

categoriesRouter.get('/', httpGetCategories);
categoriesRouter.get('/:id', httpGetCategoryByID);
categoriesRouter.post('/', httpPostCategory);
categoriesRouter.put('/:id', httpUpdateCategory);
categoriesRouter.delete('/:id', httpDeleteCategory);

module.exports = categoriesRouter;