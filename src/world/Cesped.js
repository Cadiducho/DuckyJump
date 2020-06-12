import BiomaBase from "./BiomaBase.js";
import {alturaSuelo, anchuraFila, probabilidadCantidadFloresEnFila} from "../settings.js";
export default class Cesped extends BiomaBase {

    color = 0x62fc68;

    constructor(world) {
        super(1, 4, world);
        this.flores = [];
    }

    generarBioma(inicio) {
        //console.log("Generando cesped con " + this.rows);
        super.generarBioma(inicio, 'cesped');
        this.crearFlores();
    }

    crearFlores(){
        for (let i = this.inicio; i < (this.inicio + this.rows); ++i) {
            if (Math.random() < probabilidadCantidadFloresEnFila) {
                for (let z = -(anchuraFila/2); z < (anchuraFila/2); z++) {
                    if (Math.random() < probabilidadCantidadFloresEnFila) {
                        let posZ = Math.floor(Math.random() * anchuraFila) - Math.floor(anchuraFila / 2);
                        let posY = alturaSuelo + 0.5;
                        let posX = i;

                        //creacion flores
                        let petalo1 = new THREE.BoxGeometry(0.15,0.15,0.15);
                        let petalo2 = new THREE.CylinderGeometry(0.1,0.1,0.1);
                        let petalo3 = new THREE.BoxGeometry(0.15,0.15,0.15);
                        let petalo4 = new THREE.CylinderGeometry(0.1,0.1,0.1);

                        /*let miniflor = new THREE.CylinderGeometry(0.1,0.1,0.1);
                        let miniflor2 = new THREE.BoxGeometry(0.1,0.1,0.1);
                        let miniflor3 = new THREE.CylinderGeometry(0.05,0.05,0.05);*/

                        petalo1.translate(0.05,alturaSuelo,0.05);
                        petalo1.rotateY(THREE.Math.degToRad(45));
                        petalo2.translate(0,alturaSuelo,-0.1);
                        petalo3.translate(-0.05,alturaSuelo,-0.05);
                        petalo3.rotateY(THREE.Math.degToRad(45));
                        petalo4.translate(0,alturaSuelo,0.1);
                        /*miniflor.translate(0.2, alturaSuelo, 0.5);
                        miniflor2.translate(-0.5, alturaSuelo, -0.3);
                        miniflor3.translate(0.2, alturaSuelo, 0.3);*/

                        let geoBSP = new ThreeBSP(petalo1);
                        let geo2BSP = new geoBSP.union(new ThreeBSP(petalo2));
                        let geo3BSP = new geo2BSP.union(new ThreeBSP(petalo3));
                        /*let geo4BSP =new geo3BSP.union(new ThreeBSP(petalo4));
                        let geo5BSP =new geo4BSP.union(new ThreeBSP(miniflor));
                        let geo6BSP =new geo5BSP.union(new ThreeBSP(miniflor3));*/
                        let petalosBSP = new geo3BSP.union(new ThreeBSP(petalo4));

                        let material = new THREE.MeshBasicMaterial( {color: 0xffc0cb} );
                        let petalos = petalosBSP.toMesh(material);
                        petalos.geometry.computeFaceNormals ();
                        petalos.geometry.computeVertexNormals ();

                        petalos.position.set(posX, posY, posZ);
                        this.suelo.add(petalos);
                        this.flores.push(petalos);

                        this.suelo.add(petalos);
                        //console.log("Generando arbol en x:", posX, " y:", posY, " z:", posZ);
                    }
                }
            }
        }
    }
}