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
    destination: (req, file, callback) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        
        if (!isValid) {
            const uploadError = new Error('Invalid image type');
            return callback(uploadError);
        }

        callback(null, __dirname + '../../../../public/uploads')
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname.replace(' ', '-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        callback(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploads = multer({ storage: storage })

async function httpGetProducts(req, res) {
    try {
        let filter = {};
        if (req.query.categories) {
            if (!mongoose.isValidObjectId(req.query.categories))
                return res.status(400).send('Invalid categories Id');
            
            filter = { category: req.query.categories.split(',') };
        }
            
        const products = await Product.find(filter)
            .select('name price image isFeatured')
            .sort('+name')

        if (products.length === 0) return res.status(404).json({ error: 'No product found' });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpGetProductByID(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid Product Id');
        
        const product = await Product.findById(req.params.id)
            .select('-_id -__v')
            .populate({ path: 'category', select: '-_id name' });

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
            .select('name price image isFeatured')
        
        if (featuredProducts.length === 0) return res.status(404).json({ error: 'No featured products' });

        res.status(200).json({ featuredProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpPostProduct(req, res) {
    try {
        const category = await Category.findById(req.body.category);

        if (!mongoose.isValidObjectId(category._id))
            return res.status(400).send('Invalid Category Id');
        
        if (!category) return res.status(404).json({ error: 'Category not found' });

        const file = req.file
        if (!file) return res.status(400).send('No image in the request');

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        
        const newCreatedproduct = await Product.create(
            {
                name: req.body.name,
                description: req.body.description,
                image: `${basePath}${fileName}`,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                isFeatured: req.body.isFeatured,
            }
        )
        const { _id, name, isFeatured } = newCreatedproduct;
        res.status(201).json({ _id, name, isFeatured });
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
        const { name, description, image, brand, price, category, countInStock, isFeatured }
            = updatedProduct;

        res.status(200)
            .json({ name, description, image, brand, price, category, countInStock, isFeatured });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpUpdateProductImages(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid Product Id');

        const files = req.files

        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map(file => { imagesPaths.push(`${basePath}${file.filename}`) });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { images: imagesPaths },
            { new: true }
        )

        const updatedProduct = await product.save();

        const { name, images } = updatedProduct;

        res.status(200).json({ name, images });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function httpDeleteProduct(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).send('Invalid Product Id');
         
        const product = await Product.deleteOne({ _id: req.params.id });

        if (product.deletedCount === 0) return res.status(404).json({ message: 'Product not found' });

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
    uploads
}