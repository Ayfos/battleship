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
}

export default Gameboard;