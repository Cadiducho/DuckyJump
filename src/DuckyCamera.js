import {xCamara, yCamara, zCamara, spawnPos} from "./settings.js";

export class DuckyCamera extends THREE.PerspectiveCamera {

    constructor(scene, renderer) {
        super(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene = scene;
        this.renderer = renderer;

        this.position.set(spawnPos.x + xCamara, yCamara, spawnPos.z + zCamara); // algo isométrico es
        this.lookAt(spawnPos.x, spawnPos.y, spawnPos.z); // Se crea la cámara mirando a dónde aparecerá el pato
        this.anteriorXCreado = spawnPos.x;
    }

    update() {
        this.adelantarCamara();
    }

    adelantarCamara() {
        let duckPosition = this.scene.world.jugador.position;
        let newPosition = new THREE.Vector3(duckPosition.x + xCamara, yCamara, duckPosition.z + zCamara);
        let nuevaX = duckPosition.x + xCamara;
        //console.log("Deberia moverme a : " + (spawnPos.x + this.scene.game.tiempoJugado));
        let deberiaAvanzarA = Math.max(xCamara, (spawnPos.x + (this.scene.game.tiempoJugado - 10)) * 0.8);
        if (deberiaAvanzarA > nuevaX) {
            //console.log("Cambiando a donde debería avanzar " + deberiaAvanzarA);
            newPosition.x = deberiaAvanzarA;
        }

        new TWEEN.Tween(this.position)
            .to(newPosition, 200)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();


        //console.log("Anterior: " + this.anteriorXCreado);

        if (this.anteriorXCreado < (this.position.x + 15)) {
            let nuevasCreadas = 0;
            while (nuevasCreadas < 20) {
                this.scene.world.crearNuevaFila();
                ++nuevasCreadas;
            }
            this.anteriorXCreado = ((this.position.x + 15) + nuevasCreadas);
            //console.log(this.position.x + 15 + nuevasCreadas);
        }

    }
}