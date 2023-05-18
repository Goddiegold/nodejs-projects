const request = require('supertest');

const app = require('../../app');
const User = require('../../models/users.model');
const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongoose');

describe('User Routes Endpoints', () => {
    beforeAll(async () => await mongooseConnect());
    afterAll(async () => {
        await User.deleteMany({});
        await mongooseDisconnect()
    });

    describe('GET /api/v1/users', () => {
        it('should return not found when user in not created', async () => {
            const response = await request(app).get('/api/v1/users');

            expect(response.status).toBe(404);
            expect(response.body.users).toBe('Not Found');
        });

        it('should return an object of users', async () => {
            await User.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
            });

            const response = await request(app).get('/api/v1/users');
            expect(response.status).toBe(200);
            expect(typeof response.body.users).toBe('object');
        });
    });

    describe('GET /api/v1/users/:id', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/api/v1/users/6465e0521d615e3450d3c1cb');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should require valid Id', async () => {
            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
      
            const authToken = login.body.accessToken

            const response = await request(app)
                .get('/api/v1/users/1')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(400);
            expect(response.body.user).toBe('Invalid ID');
        });

        it('should return a user by ID when authenticated', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });
      
            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
      
            const authToken = login.body.accessToken
            const response = await request(app)
                .get(`/api/v1/users/${user._id}`)
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.status).toBe(200);
            expect(typeof response.body.user).toBe('object');
        });
    });

    describe('GET /api/v1/users/get/count', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/api/v1/users/get/count');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should return the total number of users', async () => {
            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
      
            const authToken = login.body.accessToken
            const response = await request(app)
                .get('/api/v1/users/get/count')
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(response.status).toBe(200);
            expect(typeof response.body.usersCount).toBe('number');
        });
    });

    describe('PUT /api/v1/users', () => {
        it('should require authentication', async () => {
            const response = await request(app).put('/api/v1/users');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should update a user', async () => {
            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
                
            const authToken = login.body.accessToken
            const updateUser = { firstname: 'John', surname: 'Doe' };

            const response = await request(app)
                .put('/api/v1/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateUser);

            expect(response.status).toBe(200);
            expect(response.body.user).toBe('Modified')
           
        });
    })

    describe('DELETE /api/v1/users', () => {
        it('should require authentication', async () => {
            const response = await request(app).delete('/api/v1/users');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        it('should delete a user', async () => {
            const login = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
      
            const authToken = login.body.accessToken

            const response = await request(app)
                .delete('/api/v1/users')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Success');
        });
    });
});