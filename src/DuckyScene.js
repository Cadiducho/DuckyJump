
import {DuckyWorld} from "./DuckyWorld.js";
import {DuckyCamera} from "./DuckyCamera.js";

export class DuckyScene extends THREE.Scene {

    constructor (myCanvas) {
        super();

        this.renderer = this.createRenderer(myCanvas);

        // Se crea el mundo donde luego añadir los objetos del mapa y una luz ambiental
        this.world = new DuckyWorld();
        this.camera = new DuckyCamera(this.renderer);

        this.add(this.camera)
        this.add(this.world);
    }


    createRenderer (myCanvas) {
        // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

        // Se instancia un Renderer   WebGL
        var renderer = new THREE.WebGLRenderer();

        // Se establece un color de fondo en las imágenes que genera el render
        renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

        // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
        renderer.setSize(window.innerWidth, window.innerHeight);

        // La visualización se muestra en el lienzo recibido
        $(myCanvas).append(renderer.domElement);

        return renderer;
    }

    setCameraAspect (ratio) {
        // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
        // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
        this.camera.aspect = ratio;
        // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
        this.camera.updateProjectionMatrix();
    }

    onWindowResize () {
        // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
        // Hay que actualizar el ratio de aspecto de la cámara
        this.setCameraAspect (window.innerWidth / window.innerHeight);

        // Y también el tamaño del renderizador
        this.renderer.setSize (window.innerWidth, window.innerHeight);
    }

    update () {
        this.renderer.render(this, this.camera);
        this.camera.update();
        this.world.update();
    }

}