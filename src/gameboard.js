class Gameboard {
    constructor() {
        this.grid = [];
        this.missedAttacks = [];
        this.ships = [];
        this.attackedCells = new Set();

        for (let i = 0; i < 10; i++) {
            const row = [];
            for (let j = 0; j < 10; j++) {
                row.push(null);
            }
            this.grid.push(row);
        }
    }

    placeShip(ship, startCoords, orientation) {
        const [startX, startY] = startCoords;

        // 1. Calcular todas las coordenadas que ocupará el barco ANTES de colocarlo
        const coords = [];
        for (let i = 0; i < ship.length; i++) {
            let x, y;
            if (orientation === 'horizontal') {
                x = startX;
                y = startY + i;
            } else {
                x = startX + i;
                y = startY;
            }
            coords.push([x, y]);
        }

        // 2. Validar: todas las coordenadas deben estar dentro del tablero
        for (const [x, y] of coords) {
            if (x < 0 || x > 9 || y < 0 || y > 9) {
                return false;   // se sale del tablero
            }
            if (this.grid[x][y] !== null) {
                return false; //celda ocupada para evitar solapamiento

            }
        }

        // 3. Colocar el barco (ya sabemos que cabe)
        this.ships.push(ship);
        for (const [x, y] of coords) {
            this.grid[x][y] = ship;
        }

        return true;   // colocado con éxito
    }

    receiveAttack([x, y]) {
        const key = `${x},${y}`; // <-- sin espacio

        if (this.attackedCells.has(key)) return;

        this.attackedCells.add(key);

        const target = this.grid[x][y];
        if (target === null) {
            this.missedAttacks.push([x, y]);
        } else {
            target.hit();
        }
    }

    allSunk() {
        return this.ships.length > 0 && this.ships.every(ship => ship.isSunk());
    }

}

export default Gameboard;