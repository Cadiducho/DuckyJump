import BiomaBase from "./BiomaBase.js";

export default class Cesped extends BiomaBase {

    color = 0x62fc68;

    constructor() {
        super(1, 4);
    }

    generarBioma(inicio) {
        //console.log("Generando cesped con " + this.rows);
        super.generarBioma(inicio);
    }
}