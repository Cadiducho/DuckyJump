import {alturaSuelo, spawnPos, alturaJugador, anchuraFila, primeraFila, tiempoMuerte} from "./settings.js";
import {Bonificacion} from "./Bonificacion.js";
import {MovementType} from "./MovementType.js"
import {DeathType} from "./DeathType.js"
import {BiomeType} from "./world/BiomeType.js";

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
                new TWEEN.Tween(this.rotation)
                    .to({ y: 0}, this.t_velocidad)
                    .easing(TWEEN.Easing.Circular.Out)
                    .start();
                newPosition.setX(this.position.x + 1);
                break;
            case MovementType.DETRAS:
                new TWEEN.Tween(this.rotation)
                    .to({ y: Math.PI}, this.t_velocidad)
                    .easing(TWEEN.Easing.Circular.Out)
                    .start();
                newPosition.setX(this.position.x - 1);
                break;
            case MovementType.IZQUIERDA:
                new TWEEN.Tween(this.rotation)
                    .to({ y: Math.PI/2}, this.t_velocidad)
                    .easing(TWEEN.Easing.Circular.Out)
                    .start();
                newPosition.setZ(this.position.z - 1);
                break;
            case MovementType.DERECHA:
                new TWEEN.Tween(this.rotation)
                    .to({y: -Math.PI/2}, this.t_velocidad)
                    .easing(TWEEN.Easing.Circular.Out)
                    .start();
                newPosition.setZ(this.position.z + 1);
                break;
        }
        newPosition.floor(); // Redondear posiciones a enteros

        let salto = new TWEEN.Tween(this.position)
            .onStart(() => this.isMoving = true)
            .to({x: newPosition.x, y: newPosition.y + 0.3, z: newPosition.z}, this.t_velocidad / 1.5)
            .easing(TWEEN.Easing.Quintic.Out)
        let caida = new TWEEN.Tween(this.position)
            .onComplete(() => this.isMoving = false)
            .to(newPosition, this.t_velocidad / 3)
            .easing(TWEEN.Easing.Quintic.In)
        salto.chain(caida);
        salto.start();

        /**
        new TWEEN.Tween(this.position)
            .onStart(() => this.isMoving = true)
            .onComplete(() => this.isMoving = false)
            .to(newPosition, this.t_velocidad)
            .easing(TWEEN.Easing.Quintic.InOut)
            .start();*/

        if (newPosition.z <= -((anchuraFila / 2)) || newPosition.z > ((anchuraFila / 2))) {
            this.morir(DeathType.CAER);
            return;
        }
        if (newPosition.x < (primeraFila - 1)) {
            this.morir(DeathType.CAER);
            return;
        }
        // Al moverme, elimino posible anterior tronco que el jugador tenga guardado
        if (this.tronco !== undefined) {
            this.tronco = undefined;
        }

        let biomeType = this.scene.world.getFila(newPosition.x).type;
        if (biomeType === BiomeType.AGUA || biomeType === BiomeType.BOSQUE) {
            if (!this.scene.world.getFila(newPosition.x).instance.checkSafePlace(this, newPosition)) {
                this.morir(biomeType === BiomeType.BOSQUE ? DeathType.CHOCAR : DeathType.CAER);
                return;
            }
        }

        this.isMoving = false;
        this.finishMove(newPosition);
        this.ScoreResult(type, newPosition);
        //console.log("[Debug] Moviendo a " + JSON.stringify(newPosition));
    }

    finishMove(newPosition) {
        document.getElementById("info-bioma").innerText = "Bioma: " + this.scene.world.getFila(newPosition.x).type;
        document.getElementById("info-posicion").innerText = "Posicion: {x: " + newPosition.x + ", z: " + newPosition.z +"}";
    }

    resetPosition() {
        this.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
        this.rotation.set(0, 0, 0);
        this.scale.set(1, 1, 1);
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

    morir(tipo) {
        document.getElementById("info-muerte").innerHTML = "¡Has perdido!";
        this.muerto = true;

        this.tronco = undefined;
        this.diferenciaTronco = 0;

        // Si el pato muere cayendo a algún lado, mostrar animación
        switch (tipo) {
            case DeathType.CHOCAR:
                new TWEEN.Tween(this.rotation)
                    .to({ x: Math.PI/2}, 500)
                    .easing(TWEEN.Easing.Quartic.In)
                    .start();
                break;
            case DeathType.CAER:
                new TWEEN.Tween(this.position)
                    .to({y: -1}, 600)
                    .easing(TWEEN.Easing.Quartic.In)
                    .start();
                break;
            case DeathType.APLASTAR:
                new TWEEN.Tween(this.scale)
                    .to({x: 1.2, y: 0.1, z: 1.8}, 300)
                    .easing(TWEEN.Easing.Quartic.In)
                    .start();
                break;
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
            this.morir(DeathType.NINGUNA);
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