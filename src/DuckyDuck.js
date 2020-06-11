import {alturaSuelo, spawnPos, alturaJugador, anchuraFila, primeraFila, tiempoMuerte} from "./settings.js";
import {Bonificacion} from "./Bonificacion.js";

export class DuckyDuck extends THREE.Object3D {

    constructor(scene) {
        super();

        this.scene = scene;

        this.muerto = false;
        this.isMoving = false;
        this.puntuacion = 0;
        this.multiplicidad = 1;
        this.fila_max = 0;
        this.bonificacion = Bonificacion.NINGUNA;
        this.t_velocidad = 400;

        this.tronco = undefined;
        this.diferenciaTronco = 0;

        this.duck = this.createDuck();
        this.resetPosition();
        this.add(this.duck);
    }

    onMove(type) {
        if (this.muerto) return;
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
        newPosition.floor(); // Redondear posiciones a enteros

        new TWEEN.Tween(this.position)
            .onStart(() => this.isMoving = true)
            .onComplete(() => this.isMoving = false)
            .to(newPosition, this.t_velocidad)
            .easing(TWEEN.Easing.Quintic.InOut)
            .start();

        if (newPosition.z <= -((anchuraFila / 2)) || newPosition.z > ((anchuraFila / 2))) {
            this.morir(true);
            return;
        }
        if (newPosition.x < (primeraFila - 1)) {
            this.morir(true);
            return;
        }
        // Al moverme, elimino posible anterior tronco que el jugador tenga guardado
        if (this.tronco !== undefined) {
            this.tronco = undefined;
        }

        if (this.scene.world.getFila(newPosition.x).type === 'agua') {
            if (!this.scene.world.getFila(newPosition.x).instance.checkSafePlace(this, newPosition)) {
                this.morir(true);
                return;
            }
        }

        this.isMoving = false;
        this.finishMove(newPosition);
        this.ScoreResult(type, newPosition);
        //this.position.copy(newPosition);
        //console.log("[Debug] Moviendo a " + JSON.stringify(newPosition));
    }

    finishMove(newPosition) {
        document.getElementById("info-bioma").innerText = "Bioma: " + this.scene.world.getFila(newPosition.x).type;
        document.getElementById("info-posicion").innerText = "Posicion: {x: " + newPosition.x + ", z: " + newPosition.z +"}";
/*
        if (colision) {
            switch () {
                this.bonificacion = Bonificacion.VELOCIDAD;
            }
            this.bonificacion.aplicar(this);
        }*/
    }

    resetPosition() {
        this.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        this.isMoving = false;
        this.fila_max = 0; 
        this.puntuacion = 0;
        this.multiplicidad = 1;
        this.finishMove(this.position);
    }

    ScoreResult(type, newPosition){
        if(type === MovementType.ADELANTE){
            if(this.fila_max < newPosition.x){
                this.fila_max = newPosition.x;
                this.puntuacion = this.puntuacion + (1*this.multiplicidad);
            }
        }
        this.updateText();
    }

    morir(caer) {
        document.getElementById("info-muerte").innerHTML = "¡Has muerto!";
        this.muerto = true;

        this.tronco = undefined;
        this.diferenciaTronco = 0;

        // Si el pato muere cayendo a algún lado, mostrar animación
        if (caer) {
            new TWEEN.Tween(this.position)
                .to({y: -1}, 600)
                .easing(TWEEN.Easing.Quartic.In)
                .start();
        }
        let that = this;
        setTimeout(function () {
                document.getElementById("info-muerte").innerHTML = "";
                that.bonificacion = Bonificacion.NINGUNA;
                that.puntuacion = 0;
                that.resetPosition();
                that.scene.game.tiempoJugado = 0;
                that.isMoving = false;
                that.muerto = false;
                that.updateText();
            }
        , tiempoMuerte);
    }

    updateText() {
        document.getElementById("info-puntuacion").innerText = "Puntuacion: " + this.puntuacion;
        document.getElementById("info-bonificacion").innerText = "Bonificacion: {" + this.bonificacion.nombre + "}";
    }

    /**
     * Crear la geometria del pato
     */
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

        duck.scale.set(0.5,0.5,0.5);
        return duck;
    }

    /**
     * Comprobaciones de cada segundo
     */
    tick() {
        if (this.position.x < (this.scene.camera.position.x + 1)) { // Morir si le pilla la cámara
            this.morir(false);
            return;
        }
        
        if (this.bonificacion.tiempo > 0) {
            this.bonificacion.tiempo--;
        } else {
            this.bonificacion.quitar(this);
            this.bonificacion = Bonificacion.NINGUNA;
        }
    }
}

export const MovementType = {
    ADELANTE: 1,
    DETRAS: 2,
    IZQUIERDA: 3,
    DERECHA: 4,
}