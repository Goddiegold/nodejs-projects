const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../../models/products.model');
const Category = require('../../models/categories.model');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) return uploadError = null
        
        cb(uploadError, path.join(__dirname, '../../../public/uploads'))
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.replace(' ', '-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ dest: storage })

async function httpGetProducts(req, res) {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }
            
        const products = await Product.find(filter)

        if (products.length === 0) return res.status(404).json({ error: 'No product found' });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetProductByID(req, res) {
    try {
        const product = await Product.findById(req.params.id).populate('category');

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetProductsCount(req, res) {
    try {
        const productsCount = await Product.countDocuments();

        if (productsCount === 0) return res.status(404).json({ error: 'There is not product yet' });

        res.status(200).json({ productsCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetFetaturedProducts(req, res) {
    try {
        const count = req.params.count ? req.params.count : 0;

        const featuredProducts = await Product.find({ isFeatured: true })
            .limit(+count)
            .populate('category')
        
        if (featuredProducts.length === 0) return res.status(404).json({ error: 'No featured products' });

        res.status(200).json({ featuredProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpPostProduct(req, res) {
    try {
        const category = await Category.findById(req.body.category);

        if (!category) return res.status(404).json({ error: 'Invaild Category ID' });

        const file = req.file
        if (!file) return res.status(400).send('No image in the request');

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        
        const newCreatedproduct = await Product.create(
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: `${basePath}${fileName}`,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
                dateCreated: req.body.dateCreated
            }
        )

        res.status(201).json({ newCreatedproduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateProduct(req, res) {
    try {
        const id = await Product.findById(req.params.id);

        if (!id) return res.status(404).json({ error: 'Product not found' });

        const file = req.file
        if (!file) return res.status(400).send('No image in the request');

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: `${basePath}${fileName}`,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        )

        const updatedProduct = await product.save();

        res.status(200).json({ updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateProductImages(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid Product Id');

        const files = req.files
        if (!files) return res.status(400).send('No images in the request');

        let imagesPaths = [];

        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        files.map(file => { imagesPaths.push(`${basePath}${file.filename}`) });

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { images: imagesPaths },
            { new: true }
        )

        const updatedProduct = await product.save();

        res.status(200).json({ updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteProduct(req, res) {
    try {
        const product = await Product.deleteOne({ _id: req.params.id });

        if (product.deletedCount === 0) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ message: 'Product has been deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    httpGetProducts,
    httpGetProductByID,
    httpGetProductsCount,
    httpGetFetaturedProducts,
    httpPostProduct,
    httpUpdateProduct,
    httpUpdateProductImages,
    httpDeleteProduct,
    uploadOptions
}