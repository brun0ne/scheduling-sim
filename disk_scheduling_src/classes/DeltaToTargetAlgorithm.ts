import IAccessAlgorithm from "./IAccessAlgorithm";
import ReadCall from "./ReadCall";

export default abstract class DeltaToTargetAlgorithm {
    abstract getNextTarget(current_position: number, calls: Array<ReadCall>): ReadCall;

    getDelta(current_position: number, calls: Array<ReadCall>): -1|0|1 {
        const diff = this.getNextTarget(current_position, calls).position - current_position;

        if (diff > 0)
            return 1;
        else if (diff < 0)
            return -1;
        else
            return 0;
    }
}