import AccessAlgorithm from "../AccessAlgorithm";
import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import ReadCall from "../ReadCall";
import SSTF from "./SSTF";

/*
* Earliest Deadline First
*/
export default class EDF extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "EDF"
    readOnFly: boolean = false
    realTime: boolean = true
    
    getNextTarget(current_position: number, calls: ReadCall[], max_position?: number): ReadCall {
        let target: ReadCall = null;

        for (let i = 0; i < calls.length; i++) {
            if (!calls[i].real_time)
                continue;

            if (target == null || calls[i].absolute_deadline < target.absolute_deadline) {
                target = calls[i];
            }
        }

        /*
        * if there is no real time call, pick the closest one (SSTF)
        */
        if (target == null) {
            target = new SSTF().getNextTarget(current_position, calls);
        }

        return target;
    }
}