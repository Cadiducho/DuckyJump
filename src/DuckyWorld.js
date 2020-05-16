import {alturaSuelo, filasMaximas, anchuraFila, longitudFila} from "./settings.js";

export class DuckyWorld extends THREE.Object3D {

    constructor() {
        super();

        this.add(new THREE.AmbientLight(0x666666, 0.8));

        this.createMap();
    }

    createMap() {


        // crear 3 filas iniciales de cesped
        for (let i = 0; i < 3; ++i) {
            this.createGround('concrete', i);
        }
        for (let i = 3; i < filasMaximas; ++i) {
            if (Math.random() > 0.5) {
                this.createGround('grass', i);
            } else {
                this.createGround('water', i);
            }
        }
    }

    createGround (type, i) {
        // El suelo es un Mesh, necesita una geometría y un material.

        // La geometría es una caja con muy poca altura
        var geometryGround = new THREE.BoxGeometry(longitudFila, alturaSuelo, anchuraFila);

        // El material se hará con una textura de madera
        var texture = new THREE.TextureLoader().load("../imgs/" + type + ".png");
        var materialGround = new THREE.MeshPhongMaterial ({map: texture});

        // Ya se puede construir el Mesh
        var ground = new THREE.Mesh (geometryGround, materialGround);

        ground.position.y = alturaSuelo;
        ground.position.x = i;

        this.add(ground);
    }
}