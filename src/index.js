import Game from './game.js';
import Ship from './ship.js';
import { placeRandomFleet } from './placement.js';
import { renderBoard, addAttackListener, renderFleet, addHoverListener, addPlacementListener } from './dom.js';

// --- ESTADO DEL JUEGO ---
let isPlayerTurn = false; 
let gameStarted = false;  
let isPlacing = true;     

// --- ESTADO DE COLOCACIÓN MANUAL ---
const shipsToPlace = [5, 4, 3, 3, 2];
let currentShipIndex = 0;
let currentOrientation = 'horizontal';
let currentPreview = []; 

// 1. Elementos HTML
const game = new Game();
const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const rotateBtn = document.getElementById('rotate-btn');
const randomBtn = document.getElementById('random-btn');
const placementControls = document.getElementById('placement-controls');
const playerFleetEl = document.getElementById('player-fleet');
const enemyFleetEl = document.getElementById('enemy-fleet');

// 2. Primer pintado (todo vacío)
renderBoard(game.player1.gameboard, playerBoardEl);
renderBoard(game.player2.gameboard, enemyBoardEl, true);
statusEl.textContent = `Coloca tu barco de longitud ${shipsToPlace[0]}.`;

// --- CONTROLES DE COLOCACIÓN ---

// Botón Rotar
rotateBtn.addEventListener('click', () => {
    currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    rotateBtn.textContent = `Rotar (${currentOrientation === 'horizontal' ? 'Horizontal' : 'Vertical'})`;
    clearPreview();
});

// Botón Aleatorio
randomBtn.addEventListener('click', () => {
    // Colocamos aleatoriamente en el jugador
    placeRandomFleet(game.player1.gameboard);
    // Pintamos y flota
    renderBoard(game.player1.gameboard, playerBoardEl);
    renderFleet(game.player1.gameboard, playerFleetEl);
    // Pasamos a la batalla
    startBattle();
});

// Función para limpiar la previsualización
function clearPreview() {
    currentPreview.forEach(([x, y]) => {
        const cell = playerBoardEl.querySelector(`td[data-x="${x}"][data-y="${y}"]`);
        if (cell) cell.classList.remove('cell--preview', 'cell--invalid');
    });
    currentPreview = [];
}

// Hover (previsualización)
addHoverListener(playerBoardEl, (coords) => {
    if (!isPlacing || currentShipIndex >= shipsToPlace.length) return;
    
    clearPreview();
    const [startX, startY] = coords;
    const length = shipsToPlace[currentShipIndex];
    const cells = [];

    for (let i = 0; i < length; i++) {
        const x = currentOrientation === 'horizontal' ? startX : startX + i;
        const y = currentOrientation === 'horizontal' ? startY + i : startY;
        if (x > 9 || y > 9) break; 
        cells.push([x, y]);
    }

    const isValid = cells.length === length;

    cells.forEach(([x, y]) => {
        const cell = playerBoardEl.querySelector(`td[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.classList.add(isValid ? 'cell--preview' : 'cell--invalid');
            currentPreview.push([x, y]);
        }
    });
}, clearPreview);

// Clic para colocar barco
addPlacementListener(playerBoardEl, (coords) => {
    if (!isPlacing || currentShipIndex >= shipsToPlace.length) return;

    const length = shipsToPlace[currentShipIndex];
    const ship = new Ship(length);
    
    // Intentamos colocar
    const success = game.player1.gameboard.placeShip(ship, coords, currentOrientation);

    if (success) {
        renderBoard(game.player1.gameboard, playerBoardEl);
        renderFleet(game.player1.gameboard, playerFleetEl);
        currentShipIndex++;
        clearPreview();

        if (currentShipIndex >= shipsToPlace.length) {
            startBattle();
        } else {
            statusEl.textContent = `Coloca tu barco de longitud ${shipsToPlace[currentShipIndex]}.`;
        }
    } else {
        statusEl.textContent = '¡No cabe ahí! Prueba en otra posición.';
    }
});

// --- LÓGICA DE BATALLA ---

function startBattle() {
    isPlacing = false;
    gameStarted = true;
    isPlayerTurn = true;
    
    // Colocamos los barcos del enemigo (aleatorio)
    placeRandomFleet(game.player2.gameboard);
    
    // Ocultamos controles de colocación
    placementControls.classList.add('hidden');
    
    // Repintamos todo
    renderBoard(game.player1.gameboard, playerBoardEl);
    renderBoard(game.player2.gameboard, enemyBoardEl, true);
    renderFleet(game.player2.gameboard, enemyFleetEl);

    statusEl.textContent = '¡Tu turno! Haz clic en el radar enemigo.';
}

// Botón de reinicio
restartBtn.addEventListener('click', () => window.location.reload());

// Ataque del jugador
function onPlayerAttack(coords) {
    if (!gameStarted || !isPlayerTurn) return;
    isPlayerTurn = false;

    const result = game.attack(coords);

    if (result === 'invalid') {
        isPlayerTurn = true; 
        return;
    }

    renderBoard(game.player2.gameboard, enemyBoardEl, true);
    renderFleet(game.player2.gameboard, enemyFleetEl);

    if (result === 'miss') statusEl.textContent = '¡Agua! 💧';
    if (result === 'hit') statusEl.textContent = '¡Tocado! 💥';
    if (result === 'sunk') statusEl.textContent = '¡Hundido! 💀';

    if (game.isOver()) {
        statusEl.textContent = '¡Has ganado! 🎉';
        restartBtn.classList.remove('hidden');
        return;
    }

    // Turno de la IA
    setTimeout(() => {
        statusEl.textContent = 'Turno del enemigo...';
        game.computerAttack();
        renderBoard(game.player1.gameboard, playerBoardEl);
        renderFleet(game.player1.gameboard, playerFleetEl);

        if (game.isOver()) {
            statusEl.textContent = '¡Has perdido! 💥';
            restartBtn.classList.remove('hidden');
            return;
        }

        isPlayerTurn = true;
        statusEl.textContent = 'Tu turno';
    }, 1000); 
}

addAttackListener(enemyBoardEl, onPlayerAttack);