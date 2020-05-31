import {alturaSuelo, anchuraFila, longitudFila} from "../settings.js";

export default class BiomaBase extends THREE.Object3D {

    /**
     * Bioma con una cantidad de filas aleatorias
     * @param minRows Filas mínimas
     * @param maxRow Filas máximas
     */
    constructor(minRows, maxRow) {
        super();
        this.rows = Math.floor(Math.random() * maxRow) + minRows;
    }

    getRows() {
        return this.rows;
    }

    /**
     * Generar bioma a partir de la fila indicada
     * @param inicio la fila
     */
    generarBioma(inicio) {
        //console.log("Inicio: " + inicio);

        let actualRow = inicio;
        for (let i = 0; i < this.rows; ++i) {
            let geometryGround = new THREE.BoxGeometry(longitudFila, alturaSuelo, anchuraFila);
            let material = new THREE.MeshBasicMaterial( { color: this.color} );

            // Ya se puede construir el Mesh
            let ground = new THREE.Mesh (geometryGround, material);

            ground.position.y = alturaSuelo;
            ground.position.x = actualRow;

            this.add(ground);

            actualRow++;
        }
    }

    update(player) {
        throw new Error("Method 'update()' must be implemented.");
    }
}