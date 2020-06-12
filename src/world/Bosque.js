import BiomaBase from "./BiomaBase.js";
import {BiomeType} from "./BiomeType.js";
import {Bonificacion} from "../Bonificacion.js";
import {alturaSuelo, anchuraFila, probabilidadArbolesFilaConArboles, probabilidadCantidadArbolesEnFila} from "../settings.js";

export default class Bosque extends BiomaBase {

    color = 0x319e35;

    constructor(world) {
        super(1, 4, world);

        this.arboles = [];
    }

    generarBioma(inicio) {
        //console.log("Generando bosque con " + this.rows);
        super.generarBioma(inicio, BiomeType.BOSQUE);
        this.crearArboles();
    }

    crearArboles() {
        for (let i = this.inicio; i < (this.inicio + this.rows); ++i) {
            if (Math.random() < probabilidadArbolesFilaConArboles) {
                for (let z = -(anchuraFila/2); z < (anchuraFila/2); z++) {
                    if (Math.random() < probabilidadCantidadArbolesEnFila) {
                        let posZ = Math.floor(Math.random() * anchuraFila) - Math.floor(anchuraFila / 2);
                        let posY = alturaSuelo + 1;
                        let posX = i;

                        //console.log("Generando arbol en x:", posX, " y:", posY, " z:", posZ);
                        let arbol = new THREE.Group();
                        let geometryTronco = new THREE.BoxGeometry(1, 1, 1);
                        let materialTronco = new THREE.MeshBasicMaterial( { color: 0x6E542D } );
                        let geometryHoja = new THREE.ConeGeometry( 1, 1.6, 4, 1, false, (45 * Math.PI / 180), Math.PI* 2);
                        let materialHoja = new THREE.MeshBasicMaterial( {color: 0x2b6e2b} );
                        let tronco = new THREE.Mesh(geometryTronco, materialTronco);

                        tronco.position.set(posX, posY, posZ);
                        tronco.scale.set(0.8, 2.8, 0.8);
                        let hojas = new THREE.Mesh(geometryHoja, materialHoja );
                        hojas.position.set(posX, posY + 2, posZ);

                        arbol.add(tronco);
                        arbol.add(hojas);
                        this.suelo.add(arbol);
                        this.arboles.push(tronco);
                    }
                }
            } else {
                this.insertarCaramelos(i);
            }
        }
    }

    /**
     * Comprobar si el lugar donde va a saltar tiene un arbol
     * @param position La posición a comprobar
     * @returns {boolean} Falso si el jugador debe morir
     */
    checkSafePlace(jugador, position) {
        if(jugador.bonificacion.nombre === Bonificacion.GIGANTE.nombre){
            return true; //Si es gigante atraviesa arboles.
        }
        return !this.arboles.some((arbol) => arbol.position.x === position.x && arbol.position.z === position.z);
    }
}