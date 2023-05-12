const Product = require('../../models/products.model');
const Category = require('../../models/categories.model');

async function httpGetProducts(req, res) {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }
            
        const products = await Product.find(filter)

        if (!products) return res.status(404).json('No product found');

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpGetProductByID(req, res) {
    try {
        const product = await Product.findById(req.params.id).populate('category');

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpGetProductsCount(req, res) {
    try {
        const productsCount = await Product.countDocuments(count => count);

        if (!productsCount) return res.status(404).json({ error: 'There is not product yet' });

        res.status(200).json({ productsCount });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpGetFetaturedProducts(req, res) {
    try {
        const count = req.params.count ? req.params.count : 0;

        const featuredProducts = await Product.find({ isFeatured: true })
            .populate('category')
            .limit(+count)
        if (!featuredProducts) return res.status(404).json({ error: 'No featured products' });

        res.status(200).json({ featuredProducts });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpPostProduct(req, res) {
    try {
        const category = await Category.findById(req.body.category);

        if (!category) return res.status(404).json({ error: 'Invaild Category ID' });
        
        const newCreatedproduct = await Product.create(
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                images: req.body.images,
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
        res.status(500).json(error.message);
    }
}

async function httpUpdateProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ error: 'Product not found' });

        const category = await Category.findById(req.body.category);

        if (!category) return res.status(404).json({ error: 'Invaild Category ID' });

        if (req.body.name) {
            Product.name = req.body.name;
        }
        if (req.body.description) {
            Product.description = req.body.description;
        }
        if (req.body.richDescription) {
            Product.richDescription = req.body.richDescription;
        }
        if (req.body.image) {
            Product.image = req.body.image;
        }
        if (req.body.images) {
            Product.images = req.body.images;
        }
        if (req.body.brand) {
            Product.brand = req.body.brand;
        }
        if (req.body.price) {
            Product.price = req.body.price;
        }
        if (req.body.category) {
            Product.category = req.body.category;
        }
        if (req.body.countInStock) {
            Product.countInStock = req.body.countInStock;
        }
        if (req.body.isFeatured) {
            Product.isFeatured = req.body.isFeatured;
        }

        const updatedProduct = await Product.save();

        res.status(200).json({ updatedProduct });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function httpDeleteProduct(req, res) {
    try {
        const product = await Product.deleteOne({ _id: req.params.id });

        if (product.deletedCount === 0) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ message: 'Product has been deleted' });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {
    httpGetProducts,
    httpGetProductByID,
    httpGetProductsCount,
    httpGetFetaturedProducts,
    httpPostProduct,
    httpUpdateProduct,
    httpDeleteProduct
}