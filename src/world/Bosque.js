import BiomaBase from "./BiomaBase.js";
export default class Bosque extends BiomaBase {

    color = 0x319e35;

    constructor() {
        super(1, 4);
    }

    generarBioma(inicio) {
        //console.log("Generando bosque con " + this.rows);
        super.generarBioma(inicio);
    }
}