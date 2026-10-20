class Gameboard {
    constructor() {
        this.grid = [];  //aquí van las filas
        this.missedAttacks = [];
        for(let i = 0; i < 10; i++) {            // 10 filas 
            const row = [];                  // creamos una fila vacía
            for(let j = 0; j < 10; j++) {         // 10 columnas en cada fila
                row.push(null);
            }
            this.grid.push(row);     // añadimos la fila al grid
        }
    }

    placeShip(ship, startCoords, orientation) {
        const [startX, startY] = startCoords;

        for (let i = 0; i < ship.length; i++ ) {
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
        const target = this.grid[x][y];

        if(target === null) {
            this.missedAttacks.push([x, y]);
        }else {
            target.hit();
        }
    }
}

export default Gameboard;