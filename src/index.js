console.log("1. El script empieza");

import Game from './game.js';
import { placeRandomFleet } from './placement.js';
import { renderBoard, addAttackListener } from './dom.js';

console.log("2. Los imports funcionan");

let isPlayerTurn = true;

const game = new Game();
console.log("3. La partida se ha creado");

placeRandomFleet(game.player1.gameboard);
placeRandomFleet(game.player2.gameboard);
console.log("4. Los barcos se han colocado");

const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');
console.log("5. Los elementos HTML se han encontrado");

renderBoard(game.player1.gameboard, playerBoardEl);
renderBoard(game.player2.gameboard, enemyBoardEl, true);
console.log("6. Los tableros se han pintado");

statusEl.textContent = '¡Tu turno! Haz clic en el radar enemigo.';
console.log("7. El texto se ha cambiado");

function onPlayerAttack(coords) {
    if (!isPlayerTurn) return; 
    isPlayerTurn = false;

    const result = game.attack(coords);

    if (result === 'invalid') {
        isPlayerTurn = true; 
        return;
    }

    renderBoard(game.player2.gameboard, enemyBoardEl, true);

    if (result === 'miss') statusEl.textContent = '¡Agua! 💧';
    if (result === 'hit') statusEl.textContent = '¡Tocado! 💥';
    if (result === 'sunk') statusEl.textContent = '¡Hundido! 💀';

    if (game.isOver()) {
        statusEl.textContent = '¡Has ganado! 🎉';
        return;
    }

    setTimeout(() => {
        statusEl.textContent = 'Turno del enemigo...';
        
        game.computerAttack();
        renderBoard(game.player1.gameboard, playerBoardEl);

        if (game.isOver()) {
            statusEl.textContent = '¡Has perdido! 💥';
            return;
        }

        isPlayerTurn = true;
        statusEl.textContent = 'Tu turno';
    }, 1000); 
}

addAttackListener(enemyBoardEl, onPlayerAttack);
console.log("8. Todo listo para jugar");