import AccessAlgorithm from "./AccessAlgorithm";
import ReadCall from "./ReadCall";

export default abstract class DeltaToTargetAlgorithm {
    abstract getNextTarget(current_position: number, calls: Array<ReadCall>, max_position?: number, current_time?: number): ReadCall;

    getDelta(current_position: number, calls: Array<ReadCall>, max_position?: number, current_time?: number): number {
        const nextTarget = this.getNextTarget(current_position, calls);

        if (nextTarget == null)
            return 0;

        const diff = nextTarget.position - current_position;

        if (diff > 0)
            return 1;
        else if (diff < 0)
            return -1;
        else
            return 0;
    }
}