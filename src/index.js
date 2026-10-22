import Game from './game.js';
import { placeRandomFleet } from './placement.js';
import { renderBoard, addAttackListener, renderFleet } from './dom.js';

let isPlayerTurn = true;

// 1. Creamos la partida y colocamos los barcos
const game = new Game();
placeRandomFleet(game.player1.gameboard);
placeRandomFleet(game.player2.gameboard);

// 2. Buscamos los elementos del HTML
const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const playerFleetEl = document.getElementById('player-fleet');
const enemyFleetEl = document.getElementById('enemy-fleet');

// 3. Pintamos los tableros y las flotas por primera vez
renderBoard(game.player1.gameboard, playerBoardEl);
renderBoard(game.player2.gameboard, enemyBoardEl, true);
renderFleet(game.player1.gameboard, playerFleetEl);
renderFleet(game.player2.gameboard, enemyFleetEl);

// 4. Mensaje inicial
statusEl.textContent = '¡Tu turno! Haz clic en el radar enemigo.';

// 5. Lógica del botón de reinicio
restartBtn.addEventListener('click', () => {
    window.location.reload();
});

// 6. Lógica de ataque del jugador
function onPlayerAttack(coords) {
    if (!isPlayerTurn) return; 
    isPlayerTurn = false;

    const result = game.attack(coords);

    // Si disparó a una casilla ya atacada, le devolvemos el turno
    if (result === 'invalid') {
        isPlayerTurn = true; 
        return;
    }

    // Repintamos el radar enemigo y su flota
    renderBoard(game.player2.gameboard, enemyBoardEl, true);
    renderFleet(game.player2.gameboard, enemyFleetEl);

    // Mostramos el resultado
    if (result === 'miss') statusEl.textContent = '¡Agua! 💧';
    if (result === 'hit') statusEl.textContent = '¡Tocado! 💥';
    if (result === 'sunk') statusEl.textContent = '¡Hundido! 💀';

    // ¿Victoria?
    if (game.isOver()) {
        statusEl.textContent = '¡Has ganado! 🎉';
        restartBtn.classList.remove('hidden');
        return;
    }

    // Turno de la IA
    setTimeout(() => {
        statusEl.textContent = 'Turno del enemigo...';
        
        game.computerAttack();
        
        // Repintamos tu tablero y tu flota
        renderBoard(game.player1.gameboard, playerBoardEl);
        renderFleet(game.player1.gameboard, playerFleetEl);

        // ¿Derrota?
        if (game.isOver()) {
            statusEl.textContent = '¡Has perdido! 💥';
            restartBtn.classList.remove('hidden');
            return;
        }

        // Volvemos a tu turno
        isPlayerTurn = true;
        statusEl.textContent = 'Tu turno';
    }, 1000); 
}

// 7. Conectamos los clics del radar enemigo
addAttackListener(enemyBoardEl, onPlayerAttack);