const Category = require('../../models/categories.model');

async function httpGetCategories(req, res) {
    try {
        const categories = await Category.find({}, { '__v': 0, });

        if (categories.length === 0) return res.status(404).json({ error: 'No category found' });

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetCategoryByID(req, res) {
    try {
        const id = req.params.id
        const category = await Category.findById(id);

        if (!category) return res.status(404)
            .json({ error: `Category with ID ${id} not found` });

        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateCategory(req, res) {
    try {
        const id = await Category.findById(req.params.id);

        if (!id) return res.status(404).json({ error: 'Category not found' });

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            },
            { new: true }
        )

        const updatedCategory = await category.save();

        res.status(200).json({ updatedCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteCategory(req, res) {
    try {
        const category = await Category.deleteOne({ _id: req.params.id });

        if (category.deletedCount === 0) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json({ message: 'Category has been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    httpGetCategories,
    httpGetCategoryByID,
    httpPostCategory,
    httpUpdateCategory,
    httpDeleteCategory
}