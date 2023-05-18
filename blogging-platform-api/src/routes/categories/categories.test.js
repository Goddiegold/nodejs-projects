const request = require('supertest');

const app = require('../../app');
const Category = require('../../models/categories.model');
const User = require('../../models/users.model');
const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongoose');

describe('User Routes Endpoints', () => {
    beforeAll(async () => await mongooseConnect());
    afterAll(async () => {
        await Category.deleteMany({});
        await User.deleteMany({});
        await mongooseDisconnect()
    });

    describe('POST /api/v1/categories', () => {
        it('should create a new category', async () => {
            await User.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                isAdmin: true
            });

            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
            
            const authToken = login.body.accessToken
            
            const response = await request(app)
                .post('/api/v1/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ category: 'News' })

            expect(response.status).toBe(201);
            expect(response.body.category).toBe('Created');
        });
   

        it('should throw validation errors if category is not unique', async () => {
            const category = new Category({ name: 'News' });

            let err;
            try {
                await category.save();
            } catch (error) {
                err = error;
            }

            expect(err.message).toBeDefined();
        });
    });

    describe('GET /api/v1/categories', () => {
        it('should return not found when a category is not created', async () => {
            await Category.deleteMany({});

            const response = await request(app).get('/api/v1/categories');
            expect(response.status).toBe(404);
            expect(response.body.categories).toBe('Not Found');
        });

        it('should return an object of cateories', async () => {
            await Category.create({ name: 'Nigeria News' });

            const response = await request(app).get('/api/v1/categories');
            expect(response.status).toBe(200);
            expect(typeof response.body.categories).toBe('object');
        });
    });

    describe('GET /api/v1/categories/:id', () => {
        it('should require authentication', async () => {
            const category = await Category.findOne({ name: 'Nigeria News' });

            const response = await request(app).get(`/api/v1/users/${category._id}`);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should require valid Id', async () => {
            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
      
            const authToken = login.body.accessToken

            const response = await request(app)
                .get('/api/v1/categories/1')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(400);
            expect(response.body.category).toBe('Invalid ID');
        });

        it('should return a category by ID when authenticated', async () => {
            const category = await Category.findOne({ name: 'Nigeria News' });
      
            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
      
            const authToken = login.body.accessToken
            const response = await request(app)
                .get(`/api/v1/categories/${category._id}`)
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.status).toBe(200);
            expect(typeof response.body.category).toBe('object');
        });
    });



    describe('PUT /api/v1/categories/:id', () => {
        it('should require authentication', async () => {
            const category = await Category.findOne({ name: 'Nigeria News' });

            const response = await request(app).put(`/api/v1/categories/${category._id}`);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should update a category', async () => {
            const category = await Category.findOne({ name: 'Nigeria News' });

            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
                
            const authToken = login.body.accessToken

            const response = await request(app)
                .put(`/api/v1/categories/${category._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ category: 'Nigeria Books' });

            expect(response.status).toBe(200);
            expect(response.body.category).toBe('Modified');           
        });
    })

    describe('DELETE /api/v1/categories/:id', () => {
        it('should require authentication', async () => {
            const category = await Category.findOne({ name: 'Nigeria Books' });

            const response = await request(app).delete(`/api/v1/categories/${category._id}`);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should delete a category', async () => {
            const category = await Category.findOne({ name: 'Nigeria Books' });

            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
      
            const authToken = login.body.accessToken

            const response = await request(app)
                .delete(`/api/v1/categories/${category._id}`)
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Success');
        });
    });
});