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

    test('GET /api/hws/:id soll 404 zurückgeben, wenn die Hausaufgabe nicht existiert', async () => {
        const id = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/hws/${id}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Hw not found');
    });
    test('DELETE /api/hws/:id soll 404 zurückgeben, wenn die Hausaufgabe nicht existiert', async () => {
        const id = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/hws/${id}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Hw not found');
    });
    test('GET /api/hws/:id soll bei ungültiger ID einen Fehler zurückgeben', async () => {
        const response = await request(app)
            .get('/api/hws/ungueltige-id');

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBeDefined();
    });
});