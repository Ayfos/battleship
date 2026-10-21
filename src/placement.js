import Ship from "./ship.js";

export function placeRandomFleet(gameboard) {
    const shipLengths = [5, 4, 3, 3, 2];

    for (const length of shipLengths) {
        const ship = new Ship(length);
        let placed = false;

        while (!placed) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

            placed = gameboard.placeShip(ship, [x, y], orientation);
        }
    }
}
