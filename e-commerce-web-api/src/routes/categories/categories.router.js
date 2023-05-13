const express = require('express');
const categoriesRouter = express.Router();
const { authenticateToken } = require('../authenticate/auth.controller');

const {
    httpGetCategories,
    httpGetCategoryByID,
    httpPostCategory,
    httpUpdateCategory,
    httpDeleteCategory
} = require('./categories.controller')

categoriesRouter.get('/', httpGetCategories);
categoriesRouter.get('/:id', httpGetCategoryByID);
categoriesRouter.post('/', authenticateToken, httpPostCategory);
categoriesRouter.put('/:id', authenticateToken, httpUpdateCategory);
categoriesRouter.delete('/:id', authenticateToken, httpDeleteCategory);

module.exports = categoriesRouter;