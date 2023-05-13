const request = require('supertest');
const app = require('../../app');
const Category = require('../../models/categories.model');

const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongo');

describe('Category Routes Endpoints', () => {
    beforeAll(async () => await mongooseConnect());
    afterAll(async () => await mongooseDisconnect());

    describe('GET /api/v1/categories/:id', () => {
        it('should return a category by id', async () => {
            const category = await Category.create({
                name: 'Test Category',
                icon: 'Test Icon',
                color: 'Test Color'
            });

            const categoryId = category._id
            const response = await request(app).get(`/api/v1/categories/${categoryId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.category.name).toBe('Test Category');
        });

        it('should return a 404 if category not found', async () => {
            const response = await request(app).get('/api/v1/categories/645f4909e464ddde23e3dcfe');
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Category with ID 645f4909e464ddde23e3dcfe not found');
        });

        it('should return a 500 if id is not a valid ObjectId', async () => {
            const response = await request(app).get('/api/v1/categories/645f4909e464ddde23e3dcfs');
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Cast to ObjectId failed for value "645f4909e464ddde23e3dcfs" (type string) at path "_id" for model "Category"');
        });
    });

    describe('POST /api/v1/categories', () => {
        it('should create a new category', async () => {
            const response = await request(app)
                .post('/api/v1/categories')
                .send({
                    name: 'New Category',
                    icon: 'new-icon',
                    color: 'new-color',
                });
            expect(response.statusCode).toBe(201);
            expect(response.body.newCreatedcategory.name).toBe('New Category');
        });

        it('should return a 500 if required fields are missing', async () => {
            const response = await request(app).post('/api/v1/categories').send({});
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Category validation failed: name: Please enter the category name');
        });
    });

    describe('PUT /api/v1/categories/:id', () => {
        
        it('should update an existing category', async () => {
            const category = await Category.create({
                name: 'Test category',
                icon: 'Test Icon',
                color: 'Test color'
            });

            const categoryId = category._id

            const response = await request(app)
                .put(`/api/v1/categories/${categoryId}`)
                .send({
                    name: 'Updated Category',
                    icon: 'updated-icon',
                    color: 'updated-color',
                });
            expect(response.statusCode).toBe(200);
            expect(response.body.updatedCategory.name).toBe('Updated Category');
        });

        it('should return a 404 if category not found', async () => {
            const response = await request(app)
                .put('/api/v1/categories/645f4909e464ddde23e3dcfe')
                .send({
                    name: 'Updated Category',
                    icon: 'updated-icon',
                    color: 'updated-color',
                });
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Category not found');
        });
    });

    describe('DELETE /api/v1/categories/:id', () => {
        it('should delete an existing category', async () => {
            const category = await Category.create({
                name: 'Test category',
                icon: 'Test Icon',
                color: 'Test color'
            });

            const categoryId = category._id

            const response = await request(app).delete(`/api/v1/categories/${categoryId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Category has been deleted');
        });

        it('should return a 404 if category not found', async () => {
            const response = await request(app).delete('/api/v1/categories/645f4909e464ddde23e3dcfe');
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Category not found');
        });
    });

    describe('GET /api/v1/categories', () => {
        it('should return all categories', async () => {
            const response = await request(app).get('/api/v1/categories');
            expect(response.statusCode).toBe(200);
            expect(response.body.categories.length).toBeGreaterThan(0);
        });

        it('should return a 404 if no categories exist', async () => {
            // delete all categories before running the test
            await Category.deleteMany({});
            const response = await request(app).get('/api/v1/categories');
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('No category found');
        });
    });
});
