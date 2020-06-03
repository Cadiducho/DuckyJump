import BiomaBase from "./BiomaBase.js";

export default class Road extends BiomaBase {

    color = 0x585c58;

    constructor(world) {
        super(1, 4, world);
    }

    generarBioma(inicio) {
        //console.log("Generando road con " + this.rows);
        super.generarBioma(inicio, 'road');
    }

    update(player) {

    }
}