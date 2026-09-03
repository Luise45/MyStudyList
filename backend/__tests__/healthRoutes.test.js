const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const healthRoutes = require('../routes/healthRoutes');

const app = express();

app.use('/health', healthRoutes);

describe('Health Route', () => {

    test('soll 503 zurückgeben, wenn keine Datenbank verbunden ist', async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        const response = await request(app)
            .get('/health');

        expect(response.statusCode).toBe(503);
        expect(response.body.status).toBe('error');
        expect(response.body.database).toBe('disconnected');
    });

    test('soll 200 zurückgeben, wenn die Datenbank verbunden ist', async () => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());

        const response = await request(app)
            .get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.database).toBe('connected');

        await mongoose.disconnect();
        await mongoServer.stop();
    });

});