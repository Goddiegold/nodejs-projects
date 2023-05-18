const mongoose = require('mongoose');

const Category = require('../../models/categories.model');
const handleError = require('../../utils/errors.handler');

// Get all categories
const httpGetCategories = async (req, res) => {
    try {
        const cateories = await Category.find()
            .select('name')
            .sort('+name');
      
        if (cateories.length === 0) return res.status(204).json({ cateories: 'No content' });

        res.status(200).json({ cateories });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function httpGetCategoryByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ category: 'Invalid ID' });
        
        const category = await Category.findById(req.params.id)
            .select('-_id -__v');

        if (!category) return res.status(404).json({ category: 'Not Found' });

        res.status(200).json({ category });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Create a new Cateory
const httpCreateCategory = async (req, res) => {
    try {
        const categoryName = req.body.category;

        const category = await Category.create({ name: categoryName });
        if (!category) return res.status(501).json({ category: 'Not Implemented' })

        res.status(201).json({ category: 'Created' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Update an existing Cateory
const httpUpdateCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ category: 'Invalid ID' });

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.category },
            { new: true }
        );

        if (!category) return res.status(304).json({ category: 'Not Modified' })

        res.status(200).json({ category: 'Modified' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete a Cateory
const httpDeleteCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ category: 'Invalid ID' });

        const cateory = await Category.findByIdAndDelete(req.params.id);

        if (cateory.deletedCount === 0) return res.status(417)
            .json({ message: 'Expectation Failed' });

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        const errors = handleError(error);
        if (errors) return res.status(400).json({ errors });

        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    httpGetCategories,
    httpGetCategoryByID,
    httpCreateCategory,
    httpUpdateCategory,
    httpDeleteCategory,
};