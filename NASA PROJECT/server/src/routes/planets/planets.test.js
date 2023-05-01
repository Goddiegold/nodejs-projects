const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { parse } = require('csv-parse');
const request = require('supertest');

const app = require('../../app');
const { mongooseConnect, mongooseDisconnect } = require('../../utils/mongo');
const { loadPlanetsData } = require('../../models/planets.model');
const filePath = path.join(__dirname, '../../../data/kepler_data.csv');

const readFileAsync = promisify(fs.readFile);

describe('Planets API', () => {
    beforeAll(async () => await mongooseConnect(), 10000);

    afterAll(async () => await mongooseDisconnect());

    describe('Test loadPlanetsData function', () => {
        it('should load and filter planet data', async () => {
            const data = await readFileAsync(filePath);
            const planets = [];
    
            const parser = parse({
                comment: '#',
                columns: true,
            });
    
            parser.on('readable', () => {
                let record = parser.read();
                while (record) {
                    if (
                        record['koi_disposition'] === 'CONFIRMED' &&
                        record['koi_insol'] > 0.36 &&
                        record['koi_insol'] < 1.11 &&
                        record['koi_prad'] < 1.6
                    ) {
                        planets.push(record);
                    }
                    record = parser.read();
                }
            });
    
            parser.on('error', (err) => {
                throw err;
            });
    
            parser.on('end', () => {
                expect(planets).toHaveLength(8);
            });
    
            parser.write(data);
            parser.end();
        });
    });
    
    describe('Test GET /planets', () => {
        it('should return a list of planets', async () => {
            await loadPlanetsData();

            const response = await request(app).get('/planets');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(8);
            expect(response.body[0]).toHaveProperty('keplerName');
        });
    });
})