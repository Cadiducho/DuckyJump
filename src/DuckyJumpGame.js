import {DuckyScene} from "./DuckyScene.js";
import {DuckyDuck} from "./DuckyDuck.js";

/**
 * Clase principal del juego que creará la escena a renderizar y se enlazará al hmtl
 */
export class DuckyJumpGame {

    constructor() {
        this.scene = new DuckyScene("#WebGL-output");

        this.initializeGame();
    }

    initializeGame() {
        this.player = new DuckyDuck(this.scene);
        this.scene.world.add(this.player);
    }

    update () {
        // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
        // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
        requestAnimationFrame(() => this.update());

        // Actualizar el resto de cosas

        //--------

        this.scene.update();
    }
}

/// La función   main
$(function () {
    let game = new DuckyJumpGame();

    // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
    window.addEventListener ("resize", () => game.scene.onWindowResize());

    // Que no se nos olvide, la primera visualización.
    game.update();
});
