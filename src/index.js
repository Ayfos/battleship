import Game from './game.js';
import { placeRandomFleet } from './placement.js';
import { renderBoard, addAttackListener, renderFleet, addPlacementListener } from './dom.js';
import Ship from './ship.js';

// 1. Variables de estado del juego
let gameStarted = false;
let isPlayerTurn = false;

// 2. Creamos la partida
const game = new Game();
placeRandomFleet(game.player2.gameboard); // La IA coloca sus barcos

// 3. Variables para la colocación manual
const shipLengthsToPlace = [5, 4, 3, 3, 2];
let currentShipIndex = 0;
let currentOrientation = 'horizontal';

// 4. Buscamos los elementos del HTML
const playerBoardEl = document.getElementById('player-board');
const enemyBoardEl = document.getElementById('enemy-board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const playerFleetEl = document.getElementById('player-fleet');
const enemyFleetEl = document.getElementById('enemy-fleet');

// Los botones
const placementControlsEl = document.getElementById('placement-controls');
const rotateBtn = document.getElementById('rotate-btn');
const randomPlaceBtn = document.getElementById('random-place-btn');
const resetPlacementBtn = document.getElementById('reset-placement-btn');
const startBtn = document.getElementById('start-btn');

// 5. Pintamos los tableros iniciales
renderBoard(game.player1.gameboard, playerBoardEl);
renderBoard(game.player2.gameboard, enemyBoardEl, true);
renderFleet(game.player1.gameboard, playerFleetEl);
renderFleet(game.player2.gameboard, enemyFleetEl);

// 6. Iniciamos la fase de preparación
startPlacementPhase();

function startPlacementPhase() {
    gameStarted = false;
    isPlayerTurn = false;
    currentShipIndex = 0;
    currentOrientation = 'horizontal';
    
    placementControlsEl.classList.remove('hidden');
    startBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
    
    updatePlacementMessage();
}

function updatePlacementMessage() {
    if (currentShipIndex < shipLengthsToPlace.length) {
        const length = shipLengthsToPlace[currentShipIndex];
        statusEl.textContent = `Coloca tu barco de longitud ${length}. (Clic en tablero o Aleatorio)`;
    }
}

// Lógica del botón Rotar
rotateBtn.addEventListener('click', () => {
    currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    rotateBtn.textContent = `Rotar (${currentOrientation === 'horizontal' ? 'Horizontal' : 'Vertical'})`;
});

// Lógica del botón Aleatorio
randomPlaceBtn.addEventListener('click', () => {
    const length = shipLengthsToPlace[currentShipIndex];
    const ship = new Ship(length);
    
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        
        placed = game.player1.gameboard.placeShip(ship, [x, y], orientation);
        attempts++;
    }

    renderBoard(game.player1.gameboard, playerBoardEl);
    renderFleet(game.player1.gameboard, playerFleetEl);

    currentShipIndex++;
    advancePlacementPhase();
});

// Lógica del botón Volver a colocar (Reset)
resetPlacementBtn.addEventListener('click', () => {
    game.player1.gameboard.grid = []; 
    for (let i = 0; i < 10; i++) {
        const row = [];
        for (let j = 0; j < 10; j++) row.push(null);
        game.player1.gameboard.grid.push(row);
    }
    
    game.player1.gameboard.ships = [];
    game.player1.gameboard.attackedCells.clear();
    game.player1.gameboard.missedAttacks = [];

    currentShipIndex = 0;
    currentOrientation = 'horizontal';
    rotateBtn.textContent = 'Rotar (Horizontal)';

    renderBoard(game.player1.gameboard, playerBoardEl);
    renderFleet(game.player1.gameboard, playerFleetEl);
    updatePlacementMessage();
});

// Función que avanza al siguiente barco o inicia la partida
function advancePlacementPhase() {
    if (currentShipIndex < shipLengthsToPlace.length) {
        updatePlacementMessage();
    } else {
        statusEl.textContent = '¡Flota lista! Pulsa "Empezar partida".';
        placementControlsEl.classList.add('hidden');
        startBtn.classList.remove('hidden');
    }
}

// Lógica del botón Empezar partida
startBtn.addEventListener('click', () => {
    gameStarted = true;
    isPlayerTurn = true;
    startBtn.classList.add('hidden');
    statusEl.textContent = '¡Tu turno! Haz clic en el radar enemigo.';
});

// Lógica del botón de reinicio
restartBtn.addEventListener('click', () => {
    window.location.reload();
});

// Lógica de ataque del jugador
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

// --- LÓGICA DE COLOCACIÓN MANUAL ---
function onPlayerBoardClick(coords) {
    if (gameStarted) return; 
    if (currentShipIndex >= shipLengthsToPlace.length) return;

    const length = shipLengthsToPlace[currentShipIndex];
    const ship = new Ship(length);

    const placed = game.player1.gameboard.placeShip(ship, coords, currentOrientation);

    if (placed) {
        renderBoard(game.player1.gameboard, playerBoardEl);
        renderFleet(game.player1.gameboard, playerFleetEl);
        currentShipIndex++;
        advancePlacementPhase();
    } else {
        statusEl.textContent = '¡No cabe ahí! Prueba otra posición o rota el barco.';
        setTimeout(() => {
            if (!gameStarted && currentShipIndex < shipLengthsToPlace.length) {
                updatePlacementMessage();
            }
        }, 1500);
    }
}

// 7. Conectamos los clics (Ataque al enemigo y Colocación en tu tablero)
addAttackListener(enemyBoardEl, onPlayerAttack);
addPlacementListener(playerBoardEl, onPlayerBoardClick);