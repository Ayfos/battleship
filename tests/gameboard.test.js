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
});