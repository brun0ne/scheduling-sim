import AccessAlgorithm from "../AccessAlgorithm";
import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import ReadCall from "../ReadCall";
import RealTimeReadCall from "../RealTimeReadCall";
import SSTF from "./SSTF";

/*
 * Earliest Deadline First
 */
export default class EDF extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "EDF"
    readOnFly: boolean = false
    realTime: boolean = true

    /**
     * switch target ONLY if previous target has been reached
     */
    SWITCH_TARGET_MID_FLY: boolean = true
    
    getNextTarget(current_position: number, calls: ReadCall[], max_position?: number, current_time?: number, currentTarget?: ReadCall): ReadCall {
        let target: ReadCall = null;

        for (let i = 0; i < calls.length; i++) {
            if (!(calls[i] instanceof RealTimeReadCall))
                continue;

            if (target == null || calls[i].absolute_deadline < target.absolute_deadline) {
                target = calls[i];
            }
        }

        if (currentTarget != null && target != null && !this.SWITCH_TARGET_MID_FLY)
            return currentTarget;

        /*
         * if there is no real time call, pick the closest one (SSTF)
         * it should default to SSTF's switch_target_mid_fly
         */
        if (target == null) {
            target = new SSTF().getNextTarget(current_position, calls, max_position, current_time, currentTarget);
        }

        return target;
    }
}