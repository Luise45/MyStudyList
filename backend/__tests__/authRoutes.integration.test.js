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

// Start an isolated in-memory MongoDB instance before running the tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
}, 30000);

// Remove test data after each test to keep the tests independent
afterEach(async () => {
    await User.deleteMany({});
});

// Close the database connection and stop the test database
afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
}, 30000);

describe('Authentication Integration Tests', () => {

    // Verify that a new user can be registered successfully
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

        // Verify that the user was actually stored in the database
        const savedUser = await User.findOne({

            email: 'test@example.com'
        });

        expect(savedUser).not.toBeNull();
    });

    // Verify that passwords are stored as hashes instead of plain text
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

        // Verify that the original password matches the stored hash
        const passwordMatches = await bcrypt.compare(
            'password123',
            savedUser.password
        );

        expect(passwordMatches).toBe(true);
    });

    // Registration must fail when the email is missing
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

    // Registration must fail when the password is missing
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

    // Prevent registration with an email address that already exists
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

    // Verify successful login and JWT creation
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

    // Login must fail when the password is incorrect
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

    // Login must fail when no user exists for the provided email
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

    // Login must fail when the email is missing
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