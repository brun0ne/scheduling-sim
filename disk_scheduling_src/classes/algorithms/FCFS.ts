import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import IAccessAlgorithm from "../IAccessAlgorithm";
import ReadCall from "../ReadCall";

export default class FCFS extends DeltaToTargetAlgorithm implements IAccessAlgorithm {
    name: string = "FCFS";
    readOnFly: boolean = false;

    getNextTarget(current_position: number, calls: ReadCall[]): ReadCall {
        return calls[0];
    }
}