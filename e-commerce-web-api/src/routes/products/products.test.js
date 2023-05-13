const request = require('supertest');
const app = require('../../app');
const Category = require('../../models/categories.model');
const Product = require('../../models/products.model');

const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongo');

describe('Category Routes Endpoints', () => {
  beforeAll(async () => await mongooseConnect());
  afterAll(async () => {
    await Category.deleteMany({});
    await mongooseDisconnect();
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return a product by id', async () => {
      const category = await Category.create({ name: 'Test Category' });
      const categoryId = category._id

      const product = await Product.create({
        name: "Test Name",
        description: "Test Description",
        category: `${categoryId}`,
        countInStock: 1,
      });
      const productId = product._id

      const response = await request(app).get(`/api/v1/products/${productId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.product.name).toBe('Test Name');
    });

    it('should return a 404 if product not found', async () => {
      const response = await request(app).get('/api/v1/products/645f4909e464ddde23e3dcfe');
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Product not found');
    });

    it('should return a 500 if id is not a valid ObjectId', async () => {
      const response = await request(app).get('/api/v1/products/645f4909e464ddde23e3dcfs');
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Cast to ObjectId failed for value "645f4909e464ddde23e3dcfs" (type string) at path "_id" for model "Product"');
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const category = await Category.create({
        name: 'Test Category',
        icon: 'Test Icon',
        color: 'Test Color'
      });
      const categoryId = category._id

      const response = await request(app)
        .post('/api/v1/products')
        .send({
          name: "New Name",
          description: "New Description",
          category: `${categoryId}`,
          countInStock: 1,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.newCreatedproduct.name).toBe('New Name');
    });

    it('should return a 404 if required fields are missing', async () => {
      const response = await request(app).post('/api/v1/products').send({});
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
        
    it('should update an existing product', async () => {
      const category = await Category.create({ name: 'Test Category' });
      const categoryId = category._id

      const product = await Product.create({
        name: "Test Name",
        description: "Test Description",
        category: `${categoryId}`,
        countInStock: 1,
      });
      const productId = product._id

      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .send({ name: "Updated Name" });
      expect(response.statusCode).toBe(200);
      expect(response.body.updatedProduct.name).toBe('Updated Name');
    });

    it('should return a 404 if product not found', async () => {
      const response = await request(app)
        .put('/api/v1/products/645f4909e464ddde23e3dcfe')
        .send({
          name: "Test Name",
          description: "Test Description",
          category: '645f4909e464ddde23e3dcfe',
          countInStock: 1,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete an existing product', async () => {
      const category = await Category.create({ name: 'Test Category' });
      const categoryId = category._id

      const product = await Product.create({
        name: "Test Name",
        description: "Test Description",
        category: `${categoryId}`,
        countInStock: 1,
      });
      const productId = product._id

      const response = await request(app).delete(`/api/v1/products/${productId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Product has been deleted');
    });

    it('should return a 404 if product not found', async () => {
      const response = await request(app).delete('/api/v1/products/645f4909e464ddde23e3dcfe');
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('GET /api/v1/products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/v1/products');
      expect(response.statusCode).toBe(200);
      expect(response.body.products.length).toBeGreaterThan(0);
    });

    it('should return a 404 if no products exist', async () => {
      await Product.deleteMany({});
      const response = await request(app).get('/api/v1/products');
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('No product found');
    });
  });

  describe('GET /api/v1/products/get/featured/0', () => {
    it('should return featured products with status 200', async () => {
      const category = await Category.create({ name: 'Test Category' });
      const categoryId = category._id

      await Product.create({
        name: "Test Name",
        description: "Test Description",
        category: `${categoryId}`,
        countInStock: 1,
        isFeatured: true
      });
      const response = await request(app).get('/api/v1/products/get/featured/0');
      expect(response.status).toBe(200);
      expect(response.body.featuredProducts.length).toBeGreaterThan(0);
    });

    it('should return a 404 if there are no featured products', async () => {
      await Product.deleteMany({})
      const response = await request(app).get('/api/v1/products/get/featured/0');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No featured products');
    });
  });

  describe('GET /api/v1/products/count', () => {
    it('should return products count with status 200', async () => {
      const category = await Category.create({ name: 'Test Category' });
      const categoryId = category._id

      await Product.create({
        name: "Test Name",
        description: "Test Description",
        category: `${categoryId}`,
        countInStock: 1,
      });
      const response = await request(app).get('/api/v1/products/get/count');
      expect(response.status).toBe(200);
      expect(response.body.productsCount).toBeGreaterThan(0);
    });

    it('should return a 404 if there are no products', async () => {
      await Product.deleteMany({});
      const response = await request(app).get('/api/v1/products/get/count');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('There is not product yet');
    });
  });
});