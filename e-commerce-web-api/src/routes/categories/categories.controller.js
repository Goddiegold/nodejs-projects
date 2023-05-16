const mongoose = require('mongoose');

const Category = require('../../models/categories.model');

async function httpGetCategories(req, res) {
    try {
        const categories = await Category.find({})
            .select('name icon color')
            .sort('+name')

        if (categories.length === 0) return res.status(404).json({ message: 'No category found' });

        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetCategoryByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid Category Id' });

        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404)
            .json({ message: `Category not found` });
        
        const { name, icon, color, createdAt, updatedAt } = category;

        res.status(200).json({ name, icon, color, createdAt, updatedAt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpPostCategory(req, res) {
    try {
        const newCreatedCategory = await Category.create(
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            }
        )
        const { _id, name, icon, color } = newCreatedCategory;
        res.status(201).json({ _id, name, icon, color });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateCategory(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid Category Id' });
        
        const id = await Category.findById(req.params.id);

        if (!id) return res.status(404).json({ message: 'Category not found' });

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

        const { name, icon, color, updatedAt } = updatedCategory;
        res.status(200).json({ name, icon, color, updatedAt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteCategory(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send({ message: 'Invalid Category Id' });
        
        const category = await Category.deleteOne({ _id: req.params.id });

        if (category.deletedCount === 0) return res.status(404).json({ message: 'Category not found' });

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