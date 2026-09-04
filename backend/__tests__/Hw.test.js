const Hw = require('../models/Hw');

describe('Hw Model', () => {
    // Tests whether a homework task is valid when all required fields are provided.
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

    // Tests whether validation fails when the required subject field is missing.
    test('soll ohne subject ungültig sein', () => {
        const hw = new Hw({
            date: new Date(),
            task_type: 'Hausaufgabe'
        });

        const error = hw.validateSync();

        expect(error.errors.subject).toBeDefined();
    });

    // Tests whether validation fails when the required date field is missing.
    test('soll ohne date ungültig sein', () => {
        const hw = new Hw({
            subject: 'Mathematik',
            task_type: 'Hausaufgabe'
        });

        const error = hw.validateSync();

        expect(error.errors.date).toBeDefined();
    });

    // Tests whether validation fails when the required task type is missing.      
    test('soll ohne task_type ungültig sein', () => {
        const hw = new Hw({
            date: new Date(),
            subject: 'Mathematik'
        });

        const error = hw.validateSync();

        expect(error.errors.task_type).toBeDefined();
    });

    // Tests whether notes are optional and the homework task remains valid without them.
    test('soll ohne notes gültig sein', () => {
        const hw = new Hw({
            date: new Date(),
            subject: 'Mathematik',
            task_type: 'Hausaufgabe'
        });

        const error = hw.validateSync();

        expect(error).toBeUndefined();
    });

    // Tests whether the model stores all provided values correctly.
    test('soll die angegebenen Werte korrekt übernehmen', () => {
        const date = new Date('2026-09-10');

        const hw = new Hw({
            date: date,
            subject: 'Datenbanken',
            task_type: 'Prüfung',
            notes: 'SQL lernen'
        });

        expect(hw.subject).toBe('Datenbanken');
        expect(hw.task_type).toBe('Prüfung');
        expect(hw.notes).toBe('SQL lernen');
        expect(hw.date).toEqual(date);
    });
});