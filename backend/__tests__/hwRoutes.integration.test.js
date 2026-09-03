const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const hwRoutes = require('../routes/hwRoutes');
const Hw = require('../models/Hw');

const app = express();

app.use(express.json());
app.use('/api/hws', hwRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    await Hw.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Hw Routes Integration Tests', () => {

    test('POST /api/hws soll eine Hausaufgabe erstellen', async () => {

        const response = await request(app)
            .post('/api/hws')
            .send({
                date: '2026-09-10',
                subject: 'Mathematik',
                task_type: 'Hausaufgabe',
                notes: 'Seite 20 bearbeiten'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Hw uploaded successfully');
        expect(response.body.hw.subject).toBe('Mathematik');

        const savedHw = await Hw.findOne({
            subject: 'Mathematik'
        });

        expect(savedHw).not.toBeNull();
        expect(savedHw.task_type).toBe('Hausaufgabe');
    });


    test('GET /api/hws soll alle Hausaufgaben zurückgeben', async () => {

        await Hw.create({
            date: new Date('2026-09-10'),
            subject: 'Datenbanken',
            task_type: 'Prüfung',
            notes: 'SQL lernen'
        });

        const response = await request(app)
            .get('/api/hws');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].subject).toBe('Datenbanken');
    });

});