const categoriesRouter = require('express').Router();

const { authAdmin } = require('../../utils/auth.middleware');
const {
    httpGetCategories,
    httpGetCategoryByID,
    httpCreateCategory,
    httpUpdateCategory,
    httpDeleteCategory,
} = require('./categories.controller');

// GET all category names and id (Private)
categoriesRouter.get('/', httpGetCategories);
// GET a single category names (Private)
categoriesRouter.get('/:id', authAdmin, httpGetCategoryByID);
// Create a new category name (Private)
categoriesRouter.post('/', authAdmin, httpCreateCategory);
// Update a category name (Private)
categoriesRouter.put('/:id', authAdmin, httpUpdateCategory);
// Delete a category name (Private)
categoriesRouter.delete('/:id', authAdmin, httpDeleteCategory);

module.exports = categoriesRouter;
