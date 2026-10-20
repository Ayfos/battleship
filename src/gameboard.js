class Gameboard {
    constructor() {
        this.grid = [];  //aquí van las filas
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
}

export default Gameboard;