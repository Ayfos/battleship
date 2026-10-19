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

    test('no está hundido al crearse', () => {
        const ship = new Ship(3);
        expect(ship.isSunk()).toBe(false);
    });

    test('un barco recibe impacto con su longitud', () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        ship.hit(); // 3 impactos para un barco de longitud 3
        expect(ship.isSunk()).toBe(true);
    });

    test('sigue hundido si recibe más impactos de su longitud', () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit(); // 4 impactos, más que su longitud
        expect(ship.isSunk()).toBe(true);
    });
});