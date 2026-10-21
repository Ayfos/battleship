import Player from '../src/player.js';

describe('Player', () => {
    test('se crea con el tipo indicado', () => {
        const player = new Player('real');
        expect(player.type).toBe('real');
    });

    test('se crea con su propio tablero', () => {
        const player = new Player('real');
        expect(player.gameboard).toBeDefined();
    });
});