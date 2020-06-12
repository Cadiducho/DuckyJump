import {alturaSuelo, anchuraFila, longitudFila, probabilidadCantidadCaramelos} from "../settings.js";
import {BiomeType} from "./BiomeType.js";
import {Bonificacion} from "../Bonificacion.js";

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
        this.bonificaciones = [];
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
                mesh: ground,
                instance: this
            });

            this.suelo.add(ground);

            actualRow++;
        }
        this.add(this.suelo);
    }

    insertarCaramelos(i){
        for (let z = -(anchuraFila/2); z < (anchuraFila/2); z++) {
            let posZ = Math.floor(Math.random() * anchuraFila) - Math.floor(anchuraFila / 2);
            let posY = alturaSuelo + 1;
            let posX = i;
            let caramelo;
            if (Math.random() < probabilidadCantidadCaramelos) { //Rojo - Multiplicador
                let material = new THREE.MeshBasicMaterial( { color: 0xff0000} );
                caramelo = this.createCaramelo(material);
                caramelo.position.set(posX, posY, posZ);
                let tipoBonificacion = Object.assign({},Bonificacion.MULTIPLICADOR);
                this.bonificaciones.push({
                    tipo: tipoBonificacion,
                    objeto: caramelo
                });
                this.suelo.add(caramelo);

            } else if (Math.random() < probabilidadCantidadCaramelos) { //Amarillo - Velocidad
                let material = new THREE.MeshBasicMaterial( { color: 0xffff00} );
                caramelo = this.createCaramelo(material);
                caramelo.position.set(posX, posY, posZ);

                let tipoBonificacion = Object.assign({},Bonificacion.VELOCIDAD);
                this.bonificaciones.push({
                    tipo: tipoBonificacion,
                    objeto: caramelo
                });
                this.suelo.add(caramelo);

            } else if (Math.random() < probabilidadCantidadCaramelos) { //Azul - Gigante
                let material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
                caramelo = this.createCaramelo(material);
                caramelo.position.set(posX, posY, posZ);
                let tipoBonificacion = Object.assign({},Bonificacion.GIGANTE);
                this.bonificaciones.push({
                    tipo: tipoBonificacion,
                    objeto: caramelo
                });
                this.suelo.add(caramelo);
            }
            
        }
    }

    createCaramelo(material){
        let caramelo = new THREE.Object3D();
        caramelo.geometry = new THREE.Mesh (new THREE.SphereGeometry(0.25, 4, 6), material);
        caramelo.add(caramelo.geometry);
        return caramelo;
    }

    checkCarameloEncontrado(jugador, position){
        let that = this;
        this.bonificaciones.forEach(function(caramelo, index, object) {
            if(caramelo.objeto.position.x === position.x && caramelo.objeto.position.z === position.z){
                if(jugador.bonificacion != Bonificacion.NINGUNA){
                    jugador.bonificacion.quitar(jugador);
                }
                jugador.bonificacion = caramelo.tipo;
                jugador.bonificacion.aplicar(jugador);

                that.suelo.remove(caramelo.objeto);
                object.splice(index, 1); // Eliminar de la lista
            }
        });
    }

    update(player) {
        throw new Error("Method 'update()' must be implemented.");
    }
}