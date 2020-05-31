import BiomaBase from "./BiomaBase.js";
import {alturaSuelo, anchuraFila, longitudFila} from "../settings.js";

export default class Agua extends BiomaBase {

    color = 0xa8ede5;

    constructor() {
        super(1, 4);
    }

    generarBioma(inicio) {
        //console.log("Generando agua con " + this.rows);

        let actualRow = inicio;
        for (let i = 0; i < this.rows; ++i) {
            let geometryGround = new THREE.BoxGeometry(longitudFila, alturaSuelo, anchuraFila);
            let material = new THREE.MeshBasicMaterial( { color: this.color} );

            // Ya se puede construir el Mesh
            let ground = new THREE.Mesh (geometryGround, material);

            ground.position.y = alturaSuelo - 0.15;
            ground.position.x = actualRow;

            this.add(ground);

            actualRow++;
        }
    }

    update(player) {

    }
}