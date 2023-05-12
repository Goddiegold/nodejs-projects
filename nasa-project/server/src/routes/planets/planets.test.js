const request = require('supertest');
const app = require('../../app');
const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongo');
const { loadPlanetsData } = require('../../models/planets/planets.model');

describe('Planets API', () => {
    beforeAll(async () => await mongooseConnect());

    afterAll(async () => await mongooseDisconnect());
    
    describe('Test GET /planets', () => {
        it('should return a list of planets', async () => {
            await loadPlanetsData();

            const response = await request(app).get('/v1/planets');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(8);
            expect(response.body[0]).toHaveProperty('keplerName');
        });
    });
});