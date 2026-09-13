const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const healthRoutes = require('../routes/healthRoutes');
const hwRoutes = require('../routes/hwRoutes');
const authRoutes = require('../routes/authRoutes');
const Hw = require('../models/Hw');

const app = express();

app.use(express.json());
app.use('/health', healthRoutes);
app.use('/api/hws', hwRoutes);
app.use('/api/auth', authRoutes);

let mongoServer;

// Start a temporary MongoDB instance for the smoke tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
}, 30000);

// Remove test data after each test
afterEach(async () => {
    await Hw.deleteMany({});
});

// Stop the database after the smoke tests
afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
}, 30000);

describe('Backend Smoke Tests', () => {

    // Verify that the backend and database are available
    test('GET /health should return 200', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.database).toBe('connected');
    });

    // Verify that the homework API is reachable
    test('GET /api/hws should return 200', async () => {
        const response = await request(app).get('/api/hws');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Verify that a homework entry can be created
    test('POST /api/hws should create a homework entry', async () => {
        const response = await request(app)
            .post('/api/hws')
            .send({
                date: '2026-09-11',
                subject: 'DevOps',
                task_type: 'Homework',
                notes: 'Smoke test'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.hw).toBeDefined();
    });

    // Verify that the authentication API is reachable
    test('POST /api/auth/login should return 400 when credentials are missing', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });

    // Verify that the registration API is reachable
    test('POST /api/auth/register should return 400 when credentials are missing', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Email and password are required');
    });

});