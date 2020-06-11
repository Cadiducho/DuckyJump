import {filasMaximas} from "./settings.js";
import Agua from "./world/Agua.js";
import Spawn from "./world/Spawn.js";
import Bosque from "./world/Bosque.js";
import Cesped from "./world/Cesped.js";
import Road from "./world/Road.js";

export class DuckyWorld extends THREE.Object3D {

    worldMatrix = {};
    jugador;

    constructor(scene) {
        super();
        this.scene = scene;

        this.add(new THREE.AmbientLight(0x666666, 0.8));


        this.filasCreadas = 0;
        this.createMap();
    }

    addPlayer(player) {
        this.jugador = player;
        this.add(player);
    }

    getFila(i) {
        return this.worldMatrix[i];
    }

    setFila(i, objeto) {
        this.worldMatrix[i] = objeto;
    }

    biomasAgua = [];
    biomasRoad = [];

    createMap() {

        // El bioma spawn, inicio sobre cemento
        let spawn = new Spawn(this);
        spawn.generarBioma(this.filasCreadas);
        this.add(spawn);
        this.filasCreadas += spawn.getRows();

        // Unas de cesped siempre al principio
        let spawnFaseCesped = new Cesped(this);
        spawnFaseCesped.generarBioma(this.filasCreadas);
        this.add(spawnFaseCesped);
        this.filasCreadas += spawnFaseCesped.getRows();

        // Generación aleatoria del resto de biomas
        while (this.filasCreadas < filasMaximas) {
            this.crearNuevaFila();
        }
    }

    crearNuevaFila() {
        let r = Math.random();
        let bioma;
        if (r < 0.3) {
            bioma = new Bosque(this);
        } else if (r < 0.5) {
            bioma = new Cesped(this);
        } else if (r < 0.8) {
            bioma = new Agua(this);
            this.biomasAgua.push(bioma);
        } else {
            bioma = new Road(this);
            this.biomasRoad.push(bioma);
        }

        bioma.generarBioma(this.filasCreadas);
        this.add(bioma); // Añade el objeto de biomas

        this.filasCreadas += bioma.getRows();
        //console.log("Añadiendo bioma nuevo en " + this.filasCreadas);
    }

    update() {
        for (const agua of this.biomasAgua) {
            agua.update(this.jugador);
        }
        for (const road of this.biomasRoad) {
            road.update(this.jugador);
        }
    }
}