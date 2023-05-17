const categoriesRouter = require('express').Router();

const { authToken } = require('../../utils/auth.middleware');
const {
    httpGetCategories,
    httpGetCategoryByID,
    httpCreateCategory,
    httpUpdateCategory,
    httpDeleteCategory,
} = require('./categories.controller');

// GET all category names and id (Private)
categoriesRouter.get('/', authToken, httpGetCategories);
// GET a single category names (Private)
categoriesRouter.get('/:id', authToken, httpGetCategoryByID);
// Create a new category name (Private)
categoriesRouter.post('/', authToken, httpCreateCategory);
// Update a category name (Private)
categoriesRouter.put('/:id', authToken, httpUpdateCategory);
// Delete a category name (Private)
categoriesRouter.delete('/:id', authToken, httpDeleteCategory);

module.exports = categoriesRouter;
