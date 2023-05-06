// const request = require('supertest');
// const app = require('../../app');
// const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongo');

// describe('Launches API', () => {
//     beforeAll(async () => await mongooseConnect(), 10000);

//     afterAll(async () => await mongooseDisconnect());
    
//     describe('Test GET /launches', () => {
//         test('It should respond with an array of launches', async () => {
//             const response = await request(app).get('/v1/launches');
//             expect(response.statusCode).toBe(200);
//             expect(response.body).toBeInstanceOf(Array);
//         });
//     });

//     describe('Test POST /launches', () => {
//         test('It should respond with 201 created and the newly created launch', async () => {
//             const newLaunch = {
//                 mission: 'test mission',
//                 rocket: 'test rocket',
//                 launchDate: '2030-12-27T00:00:00.000Z',
//                 target: 'Kepler-296 e',
//             };
//             const response = await request(app).post('/v1/launches').send(newLaunch);
//             expect(response.statusCode).toBe(201);
//             expect(response.body).toMatchObject(newLaunch);
//         });

//         test('It should respond with 400 if missing required fields', async () => {
//             const invalidLaunch = {
//                 mission: 'test mission',
//                 rocket: 'test rocket',
//             };
//             const response = await request(app).post('/v1/launches').send(invalidLaunch);
//             expect(response.statusCode).toBe(400);
//             expect(response.body).toMatchObject({error: 'Missing required fields'});
//         });

//         test('It should respond with 400 if invalid launch date', async () => {
//             const invalidLaunch = {
//                 mission: 'test mission',
//                 rocket: 'test rocket',
//                 launchDate: 'invalid date',
//                 target: 'Kepler-296 e',
//             };
//             const response = await request(app).post('/v1/launches').send(invalidLaunch);
//             expect(response.statusCode).toBe(400);
//             expect(response.body).toMatchObject({error: 'Invaid Launch Date'});
//         });
//     });

//     describe('Test DELETE /launches/:id', () => {
//         test('It should respond with 200 and the aborted launch', async () => {
//             const newLaunch = {
//                 mission: 'test mission',
//                 rocket: 'test rocket',
//                 launchDate: '2030-12-27T00:00:00.000Z',
//                 target: 'Kepler-296 e',
//             };
//             const responseCreate = await request(app).post('/v1/launches').send(newLaunch);
//             expect(responseCreate.statusCode).toBe(201);
//             expect(responseCreate.body).toMatchObject(newLaunch);

//             const responseDelete = await request(app).delete(`/v1/launches/${responseCreate.body.flightNumber}`);
//             expect(responseDelete.statusCode).toBe(200);
//             expect(responseDelete.body).toEqual({ ok: 'Launch aborted' });
//         });

//         test('It should respond with 404 if launch not found', async () => {
//             const response = await request(app).delete('/v1/launches/99999');
//             expect(response.statusCode).toBe(404);
//             expect(response.body).toMatchObject({error: 'Launch not found'});
//         });
//     });
// });