import Game from '../src/game.js';

describe('Game', () => {
    test('se crea con dos jugadores y empieza el jugador real', () => {
        const game = new Game();
        expect(game.player1.type).toBe('real');
        expect(game.player2.type).toBe('computer');
        expect(game.currentPlayer).toBe(game.player1);
    });

    test('el turno cambia después de un ataque', () => {
        const game = new Game();
        game.attack([0, 0]);
        expect(game.currentPlayer).toBe(game.player2);
    });
});