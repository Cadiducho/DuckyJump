
export class DuckyCamera extends THREE.PerspectiveCamera {

    constructor(renderer) {
        super(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = renderer;
        //this.position.set(-1, 2.8, -2.9);
        this.position.set (20, 10, 20);
        this.look = new THREE.Vector3 (0,0,0);
        this.lookAt(this.look);

        // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
        this.cameraControl = new THREE.TrackballControls (this, this.renderer.domElement);
        // Se configuran las velocidades de los movimientos
        this.cameraControl.rotateSpeed = 5;
        this.cameraControl.zoomSpeed = -2;
        this.cameraControl.panSpeed = 0.5;
        this.cameraControl.target = this.look;
    }

    update() {
        this.cameraControl.update();
    }
}