const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
}, 30000);

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
}, 30000);

describe('Authentication Integration Tests', () => {

    test('POST /api/auth/register soll einen neuen User registrieren', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.user.email).toBe('test@example.com');

        const savedUser = await User.findOne({
            email: 'test@example.com'
        });

        expect(savedUser).not.toBeNull();
    });

    test('Passwort soll beim Registrieren gehasht gespeichert werden', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        const savedUser = await User.findOne({
            email: 'test@example.com'
        });

        expect(savedUser.password).not.toBe('password123');

        const passwordMatches = await bcrypt.compare(
            'password123',
            savedUser.password
        );

        expect(passwordMatches).toBe(true);
    });

    test('Registrierung ohne Email soll 400 zurückgeben', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                password: 'password123'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message)
            .toBe('Email and password are required');
    });

    test('Registrierung ohne Passwort soll 400 zurückgeben', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message)
            .toBe('Email and password are required');
    });

    test('Doppelte Email soll 400 zurückgeben', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'anderesPasswort'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User already exists');
    });

    test('POST /api/auth/login soll einen User erfolgreich einloggen', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe('test@example.com');
    });

    test('Login mit falschem Passwort soll 401 zurückgeben', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'falschesPasswort'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message)
            .toBe('Invalid email or password');
    });

    test('Login mit unbekannter Email soll 401 zurückgeben', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'unknown@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message)
            .toBe('Invalid email or password');
    });

    test('Login ohne Email soll 400 zurückgeben', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                password: 'password123'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message)
            .toBe('Email and password are required');
    });

});