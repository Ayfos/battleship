import Ship from '../src/ship.js';

describe('Ship', () => {
    test('tiene la longitud correcta al crearse', () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
    });

    test('incrementa los impactos al recibir un hit', () => {
        const ship = new Ship(3);
        ship.hit();
        expect(ship.hits).toBe(1);
    });
});