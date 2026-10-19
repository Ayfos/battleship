import Ship from '../src/ship.js';

describe('Ship', () => {
    test('tiene la longitud correcta al crearse', () => {
        const ship = new Ship(3);
        expect(ship.length).toBe(3);
    });
});