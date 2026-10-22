import Game from './game.js';
import { placeRandomFleet } from './placement.js';
import { renderBoard, addAttackListener } from './dom.js';

// 1. Creamos la partida
const game = new Game();

// 2. Colocamos los barcos aleatoriamente en ambos tableros
placeRandomFleet(game.player1.gameboard);
placeRandomFleet(game.player2.gameboard);

// 3. Buscamos los elementos del HTML
const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');

// 4. Pintamos los tableros por primera vez
renderBoard(game.player1.gameboard, playerBoardEl);
renderBoard(game.player2.gameboard, enemyBoardEl, true);

// 5. Función que se ejecuta cuando el jugador hace clic en el tablero enemigo
function onPlayerAttack(coords) {
    // El jugador ataca
    game.attack(coords);
    renderBoard(game.player2.gameboard, enemyBoardEl, true); // Repintamos el tablero enemigo

    // ¿Hemos ganado?
    if (game.isOver()) {
        statusEl.textContent = '¡Has ganado! 🎉';
        return; // Cortamos la ejecución aquí
    }

    // Si no hemos ganado, le toca a la IA
    statusEl.textContent = 'Turno del enemigo...';

    setTimeout(() => {
        game.computerAttack(); // La IA ataca
        renderBoard(game.player1.gameboard, playerBoardEl); // Repintamos tu tablero

        // ¿Hemos perdido?
        if (game.isOver()) {
            statusEl.textContent = '¡Has perdido! 💥';
            return;
        }

        statusEl.textContent = 'Tu turno'; // Volvemos a tu turno
    }, 800); // Espera 800 milisegundos (0.8 segundos) antes de que ataque la IA
}

// 6. Activamos los clics en el tablero enemigo
addAttackListener(enemyBoardEl, onPlayerAttack);

// 7. Mensaje inicial
statusEl.textContent = 'Tu turno';