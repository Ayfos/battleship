export function renderBoard(gameboard, container, hideShips = false) {
    container.innerHTML = ''; 

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

export function renderFleet(gameboard, container) {
    container.innerHTML = ''; 

    gameboard.ships.forEach(ship => {
        const shipEl = document.createElement('div');
        shipEl.classList.add('fleet-ship');
        shipEl.style.width = `${ship.length * 20}px`;
        
        if (ship.isSunk()) {
            shipEl.classList.add('sunk');
        }
        container.appendChild(shipEl);
    });
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

export function addHoverListener(container, onHover, onLeave) {
    container.addEventListener('mouseover', (event) => {
        if (event.target.tagName !== 'TD') return;
        const x = Number(event.target.dataset.x);
        const y = Number(event.target.dataset.y);
        onHover([x, y]);
    });

    container.addEventListener('mouseout', (event) => {
        if (event.target.tagName !== 'TD') return;
        onLeave();
    });
}

export function addPlacementListener(container, onPlace) {
    container.addEventListener('click', (event) => {
        if (event.target.tagName !== 'TD') return;
        const x = Number(event.target.dataset.x);
        const y = Number(event.target.dataset.y);
        onPlace([x, y]);
    });
}