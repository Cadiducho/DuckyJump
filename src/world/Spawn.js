import BiomaBase from "./BiomaBase.js";
import {alturaSuelo, anchuraFila, longitudFila} from "../settings.js";

export default class Spawn extends BiomaBase {

    color = 0xd1d1cf;

    constructor() {
        super(3, 3);
    }

    generarBioma(inicio) {
        //console.log("Generando bioma spawn");
        super.generarBioma(inicio);
    }
}