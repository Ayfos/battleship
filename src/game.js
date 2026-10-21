import Player from './player.js';

class Game {
    constructor() {
        this.player1 = new Player('real');
        this.player2 = new Player('computer');
        this.currentPlayer = this.player1;
    }
}

export default Game;