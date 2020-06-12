import BiomaBase from "./BiomaBase.js";
import {BiomeType} from "./BiomeType.js";
import {alturaSuelo, anchuraFila} from "../settings.js";
import {DeathType} from "../DeathType.js";

export default class Road extends BiomaBase {

    color = 0x585c58;

    constructor(world) {
        super(1, 4, world);
    }

    generarBioma(inicio) {
        //console.log("Generando road con " + this.rows);
        super.generarBioma(inicio, BiomeType.ROAD);
        this.coches = [];
        this.longitudCoche = 3;
        this.colores = [0xF4B400, 0xDB4437, 0x4285F4, 0x112211, 0xEDDEED];

        this.crearCochesIniciales();
    }

    crearCochesIniciales() {
        for (let i = this.inicio; i < (this.inicio + this.rows); ++i) {
            let speed = (9000 + Math.random() * 15000);

            let zPos = (-anchuraFila / 2) - 1;
            let destination = {z: anchuraFila};
            this.generarCoche(i, zPos, destination, speed);
        }
    }

    generarCoche(fila, zPos, destination, velocidad) {
        let geometryCoche = new THREE.BoxGeometry(1, this.longitudCoche, 1);
        geometryCoche.scale(0.8, 0.8, 0.8);

        let materialCoche = new THREE.MeshBasicMaterial( { color: this.colores[Math.floor(Math.random() * this.colores.length)] } );
        let coche = new THREE.Mesh(geometryCoche, materialCoche);
        coche.position.set(fila, alturaSuelo + 1, zPos);
        coche.rotation.y = Math.PI;
        coche.rotation.x = Math.PI /2;

        this.coches.push({
            object: coche,
            velocidad: velocidad,
            fila: fila,
            destination: destination
        });
        this.suelo.add(coche);

        new TWEEN.Tween(coche.position)
            .to(destination, velocidad)
            .easing(TWEEN.Easing.Linear.None)
            .start();
    }

    update(jugador) {
        let that = this;
        this.coches.forEach(function(coche, index, object) {
            let carPosition = coche.object.position;

            // Regenerar coches que han terminado su viaje
            if (carPosition.z > ((anchuraFila / 2))) {
                that.suelo.remove(coche.object);
                //tronco.object.dispose();
                object.splice(index, 1); // Eliminar de la lista

                // Generar nuevo tronco
                that.generarCoche(coche.fila, (-anchuraFila / 2) - 1, coche.destination, coche.velocidad);
            }

            // Colisiones?
            if (!jugador.muerto) {
                if (jugador.position.x === carPosition.x) {
                    if ((carPosition.z - (that.longitudCoche / 2)) < jugador.position.z
                        && (carPosition.z + (that.longitudCoche / 2)) > jugador.position.z) {
                        jugador.morir(DeathType.APLASTAR);
                    }
                }
            }
        });
    }
}