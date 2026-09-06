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

// Starts a temporary MongoDB instance before the integration tests.
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
}, 30000);

// Removes all test data after each test to keep the tests independent.
afterEach(async () => {
    await Hw.deleteMany({});
});

// Disconnects from MongoDB and stops the temporary test database.
afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
}, 30000);

describe('Hw Routes Integration Tests', () => {

    // Tests whether a new homework task can be created through the API
    // and is correctly stored in the test database.
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

    // Tests whether all stored homework tasks can be retrieved through the API.
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

    // Tests whether a specific homework task can be retrieved by its ID.
    test('GET /api/hws/:id soll eine Hausaufgabe anhand der ID zurückgeben', async () => {
        const hw = await Hw.create({
            date: new Date('2026-09-10'),
            subject: 'Programmieren',
            task_type: 'Übung',
            notes: 'Node.js wiederholen'
        });

        const response = await request(app)
            .get(`/api/hws/${hw._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.subject).toBe('Programmieren');
        expect(response.body.task_type).toBe('Übung');
    });

    // Tests whether an existing homework task can be deleted through the API.
    test('DELETE /api/hws/:id soll eine Hausaufgabe löschen', async () => {
        const hw = await Hw.create({
            date: new Date('2026-09-11'),
            subject: 'BWL',
            task_type: 'Hausaufgabe',
            notes: 'Kapitel 3 lesen'
        });

        const response = await request(app)
            .delete(`/api/hws/${hw._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('HW deleted successfully');

        const deletedHw = await Hw.findById(hw._id);

        expect(deletedHw).toBeNull();
    });
    // Tests whether the API returns 404 when a homework task does not exist.
    test('GET /api/hws/:id soll 404 zurückgeben, wenn die Hausaufgabe nicht existiert', async () => {
        const id = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/hws/${id}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Hw not found');
    });
    // Tests whether deleting a non-existing homework task returns 404.
    test('DELETE /api/hws/:id soll 404 zurückgeben, wenn die Hausaufgabe nicht existiert', async () => {
        const id = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/hws/${id}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Hw not found');
    });
    // Tests how the API handles an invalid MongoDB ID.
    test('GET /api/hws/:id soll bei ungültiger ID einen Fehler zurückgeben', async () => {
        const response = await request(app)
            .get('/api/hws/ungueltige-id');

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBeDefined();
    });
});