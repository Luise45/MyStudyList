const Hw = require('../models/Hw');

describe('Hw Model', () => {
    test('soll mit allen Pflichtfeldern gültig sein', () => {
        const hw = new Hw({
            date: new Date(),
            subject: 'Mathematik',
            task_type: 'Hausaufgabe',
            notes: 'Seite 20 bearbeiten'
        });

        const error = hw.validateSync();

        expect(error).toBeUndefined();
    });

    test('soll ohne subject ungültig sein', () => {
        const hw = new Hw({
            date: new Date(),
            task_type: 'Hausaufgabe'
        });

        const error = hw.validateSync();

        expect(error.errors.subject).toBeDefined();
    });

    test('soll ohne date ungültig sein', () => {
        const hw = new Hw({
            subject: 'Mathematik',
            task_type: 'Hausaufgabe'
        });

        const error = hw.validateSync();

        expect(error.errors.date).toBeDefined();
    });

    test('soll ohne task_type ungültig sein', () => {
        const hw = new Hw({
            date: new Date(),
            subject: 'Mathematik'
        });

        const error = hw.validateSync();

        expect(error.errors.task_type).toBeDefined();
    });
});