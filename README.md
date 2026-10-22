# ⚓ Battleship — Radar Naval

Un clásico juego de **Hundir la Flota** (Battleship) desarrollado como proyecto final del bloque de JavaScript de [The Odin Project](https://www.theodinproject.com/).

El juego enfrenta a un jugador humano contra una inteligencia artificial en una interfaz con estética de radar naval moderno.

## 🎮 Características

- **Preparación de flota:** coloca tus barcos manualmente haciendo clic en el tablero o usa el botón de colocación aleatoria. Puedes rotar los barcos entre horizontal y vertical.
- **Lógica de juego completa:** turnos alternos, validación de ataques repetidos y feedback visual (Agua, Tocado, Hundido).
- **Inteligencia Artificial:** la computadora elige coordenadas al azar respetando las reglas (no dispara dos veces al mismo sitio).
- **Feedback visual:** efectos de neón para los disparos, calaveras para los barcos hundidos y un panel de estado que muestra la flota restante de ambos jugadores.
- **Diseño inmersivo:** interfaz construida con CSS moderno (Glassmorphism, degradados radiales y efectos hover).
- **Juego completo:** opción de reiniciar la partida al ganar o perder.

## 🚀 Cómo ejecutarlo en local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Ayfos/battleship.git
   ```

2. Entra en la carpeta del proyecto:

   ```bash
   cd battleship
   
   ```

3. *(Opcional)* Instala las dependencias y ejecuta los tests:

   ```bash
   npm install
   npm test
   ```

4. Abre el archivo `index.html` en tu navegador (recomendado: usar **Live Server** de VS Code).

## 🧠 Lo que he aprendido

Este proyecto ha sido un punto de inflexión en mi aprendizaje. Me ha permitido:

- **Aplicar el ciclo TDD (Test-Driven Development)** de principio a fin: escribir el test que falla (🔴 ROJO), escribir el código mínimo para que pase (🟢 VERDE) y refactorizar. Todo el motor cuenta con **32 tests unitarios** con Jest.
- **Aislar la lógica de negocio de la manipulación del DOM.** Toda la lógica es pura y testeable, mientras que el DOM solo se encarga de pintar y escuchar eventos.
- **Usar `Set` sobre `Array`** para búsquedas eficientes (O(1)) en el registro de ataques, entendiendo cuándo es mejor cada estructura de datos.
- **Inyección de dependencias** para hacer el código testeable. Al pasar una función `random` falsa en los tests de la IA, conseguí que los tests fueran deterministas.
- **Diseñar una interfaz atractiva** usando CSS moderno, variables de color y efectos visuales (animaciones, sombras, cristal).
- **Organizar un proyecto profesional:** modularización de archivos, uso de Git con Conventional Commits, configuración de Jest y Babel para ESM.

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
| --- | --- |
| **JavaScript (ES6+)** | Clases, módulos ESM, `Set`, inyección de dependencias |
| **Jest** | Framework de testing para el ciclo TDD |
| **Babel** | Transformar ESM para que Jest lo entienda |
| **HTML5 y CSS3** | Maquetación y diseño visual (Flexbox, animaciones, Glassmorphism) |
| **Git** | Control de versiones con commits atómicos |

## 🧪 Tests

Para ejecutar la suite de tests (32 tests, 6 suites), usa el comando:

```bash
npm test
```

## 👨‍💻 Autor

**Ayfos**

- GitHub: [@Ayfos](https://github.com/Ayfos)

Proyecto desarrollado como parte del currículo de [The Odin Project](https://www.theodinproject.com/).