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

    test('isOver es false si el currentPlayer tiene barcos a flote', () => {
        const game = new Game();
        const ship = new Ship(2);
        game.player2.gameboard.placeShip(ship, [0, 0], 'horizontal');
        game.player2.gameboard.receiveAttack([0, 0]); // solo 1 hit de 2
        game.currentPlayer = game.player2;
        expect(game.isOver()).toBe(false);
    });

    test('computerAttack ataca una coordenada válida', () => {
        const fakeRandom = () => 0; // siempre devuelve 0
        const game = new Game(fakeRandom);
        game.currentPlayer = game.player2;

        game.computerAttack();

        // Con fakeRandom() = 0, la coordenada calculada será [0, 0]
        expect(game.player1.gameboard.attackedCells.has('0,0')).toBe(true);
    });

    test('computerAttack reintenta si la primera coordenada ya fue atacada', () => {
        // fakeRandom: 0.5, 0.5 → coord [5, 5]
        // luego 0.5, 0.5 → coord [5, 5] (ya atacada)
        // luego 0.1, 0.2 → coord [1, 2] (libre)
        const values = [0.5, 0.5, 0.5, 0.5, 0.1, 0.2];
        let i = 0;
        const fakeRandom = () => values[i++];

        const game = new Game(fakeRandom);
        game.currentPlayer = game.player2;

        // Primer ataque: 5,5
        game.computerAttack();
        game.currentPlayer = game.player2;

        // Segundo ataque: debería reintentar (5,5) y atacar 1,2
        game.computerAttack();

        expect(game.player1.gameboard.attackedCells.has('5,5')).toBe(true);
        expect(game.player1.gameboard.attackedCells.has('1,2')).toBe(true);
        expect(game.player1.gameboard.attackedCells.size).toBe(2);
    });
});