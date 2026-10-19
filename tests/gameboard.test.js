import Gameboard from '../src/gameboard.js';

describe('Gameboard', () => {
    test('se crea con un tablero de 10x10 lleno de nulls', () => {
        const board = new Gameboard();
        expect(board.grid.length).toBe(10);       // 10 filas
        expect(board.grid[0].length).toBe(10);    // 10 columnas
        expect(board.grid[0][0]).toBe(null);      // celda vacía al inicio
    });
});