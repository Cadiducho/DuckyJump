import BiomaBase from "./BiomaBase.js";
import {alturaSuelo, anchuraFila, longitudFila, probabilidadCantidadNenufaresEnFila} from "../settings.js";

export default class Agua extends BiomaBase {

    color = 0xa8ede5;

    constructor(world) {
        super(1, 4, world);

        this.nenufares = [];
    }

    generarBioma(inicio) {
        //console.log("Generando agua con " + this.rows);

        this.inicio = inicio;
        let actualRow = inicio;
        for (let i = 0; i < this.rows; ++i) {
            let geometryGround = new THREE.BoxGeometry(longitudFila, alturaSuelo, anchuraFila);
            let material = new THREE.MeshBasicMaterial( { color: this.color} );

            // Ya se puede construir el Mesh
            let ground = new THREE.Mesh (geometryGround, material);

            ground.position.y = alturaSuelo - 0.15;
            ground.position.x = actualRow;

            this.world.setFila(actualRow, {
                type: 'agua',
                mesh: ground,
                instance: this
            });

            this.suelo.add(ground);

            actualRow++;
        }
        this.add(this.suelo);
        this.crearNenufaresYTroncos();
    }

    crearNenufaresYTroncos() {
        for (let i = this.inicio; i < (this.inicio + this.rows); ++i) {
            if (i % 2 === 0) { // Las filas pares con nenufares, las impares con troncos
                // Creo nenufar
                for (let z = -(anchuraFila / 2); z < (anchuraFila / 2); z++) {
                    if (Math.random() < probabilidadCantidadNenufaresEnFila) {
                        let posZ = Math.floor(Math.random() * anchuraFila) - Math.floor(anchuraFila / 2);
                        let posY = alturaSuelo;
                        let posX = i;
                        let geometry = new THREE.CylinderGeometry( 0.7, 0.7, 0.9, 32 );
                        let material = new THREE.MeshBasicMaterial( {color: 0x2c8708} );
                        let nenufar = new THREE.Mesh( geometry, material );
                        nenufar.position.set(i, alturaSuelo, posZ);
                        this.suelo.add(nenufar);
                        this.nenufares.push(nenufar);
                        //console.log("Generando nenufar en x:", posX, " y:", posY, " z:", posZ);
                    }
                }
            } else {
                // En esta fila van troncos
                //console.log("Aquí iría un tronco");
            }
        }
    }

    /**
     * Comprobar si el lugar donde va a saltar el pato es seguro
     * @param position La posición a comprobar
     * @returns {boolean} Falso si el jugador debe morir
     */
    checkSafePlace(position) {
        return this.nenufares.some((nenufar) => nenufar.position.x === position.x && nenufar.position.z === position.z)
    }

    update(player) {

    }
}