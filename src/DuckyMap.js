export class DuckyMap {

    maxRows = 10;
    constructor(world) {
        this.world = world;

        for (let i = 0; i < this.maxRows; ++i) {

            var boxGeom = new THREE.BoxGeometry (10,10,1);
            // Como material se crea uno a partir de un color
            var boxMat = new THREE.MeshPhongMaterial({color: 0xFF5D00});

            // Ya podemos construir el Mesh
            var box = new THREE.Mesh (boxGeom, boxMat);
            if (Math.random() > 0.5) {
                this.createGround('grass', i);
            } else {
                this.createGround('water', i);
            }

            //this.world.add(box);
        }
    }

    createGround (type, i) {
        // El suelo es un Mesh, necesita una geometría y un material.

        // La geometría es una caja con muy poca altura
        var geometryGround = new THREE.BoxGeometry (30, 0.2, 10);

        // El material se hará con una textura de madera
        var texture = new THREE.TextureLoader().load("../imgs/" + type + ".png");
        var materialGround = new THREE.MeshPhongMaterial ({map: texture});

        // Ya se puede construir el Mesh
        var ground = new THREE.Mesh (geometryGround, materialGround);

        // Todas las figuras se crean centradas en el origen.
        // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
        ground.position.y = -0.1;
        ground.position.z = 10 * i

        // Que no se nos olvide añadirlo a la escena, que en este caso es  this
        this.world.add (ground);
    }
}