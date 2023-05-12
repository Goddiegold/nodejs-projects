const express = require('express');
const categoriesRouter = express.Router();

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
categoriesRouter.patch('/:id', httpUpdateCategory);
categoriesRouter.delete('/:id', httpDeleteCategory);

module.exports = categoriesRouter;