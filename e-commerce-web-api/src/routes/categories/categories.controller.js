const Category = require('../../models/categories.model');

async function httpGetCategories(req, res) {
    try {
        const categories = await Category.find({}, { '__v': 0, });

        if (!categories) return res.status(404).json('No category found');

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpGetCategoryByID(req, res) {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpPostCategory(req, res) {
    try {
        const newCreatedcategory = await Category.create(
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            }
        )

        res.status(201).json({ newCreatedcategory });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpUpdateCategory(req, res) {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ error: 'Category not found' });

        if (req.body.name) {
            Category.name = req.body.name;
        }
        if (req.body.icon) {
            Category.icon = req.body.icon;
        }
        if (req.body.color) {
            Category.color = req.body.color;
        }

        const updatedCategory = await Category.save();

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpDeleteCategory(req, res) {
    try {
        const category = await Category.deleteOne({ _id: req.params.id });

        if (category.deletedCount === 0) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json({ message: 'Category has been deleted' });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {
    httpGetCategories,
    httpGetCategoryByID,
    httpPostCategory,
    httpUpdateCategory,
    httpDeleteCategory
}