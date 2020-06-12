import {BiomeType} from "./BiomeType.js";
import BiomaBase from "./BiomaBase.js";

export default class Spawn extends BiomaBase {

    color = 0xd1d1cf;

    constructor(world) {
        super(3, 3, world);
    }

    generarBioma(inicio) {
        //console.log("Generando bioma spawn");
        super.generarBioma(inicio, BiomeType.SPAWN);
    }
}