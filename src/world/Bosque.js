import BiomaBase from "./BiomaBase.js";
import {alturaSuelo, anchuraFila, longitudFila} from "../settings.js";

export default class Bosque extends BiomaBase {

    color = 0x319e35;

    constructor() {
        super(1, 4);
    }

    generarBioma(inicio) {
        //console.log("Generando bosque con " + this.rows);
        super.generarBioma(inicio);
        this.crearArboles();
    }

    crearArboles() {
        for (let i = this.inicio; i < (this.inicio + this.rows); ++i) {
            if (Math.random() < 0.7) {
                let posZ = Math.floor(Math.random() * anchuraFila) - Math.floor(anchuraFila / 2);
                let posY = alturaSuelo + 1;
                let posX = i;

                console.log("Generando arbol en x:", posX, " y:", posY, " z:", posZ);
                let arbol = new THREE.Group();
                let geometryTronco = new THREE.BoxGeometry(1, 1, 1);
                let materialTronco = new THREE.MeshBasicMaterial( { color: 0x6E542D } );
                let geometryHoja = new THREE.ConeGeometry( 1, 1.6, 4, 1, false, (45 * Math.PI / 180), Math.PI* 2);
                let materialHoja = new THREE.MeshBasicMaterial( {color: 0x2b6e2b} );
                let tronco = new THREE.Mesh(geometryTronco, materialTronco);

                tronco.position.set(i, alturaSuelo + 1, posZ);
                tronco.scale.set(0.8, 2.8, 0.8);
                let hojas = new THREE.Mesh(geometryHoja, materialHoja );
                hojas.position.set(i, alturaSuelo + 3, posZ);

                arbol.add(tronco);
                arbol.add(hojas);
                this.suelo.add(arbol);
            }
        }
    }
}