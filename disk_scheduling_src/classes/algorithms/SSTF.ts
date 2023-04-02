import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import IAccessAlgorithm from "../IAccessAlgorithm";
import ReadCall from "../ReadCall";

export default class SSTF extends DeltaToTargetAlgorithm implements IAccessAlgorithm {
    name: string = "SSTF";
    readOnFly: boolean = false;

    getNextTarget(current_position: number, calls: ReadCall[]): ReadCall {
        let min = Infinity;
        let min_index = 0;

        for (let i = 0; i < calls.length; i++) {
            const diff = Math.abs(calls[i].position - current_position);

            if (diff < min) {
                min = diff;
                min_index = i;
            }
        }

        return calls[min_index];
    }
}