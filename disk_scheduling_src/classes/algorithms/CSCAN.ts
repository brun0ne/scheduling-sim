import AccessAlgorithm from "../AccessAlgorithm";
import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import ReadCall from "../ReadCall";

export default class CSCAN extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "CSCAN"
    readOnFly: boolean = true

    getNextTarget(current_position: number, calls: ReadCall[]): ReadCall {
        /* 
        * target is not used (readOnFly = true)
        */

        return null;
    }

    getDelta(current_position: number, calls: ReadCall[], max_position: number): number {
        /* 
        * at the end, go to the beginning
        */

        if (current_position >= max_position) {
            return -current_position;
        }

        return 1;
    }
}