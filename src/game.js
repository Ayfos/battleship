import Player from './player.js';

class Game {
    constructor() {
        this.player1 = new Player('real');
        this.player2 = new Player('computer');
        this.currentPlayer = this.player1;
    }

    getOpponent() {
        return this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    attack(coords) {
        const opponent = this.getOpponent();
        opponent.gameboard.receiveAttack(coords);
        this.currentPlayer = opponent;
    }
}

export default Game;