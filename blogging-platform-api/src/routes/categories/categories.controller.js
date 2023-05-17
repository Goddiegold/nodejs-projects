const mongoose = require('mongoose');

const Category = require('../../models/categories.model');

// Get all categories
const httpGetCategories = async (req, res) => {
    try {
        const cateories = await Category.find()
            .select('name')
            .sort('+name');
      
        if (cateories.length === 0) return res.status(404).json({ message: 'No category found' });

        res.status(200).json({ cateories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetCategoryByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid category Id');
        
        const category = await Category.findById(req.params.id)
            .select('-_id -__v');

        if (!category) return res.status(404).json({ error: `category not found` });

        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create a new Cateory
const httpCreateCategory = async (req, res) => {
    try {
        const categoryName = req.body.category;
        console.log('Creating category' + categoryName)

        if (!categoryName) return res.status(400)
            .json({ message: 'Please provide a category name' });

        const category = await Category.create({ name: categoryName });
        if (!category) {
            return res.status(404).json({ message: 'Category not created' });
        }

        const { _id, name } = category;

        res.status(201).json({ _id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update an existing Cateory
const httpUpdateCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid category Id');

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.category },
            { new: true }
        );

        if (!category) return res.status(404).json({ error: 'Category was not updated' })

        const { name } = category;

        res.json({ name });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a Cateory
const httpDeleteCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid Post Id');

        const cateory = await Category.findByIdAndDelete(req.params.id);

        if (cateory.deletedCount === 0) return res.status(404)
            .json({ error: 'Cateory not deleted' });

        res.json({ message: 'Cateory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    httpGetCategories,
    httpGetCategoryByID,
    httpCreateCategory,
    httpUpdateCategory,
    httpDeleteCategory,
};