import {alturaSuelo, spawnPos, alturaJugador} from "./settings.js";

export class DuckyDuck extends THREE.Object3D {

    isMoving = false;

    constructor(scene) {
        super();

        this.scene = scene;

        let geometry = new THREE.BoxGeometry(1, alturaJugador, 1);
        let material = new THREE.MeshBasicMaterial( {color: 0xF9FF33} );
        let cube = new THREE.Mesh( geometry, material );
        this.resetPosition();
        this.add(cube);
    }

    onMove(type) {
        if (this.isMoving) return; // Si ya se está moviendo, no comenzar otras animaciones

        let newPosition = new THREE.Vector3(this.position.x, (alturaSuelo + alturaJugador), this.position.z);
        //console.log("[Debug] Anterior: " + JSON.stringify(newPosition));
        switch (type) {
            case MovementType.ADELANTE:
                newPosition.setX(this.position.x + 1);
                break;
            case MovementType.DETRAS:
                newPosition.setX(this.position.x - 1);
                break;
            case MovementType.IZQUIERDA:
                newPosition.setZ(this.position.z - 1);
                break;
            case MovementType.DERECHA:
                newPosition.setZ(this.position.z + 1);
                break;
        }

        new TWEEN.Tween(this.position)
            .onStart(() => this.isMoving = true)
            .onComplete(() => this.isMoving = false)
            .to(newPosition, 400)
            .easing(TWEEN.Easing.Quintic.InOut)
            .start();

        this.scene.camera.followDuck(newPosition);
        this.isMoving = false;
       // this.position.copy(newPosition);
        //console.log("[Debug] Moviendo a " + JSON.stringify(newPosition));
    }

    resetPosition() {
        this.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        this.scene.camera.followDuck(this.position);
        this.isMoving = false;
    }
}

export const MovementType = {
    ADELANTE: 1,
    DETRAS: 2,
    IZQUIERDA: 3,
    DERECHA: 4,
}