import Gameboard from '../src/gameboard.js';
import Ship from '../src/ship.js';

describe('Gameboard', () => {
    test('se crea con un tablero de 10x10 lleno de nulls', () => {
        const board = new Gameboard();
        expect(board.grid.length).toBe(10);
        expect(board.grid[0].length).toBe(10);
        expect(board.grid[0][0]).toBe(null);
    });

    test('coloca un barco horizontal en las coordenadas correctas', () => {
        const board = new Gameboard();
        const ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'horizontal');
        expect(board.grid[0][0]).toBe(ship);
        expect(board.grid[0][1]).toBe(ship);
        expect(board.grid[0][2]).toBe(ship);
    });

    test('coloca un barco vertical en las coordenadas correctas', () => {
        const board = new Gameboard();
        const ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'vertical');
        expect(board.grid[0][0]).toBe(ship);
        expect(board.grid[1][0]).toBe(ship);
        expect(board.grid[2][0]).toBe(ship);
    });
    test('registra un ataque fallido en el agua', () => {
        const board = new Gameboard();
        board.receiveAttack([0, 0]);
        expect(board.missedAttacks).toContainEqual([0, 0]);
    });
    test('atacar un barco le suma un impacto', () => {
        const board = new Gameboard();
        const ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'horizontal');
        board.receiveAttack([0, 0]);
        expect(ship.hits).toBe(1);
    });

    test('devuelve true cuando todos los barcos están hundidos', () => {
        const board = new Gameboard();
        const ship = new Ship(2);
        board.placeShip(ship, [0, 0], 'horizontal');
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        expect(board.allSunk()).toBe(true);
    });

    test('devuelve false si algún barco sigue a flote', () => {
        const board = new Gameboard();
        const ship1 = new Ship(2);
        const ship2 = new Ship(2);
        board.placeShip(ship1, [0, 0], 'horizontal');
        board.placeShip(ship2, [5, 5], 'horizontal');

        // Hundimos solo ship1
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);

        // ship2 sigue a flote → allSunk() debe ser false
        expect(board.allSunk()).toBe(false);
    });
});