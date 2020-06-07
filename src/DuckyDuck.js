import {alturaSuelo, spawnPos, alturaJugador} from "./settings.js";

export class DuckyDuck extends THREE.Object3D {

    isMoving = false;

    constructor(scene) {
        super();

        this.scene = scene;

        /*let geometry = new THREE.BoxGeometry(1, alturaJugador, 1);
        let material = new THREE.MeshBasicMaterial( {color: 0xF9FF33} );
        let cube = new THREE.Mesh( geometry, material );*/
        this.puntuacion = 1;
        this.multiplicidad = 1;
        this.cont_filas = 0;

        let duck = this.createDuck();
        this.resetPosition();
        this.add(duck);
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
        this.finishMove(newPosition);
        this.ScoreResult(type);
        //this.position.copy(newPosition);
        //console.log("[Debug] Moviendo a " + JSON.stringify(newPosition));
    }

    finishMove(newPosition) {
        document.getElementById("info-bioma").innerText = "Bioma: " + this.scene.world.getFila(newPosition.x).type;
        document.getElementById("info-posicion").innerText = "Posicion: {x: " + newPosition.x + ", z: " + newPosition.z +"}";
    }

    resetPosition() {
        this.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        this.scene.camera.followDuck(this.position);
        this.isMoving = false;
    }

    ScoreResult(type){
        if(type == MovementType.ADELANTE){
            this.cont_filas = this.cont_filas + 1;
            if(this.cont_filas>this.puntuacion){
                this.puntuacion = this.puntuacion + (1*this.multiplicidad);
            } 
        } else if (type == MovementType.DETRAS){
            this.cont_filas = this.cont_filas - 1;
        }
        document.getElementById("info-puntuacion").innerText = "Puntuacion: " + this.puntuacion;
        document.getElementById("info-multiplicidad").innerText = "Multiplicidad: {x" + this.multiplicidad + "}";
    }

    createDuck (){
        let duck = new THREE.Object3D();
        duck.cabeza = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial( {color: 0xF9FF33} )
        );

        duck.cuerpo = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color: 0xF9FF33})
        );

        duck.pico = new THREE.Mesh(
            new THREE.ConeGeometry(0.2,0.4,0.6),
            new THREE.MeshBasicMaterial({color: 0xFF8000})
        );

        duck.aleta_izda = new THREE.Mesh(
            new THREE.BoxGeometry(0.8,0.2,0.6),
            new THREE.MeshBasicMaterial({color: 0xFF8000})
        );

        duck.aleta_drch = new THREE.Mesh(
            new THREE.BoxGeometry(0.8,0.2,0.6),
            new THREE.MeshBasicMaterial({color: 0xFF8000})
        );        
        
        duck.cabeza.position.set(0,1.2,0);
        duck.cuerpo.position.set(-0.4,0.2,0);
        duck.pico.rotateZ(THREE.Math.degToRad(-90));
        duck.pico.position.set(0.7,1.2,0);
        duck.aleta_izda.position.set(0,-0.4,0.4);
        duck.aleta_drch.position.set(0,-0.4,-0.4);

        duck.add(duck.cabeza);
        duck.add(duck.cuerpo);
        duck.add(duck.pico);
        duck.add(duck.aleta_drch);
        duck.add(duck.aleta_izda);

        return duck;
    }
}

export const MovementType = {
    ADELANTE: 1,
    DETRAS: 2,
    IZQUIERDA: 3,
    DERECHA: 4,
}