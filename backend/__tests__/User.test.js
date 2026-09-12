const User = require('../models/User');

describe('User Model', () => {

    // Verify that a user with all required fields is valid
    test('soll mit Email und Passwort gültig sein', () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123'
        });

        const error = user.validateSync();

        expect(error).toBeUndefined();
    });

    // Verify that the email field is required
    test('soll ohne Email ungültig sein', () => {
        const user = new User({
            password: 'password123'
        });

        const error = user.validateSync();

        expect(error.errors.email).toBeDefined();
    });

    // Verify that the password field is required
    test('soll ohne Passwort ungültig sein', () => {
        const user = new User({
            email: 'test@example.com'
        });

        const error = user.validateSync();

        expect(error.errors.password).toBeDefined();
    });

    // Verify that the provided user data is stored correctly in the model
    test('soll die angegebenen Werte korrekt übernehmen', () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(user.email).toBe('test@example.com');
        expect(user.password).toBe('password123');
    });

});