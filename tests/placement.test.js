import Gameboard from '../src/gameboard.js';
import { placeRandomFleet } from '../src/placement.js';

describe('placeRandomFleet', () => {
    test('coloca 5 barcos en un tablero vacío', () => {
        const board = new Gameboard();
        placeRandomFleet(board);
        expect(board.ships.length).toBe(5);
    });
});