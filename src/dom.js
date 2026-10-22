export function renderBoard(gameboard, container, hideShips = false) {
    container.innerHTML = '';   // limpia el contenido previo bueno para renderizar

    const table = document.createElement('table');
    table.classList.add('board-table');

    for (let x = 0; x < 10; x++) {
        const row = document.createElement('tr');
        for (let y = 0; y < 10; y++) {
            const cell = document.createElement('td');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;

            const ship = gameboard.grid[x][y];
            const attacked = gameboard.attackedCells.has(`${x},${y}`);

            if (ship && attacked) {
                cell.classList.add('cell--hit');
            } else if (ship && !hideShips) {
                cell.classList.add('cell--ship');
            } else if (attacked) {
                cell.classList.add('cell--miss');
            } else {
                cell.classList.add('cell--water');
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    }


    container.appendChild(table);
}

export function addAttackListener(container, onAttack) {
    container.addEventListener('click', (event) => {
        if (event.target.tagName !== 'TD') return;

        const cell = event.target;
        const x = Number(cell.dataset.x);
        const y = Number(cell.dataset.y);

        onAttack([x, y]);
    });
}

export function renderFleet(gameboard, container) {
    container.innerHTML = ''; // Limpiamos el panel

    // Recorremos los barcos del tablero
    gameboard.ships.forEach(ship => {
        const shipEl = document.createElement('div');
        shipEl.classList.add('fleet-ship');
        
        // El ancho del barquito depende de su longitud (ej: 15px por cada celda)
        shipEl.style.width = `${ship.length * 20}px`;
        
        // Si el barco está hundido, le añadimos la clase CSS
        if (ship.isSunk()) {
            shipEl.classList.add('sunk');
        }

        container.appendChild(shipEl);
    });
}