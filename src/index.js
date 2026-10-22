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

// 2. Primer pintado
renderBoard(game.player1.gameboard, playerBoardEl);
renderBoard(game.player2.gameboard, enemyBoardEl, true);
statusEl.textContent = `Coloca tu barco de longitud ${shipsToPlace[0]}.`;

// --- AUDIO (Web Audio API) ---
function playSound(type) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'miss') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
    }
}

// --- CONTROLES DE COLOCACIÓN ---
rotateBtn.addEventListener('click', () => {
    currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    rotateBtn.textContent = `Rotar (${currentOrientation === 'horizontal' ? 'Horizontal' : 'Vertical'})`;
    clearPreview();
});

randomBtn.addEventListener('click', () => {
    placeRandomFleet(game.player1.gameboard);
    renderBoard(game.player1.gameboard, playerBoardEl);
    renderFleet(game.player1.gameboard, playerFleetEl);
    startBattle();
});

function clearPreview() {
    currentPreview.forEach(([x, y]) => {
        const cell = playerBoardEl.querySelector(`td[data-x="${x}"][data-y="${y}"]`);
        if (cell) cell.classList.remove('cell--preview', 'cell--invalid');
    });
    currentPreview = [];
}

// Hover
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

// Colocación
addPlacementListener(playerBoardEl, (coords) => {
    if (!isPlacing || currentShipIndex >= shipsToPlace.length) return;
    const length = shipsToPlace[currentShipIndex];
    const ship = new Ship(length);
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

// --- BATALLA ---
function startBattle() {
    isPlacing = false;
    gameStarted = true;
    isPlayerTurn = true;
    
    placeRandomFleet(game.player2.gameboard);
    placementControls.classList.add('hidden');
    
    renderBoard(game.player1.gameboard, playerBoardEl);
    renderBoard(game.player2.gameboard, enemyBoardEl, true);
    renderFleet(game.player2.gameboard, enemyFleetEl);

    statusEl.textContent = '¡Tu turno! Haz clic en el radar enemigo.';
}

restartBtn.addEventListener('click', () => window.location.reload());

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

    if (result === 'miss') { statusEl.textContent = '¡Agua! 💧'; playSound('miss'); }
    if (result === 'hit') { statusEl.textContent = '¡Tocado! 💥'; playSound('hit'); }
    if (result === 'sunk') { statusEl.textContent = '¡Hundido! 💀'; playSound('hit'); }

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
        
        // Aquí podríamos añadir el sonido del enemigo también

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