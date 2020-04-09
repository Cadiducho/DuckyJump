export class DuckyWorld extends THREE.Object3D {

    constructor() {
        super();

        this.add(new THREE.AmbientLight(0x666666, 0.8));
    }

}