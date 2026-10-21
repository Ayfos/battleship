import Game from '../src/game.js';
import Ship from '../src/ship.js';

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
    test('un ataque de player1 impacta en el tablero de player2', () => {
        const game = new Game();
        game.attack([0, 0]);
        expect(game.player2.gameboard.missedAttacks).toContainEqual([0, 0]);
        expect(game.player1.gameboard.missedAttacks.length).toBe(0);
    });

    test('isOver es true cuando todos los barcos del currentPlayer están hundidos', () => {
        const game = new Game();
        const ship = new Ship(1);
        game.player2.gameboard.placeShip(ship, [0, 0], 'horizontal');
        game.player2.gameboard.receiveAttack([0, 0]);
        game.currentPlayer = game.player2;
        expect(game.isOver()).toBe(true);
    });
});