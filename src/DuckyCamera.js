import {xCamara, yCamara, zCamara, spawnPos} from "./settings.js";

export class DuckyCamera extends THREE.PerspectiveCamera {

    constructor(renderer) {
        super(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = renderer;

        this.position.set(spawnPos.x + xCamara, yCamara, spawnPos.z + zCamara); // algo isométrico es
        this.lookAt(spawnPos.x, spawnPos.y, spawnPos.z); // Se crea la cámara mirando a dónde aparecerá el pato
    }

    followDuck(duckPosition) {
        //console.log("[Debug] Moviendo cámara de " + JSON.stringify(this.position));
        let newPosition = new THREE.Vector3(duckPosition.x + xCamara, yCamara, duckPosition.z + zCamara);
        new TWEEN.Tween(this.position)
            .to(newPosition, 600) // voy siguiendo la posicion del pato
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .start();
        //console.log("[Debug] look at a " + JSON.stringify(duckPosition));
    }

    update() {
        
    }
}