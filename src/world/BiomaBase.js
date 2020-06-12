import {alturaSuelo, anchuraFila, longitudFila} from "../settings.js";
import {BiomeType} from "./BiomeType.js";

export default class BiomaBase extends THREE.Object3D {

    /**
     * Bioma con una cantidad de filas aleatorias
     * @param minRows Filas mínimas
     * @param maxRow Filas máximas
     */
    constructor(minRows, maxRow, world) {
        super();
        this.world = world;
        this.suelo = new THREE.Object3D();
        this.rows = Math.floor(Math.random() * maxRow) + minRows;
    }

    getRows() {
        return this.rows;
    }

    /**
     * Generar bioma a partir de la fila indicada
     * @param inicio la fila
     * @param tipo Tipo del bioma. Puede ser cesped, agua...
     */
    generarBioma(inicio, tipo = BiomeType.UNKNOWN) {
        //console.log("Inicio: " + inicio);
        this.inicio = inicio;
        let actualRow = inicio;
        for (let i = 0; i < this.rows; ++i) {
            let geometryGround = new THREE.BoxGeometry(longitudFila, alturaSuelo, anchuraFila);
            let material = new THREE.MeshBasicMaterial( { color: this.color} );

            // Ya se puede construir el Mesh
            let ground = new THREE.Mesh (geometryGround, material);

            ground.position.y = alturaSuelo;
            ground.position.x = actualRow;

            this.world.setFila(actualRow, {
                type: tipo,
                mesh: ground
            });

            this.suelo.add(ground);

            actualRow++;
        }
        this.add(this.suelo);
    }

    update(player) {
        throw new Error("Method 'update()' must be implemented.");
    }
}