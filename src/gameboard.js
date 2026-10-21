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
        this.ships.push(ship);

        for (let i = 0; i < ship.length; i++) {
            let x, y;
            if (orientation === 'horizontal') {
                x = startX;
                y = startY + i;
            } else {
                x = startX + i;
                y = startY;
            }
            this.grid[x][y] = ship;
        }
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