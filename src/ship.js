class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    hit() {
        this.hits += 1;  // Tocado, marcador que incrementa 1 a 1
    }

    isSunk() {
        return this.hits >= this.length;
    }

}

export default Ship; 
