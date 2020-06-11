import BiomaBase from "./BiomaBase.js";
import {alturaSuelo, anchuraFila, longitudFila, probabilidadCantidadNenufaresEnFila} from "../settings.js";

export default class Agua extends BiomaBase {

    color = 0xa8ede5;

    constructor(world) {
        super(1, 4, world);

        this.nenufares = [];
        this.troncos = [];
    }

    generarBioma(inicio) {
        //console.log("Generando agua con " + this.rows);

        this.inicio = inicio;
        let actualRow = inicio;
        for (let i = 0; i < this.rows; ++i) {
            let geometryGround = new THREE.BoxGeometry(longitudFila, alturaSuelo, anchuraFila);
            let material = new THREE.MeshBasicMaterial( { color: this.color} );

            // Ya se puede construir el Mesh
            let ground = new THREE.Mesh (geometryGround, material);

            ground.position.y = alturaSuelo - 0.15;
            ground.position.x = actualRow;

            this.world.setFila(actualRow, {
                type: 'agua',
                mesh: ground,
                instance: this
            });

            this.suelo.add(ground);

            actualRow++;
        }
        this.add(this.suelo);
        this.crearNenufaresYTroncos();
    }

    crearNenufaresYTroncos() {
        for (let i = this.inicio; i < (this.inicio + this.rows); ++i) {
            if (i % 2 === 0) { // Las filas pares con nenufares, las impares con troncos
                // Creo nenufar
                for (let z = -(anchuraFila / 2); z < (anchuraFila / 2); z++) {
                    if (Math.random() < probabilidadCantidadNenufaresEnFila) {
                        let posZ = Math.floor(Math.random() * anchuraFila) - Math.floor(anchuraFila / 2);
                        let posY = alturaSuelo;
                        let posX = i;
                        
                        let geometry = new THREE.CylinderGeometry( 0.7, 0.7, 0.9, 32);
                        let hueco = new THREE.ConeGeometry( 1, 2, 5);
                        hueco.rotateZ(THREE.Math.degToRad(90));
                        let geoBSP = new ThreeBSP(geometry);
                        let nenufarFinal = new geoBSP.subtract(new ThreeBSP(hueco));
                        let material = new THREE.MeshBasicMaterial( {color: 0x2c8708} );
                        let nenufar = nenufarFinal.toMesh(material);
                        nenufar.geometry.computeFaceNormals ();
                        nenufar.geometry.computeVertexNormals ();

                        nenufar.position.set(posX, posY, posZ);
                        this.suelo.add(nenufar);
                        this.nenufares.push(nenufar);
                        //console.log("Generando nenufar en x:", posX, " y:", posY, " z:", posZ);

                        this.suelo.add(nenufar);
                    }
                }
            } else {
                let speed = (9000 + Math.random() * 15000);

                for (let cont = 0; cont < 2; ++cont) {
                    let zPos = (cont === 0) ? (anchuraFila / 2) : 0;
                    let destination = {z: (cont === 0) ? (-(anchuraFila / 2) - 1) : -(anchuraFila) - 1};

                    this.generarTronco(i, zPos, destination, speed);
                }
            }
        }
    }

    generarTronco(fila, zPos, destination, velocidad) {
        let geometryTronco = new THREE.BoxGeometry(1, 4, 1);
        geometryTronco.scale(0.8, 0.8, 0.8);

        let materialTronco = new THREE.MeshBasicMaterial( { color: 0x6E542D } );
        let tronco = new THREE.Mesh(geometryTronco, materialTronco);
        tronco.position.set(fila, alturaSuelo + 0.1, zPos);
        //console.log("Generando tronco en x:", fila, " y:", alturaSuelo + 0.1, " z:", zPos);
        tronco.rotation.y = Math.PI;
        tronco.rotation.x = Math.PI /2;

        this.troncos.push({
            object: tronco,
            velocidad: velocidad,
            fila: fila,
            destination: destination
        });
        this.suelo.add(tronco);

        new TWEEN.Tween(tronco.position)
            .to(destination, velocidad)
            .easing(TWEEN.Easing.Linear.None)
            .start();
    }

    /**
     * Comprobar si el lugar donde va a saltar el pato es seguro
     * @param position La posición a comprobar
     * @returns {boolean} Falso si el jugador debe morir
     */
    checkSafePlace(jugador, position) {
        let enNenufar = this.nenufares.some((nenufar) => nenufar.position.x === position.x && nenufar.position.z === position.z)
        if (enNenufar) {
            return true;
        }

        // Buscar tronco
        let troncoEncontrado = false;
        this.troncos.forEach(function(tronco) {
            if (tronco.object.position.x === position.x
                && ((tronco.object.position.z - 2) < position.z
                    && (tronco.object.position.z + 2) > position.z)) {

                jugador.tronco = tronco.object;
                jugador.diferenciaTronco = tronco.object.position.z - position.z;
                troncoEncontrado = true;
            }
        });
        return troncoEncontrado;
    }

    update(jugador) {
        let that = this;
        this.troncos.forEach(function(tronco, index, object) {
            let position = tronco.object.position;
            if (position.z <= -((anchuraFila / 2)) || position.z > ((anchuraFila / 2))) {
                that.suelo.remove(tronco.object);
                //tronco.object.dispose();
                object.splice(index, 1); // Eliminar de la lista
                if (tronco.object === jugador.tronco) {
                    jugador.morir();
                }

                // Generar nuevo tronco
                that.generarTronco(tronco.fila, (anchuraFila / 2), {z: (-(anchuraFila / 2) - 1)}, tronco.velocidad);
            }
        });

        if (jugador.tronco !== undefined) {
            jugador.position.z = (jugador.tronco.position.z - jugador.diferenciaTronco);
        }
    }
}