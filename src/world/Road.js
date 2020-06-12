import BiomaBase from "./BiomaBase.js";
import {BiomeType} from "./BiomeType.js";

export default class Road extends BiomaBase {

    color = 0x585c58;

    constructor(world) {
        super(1, 4, world);
    }

    generarBioma(inicio) {
        //console.log("Generando road con " + this.rows);
        super.generarBioma(inicio, BiomeType.ROAD);
    }

    update(player) {

    }
}