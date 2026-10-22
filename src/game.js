import Player from './player.js';

class Game {
    constructor(randomFn = Math.random) {
        this.randomFn = randomFn;
        this.player1 = new Player('real');
        this.player2 = new Player('computer');
        this.currentPlayer = this.player1;
    }

    getOpponent() {
        return this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    attack(coords) {
        const opponent = this.getOpponent();
        const result = opponent.gameboard.receiveAttack(coords); // guardamos el resultado
        this.currentPlayer = opponent;
        return result; // lo devolvemos
    }

    isOver() {
        return this.currentPlayer.gameboard.allSunk();
    }

    computerAttack() {
        let x, y, key;
        let attempts = 0;

        do {
            x = Math.floor(this.randomFn() * 10);
            y = Math.floor(this.randomFn() * 10);
            key = `${x},${y}`;
            attempts++;

            if (attempts > 1000) {
                // Safety: si no encuentra coordenada legal, no ataca.
                return;
            }
        } while (this.getOpponent().gameboard.attackedCells.has(key));

        this.attack([x, y]);
    }
}

export default Game;