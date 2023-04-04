import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import AccessAlgorithm from "../AccessAlgorithm";
import ReadCall from "../ReadCall";

/**
 * FCFS (First Come First Served)
 */
export default class FCFS extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "FCFS";
    readOnFly: boolean = false;

    getNextTarget(current_position: number, calls: ReadCall[]): ReadCall {
        return calls[0];
    }
}