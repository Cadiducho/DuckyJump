import {alturaSuelo, filasMaximas, anchuraFila, longitudFila} from "./settings.js";
import Agua from "./world/Agua.js";
import Spawn from "./world/Spawn.js";
import Bosque from "./world/Bosque.js";
import Cesped from "./world/Cesped.js";
import Road from "./world/Road.js";

export class DuckyWorld extends THREE.Object3D {

    worldMatrix = {};
    jugador;

    constructor() {
        super();

        this.add(new THREE.AmbientLight(0x666666, 0.8));

        this.createMap();
    }

    addPlayer(player) {
        this.jugador = player;
        this.add(player);
    }
/*
    getFila(i) {
        return this.worldMatrix[i];
    }

    setFila(i, objeto) {
        this.worldMatrix[i] = objeto;
    }*/

    biomasAgua = [];
    biomasRoad = [];

    createMap() {
        let filasCreadas = 0;

        // El bioma spawn, inicio sobre cemento
        let spawn = new Spawn();
        spawn.generarBioma(filasCreadas);
        this.add(spawn);
        filasCreadas += spawn.getRows();

        // Unas de cesped siempre al principio
        let spawnFaseCesped = new Cesped();
        spawnFaseCesped.generarBioma(filasCreadas);
        this.add(spawnFaseCesped);
        filasCreadas += spawnFaseCesped.getRows();

        // Generación aleatoria del resto de biomas
        while (filasCreadas < filasMaximas) {
            let r = Math.random();
            let bioma;
            if (r < 0.3) {
                bioma = new Bosque();
            } else if (r < 0.5) {
                bioma = new Cesped();
            } else if (r < 0.8) {
                bioma = new Agua();
                this.biomasAgua.push(bioma);
            } else {
                bioma = new Road();
                this.biomasRoad.push(bioma);
            }

            bioma.generarBioma(filasCreadas);
            this.add(bioma); // Añade el objeto de biomas

            filasCreadas += bioma.getRows();
        }
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