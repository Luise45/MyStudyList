const User = require('../models/User');

describe('User Model', () => {

    test('soll mit Email und Passwort gültig sein', () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123'
        });

        const error = user.validateSync();

        expect(error).toBeUndefined();
    });

    test('soll ohne Email ungültig sein', () => {
        const user = new User({
            password: 'password123'
        });

        const error = user.validateSync();

        expect(error.errors.email).toBeDefined();
    });

    test('soll ohne Passwort ungültig sein', () => {
        const user = new User({
            email: 'test@example.com'
        });

        const error = user.validateSync();

        expect(error.errors.password).toBeDefined();
    });

    test('soll die angegebenen Werte korrekt übernehmen', () => {
        const user = new User({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(user.email).toBe('test@example.com');
        expect(user.password).toBe('password123');
    });

});