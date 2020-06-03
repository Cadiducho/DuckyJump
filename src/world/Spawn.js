import BiomaBase from "./BiomaBase.js";
import {alturaSuelo, anchuraFila, longitudFila} from "../settings.js";

export default class Spawn extends BiomaBase {

    color = 0xd1d1cf;

    constructor(world) {
        super(3, 3, world);
    }

    generarBioma(inicio) {
        //console.log("Generando bioma spawn");
        super.generarBioma(inicio, 'inicio');

        // Codigo para cargar texturas en un futuro
        /*this.inicio = inicio;
        let actualRow = inicio;
        for (let i = 0; i < this.rows; ++i) {
            let geometryGround = new THREE.BoxGeometry(longitudFila, alturaSuelo, anchuraFila);
            let texture = new THREE.TextureLoader().load( "../imgs/concrete.png" );
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.repeat.set(longitudFila, anchuraFila);
            let material =  new THREE.MeshBasicMaterial({
                map: texture
            });

            // Ya se puede construir el Mesh
            let ground = new THREE.Mesh (geometryGround, material);

            ground.position.y = alturaSuelo;
            ground.position.x = actualRow;

            this.world.setFila(actualRow, {
                type: 'inicio',
                mesh: ground
            });

            this.suelo.add(ground);

            actualRow++;
        }
        this.add(this.suelo);*/
    }
}