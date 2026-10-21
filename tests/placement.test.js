import Gameboard from '../src/gameboard.js';
import { placeRandomFleet } from '../src/placement.js';

describe('placeRandomFleet', () => {
    test('coloca 5 barcos en un tablero vacío', () => {
        const board = new Gameboard();
        placeRandomFleet(board);
        expect(board.ships.length).toBe(5);
    });

    test('coloca los barcos en un tablero sin errores', () => {
        const board = new Gameboard();
        placeRandomFleet(board);

        // Cada barco debe estar en al menos una celda del grid
        for (const ship of board.ships) {
            let found = false;
            for (let x = 0; x < 10; x++) {
                for (let y = 0; y < 10; y++) {
                    if (board.grid[x][y] === ship) {
                        found = true;
                    }
                }
            }
            expect(found).toBe(true);
        }
    });
});