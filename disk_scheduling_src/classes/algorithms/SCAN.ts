import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import AccessAlgorithm from "../AccessAlgorithm";
import ReadCall from "../ReadCall";

export default class SCAN extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "SCAN"
    readOnFly: boolean = true

    direction: boolean = true

    getNextTarget(current_position: number, calls: ReadCall[]): ReadCall {
        /* 
         * target is not used (readOnFly = true)
         */

        return null;
    }

    getDelta(current_position: number, calls: ReadCall[], max_position: number): -1|0|1 {
        /* 
         * change direction at the edges
         */

        if (this.direction) {
            if (current_position >= max_position) {
                this.direction = false;
                return -1;
            }
            return 1;
        }
        else
        {
            if (current_position <= 0) {
                this.direction = true;
                return 1;
            }
            return -1;
        }
    }
}