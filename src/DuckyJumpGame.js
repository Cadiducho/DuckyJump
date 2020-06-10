import {DuckyScene} from "./DuckyScene.js";
import {DuckyDuck} from "./DuckyDuck.js";
import {MovementType} from "./DuckyDuck.js";

/**
 * Clase principal del juego que creará la escena a renderizar y se enlazará al html
 */
export class DuckyJumpGame {

    constructor() {
        this.scene = new DuckyScene(this, "#WebGL-output");

        this.initializeGame();
    }

    initializeGame() {
        this.tiempoJugado = 0;
        this.player = new DuckyDuck(this.scene);
        this.scene.world.addPlayer(this.player);

        setInterval(() => this.tick(), 1000);
    }

    /**
     * Update del navegador
     */
    update () {
        // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
        // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
        requestAnimationFrame(() => this.update());

        // Actualizar el resto de cosas

        //--------
        TWEEN.update();
        this.scene.update();
    }

    /**
     * Método que se ejecuta cada segundo
     */
    tick() {
        this.tiempoJugado++;
        this.player.tick();
    }
}

let game;
/// La función   main
$(function () {
    game = new DuckyJumpGame();

    // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
    window.addEventListener ("resize", () => game.scene.onWindowResize());

    // Que no se nos olvide, la primera visualización.
    game.update();
});


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode === 87 || keyCode === 38) { // W o o flecha arriba
        game.player.onMove(MovementType.ADELANTE);
    } else if (keyCode === 83 || keyCode === 40) { // S o flecha abajo
        game.player.onMove(MovementType.DETRAS);
    } else if (keyCode === 65 || keyCode === 37) { // D o <-
        game.player.onMove(MovementType.IZQUIERDA);
    } else if (keyCode === 68 || keyCode === 39) { // A o ->
        game.player.onMove(MovementType.DERECHA);
    } else if (keyCode === 32) { // Espacio
        game.player.morir();
    }
}

