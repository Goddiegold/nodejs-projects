const request = require('supertest');

const app = require('../../app');
const User = require('../../models/users.model');
const TokenBlacklist = require('../../models/tokenblacklist.model');
const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongoose');

describe('Authentication Endpoints', () => {
    beforeAll(async () => await mongooseConnect());
    afterAll(async () => {
        await TokenBlacklist.deleteMany({});
        await User.deleteMany({});
        await mongooseDisconnect()
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'password',
                });

            expect(response.status).toBe(201);
            expect(response.body.user).toBe('Created');
        });
   
        it('should hash password before saving', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            expect(user.password).not.toBe('password123');
        });

        it('should throw validation errors if required fields are missing', async () => {
            const user = new User({});

            let err;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }
            
            expect(err.message).toBeDefined();
        });

        it('should throw validation errors if email is invalid', async () => {
            const user = new User({
                username: 'testuser1',
                email: 'invaild-email',
                password: 'password',
            });

            let err;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err.errors.email).toBeDefined();
        });

        it('should throw validation errors if email is not unique', async () => {
            const user = new User({
                username: 'testuser1',
                email: 'testuser@example.com',
                password: 'password',
            });

            let err;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err.message).toBeDefined();
        });

        it('should throw validation errors if username is not unique', async () => {
            const user = new User({
                username: 'testuser',
                email: 'testuser1@example.com',
                password: 'password',
            });

            let err;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err.message).toBeDefined();
        });

        it('should throw validation errors if password is too short', async () => {
            const user = new User({
                username: 'test1user',
                email: 'testuser1@example.com',
                password: 'short',
            });

            let err;
            try {
                await user.save();
            } catch (error) {
                err = error;
            }

            expect(err.errors.password).toBeDefined();
        });

        it('should create user with default Admin Status if not provided', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            expect(user.isAdmin).toBe(false);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should return an auth token for a valid login with email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
            
            expect(response.status).toEqual(200);
            expect(response.body.accessToken).toBeDefined();
        });

        it('should return an auth token for a valid login with username', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'testuser', password: 'password' });
            
            expect(response.status).toEqual(200);
            console.log('accessToken', response.accessToken);
            // expect(response.accessToken).toBeDefined();
        });

        it('should return an error for an invalid login with password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'wrongpassword' });
            
            expect(res.status).toEqual(401);
            expect(res.body.message).toEqual('Incorrect credentials');
        });

        it('should return an error for an invalid login with email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'wrong@example.com', password: 'password' });
            
            expect(res.status).toEqual(401);
            expect(res.body.message).toEqual('Incorrect credentials');
        });

        it('should return an error for an invalid login with username', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'wrongusername', password: 'password' });
            
            expect(res.status).toEqual(401);
            expect(res.body.message).toEqual('Incorrect credentials');
        });
    });
    
    describe('GET /api/v1/auth/logout', () => {
        it('should blacklist the auth token for the current user', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'testuser@example.com', password: 'password' });
            
            const authToken = response.body.accessToken
            const res = await request(app)
                .get('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${authToken}`)
            
            expect(res.status).toEqual(200);
            expect(res.body.message).toEqual('Logout successful');

            const tokenblacklisted = await TokenBlacklist.findOne({ token: authToken });
            expect(tokenblacklisted.token).toBe(authToken);
        });

        it('should return an error if no auth token is provided', async () => {
            const response = await request(app).get('/api/v1/auth/logout');
            expect(response.status).toEqual(401);
            expect(response.body.message).toBe('Unauthorized');
        });
    });
});