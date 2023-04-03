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

    currentTarget: ReadCall = null

    SWITCH_TARGET_MID_FLY: boolean = true
    
    getNextTarget(current_position: number, calls: ReadCall[], max_position?: number): ReadCall {
        /**
         * switch target ONLY if previous target has been reached
         */
        if (this.currentTarget != null && !this.SWITCH_TARGET_MID_FLY)
            return this.currentTarget;

        let target: ReadCall = null;

        for (let i = 0; i < calls.length; i++) {
            if (!(calls[i] instanceof RealTimeReadCall))
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

        this.currentTarget = target;
        return target;
    }

    getDelta(current_position: number, calls: ReadCall[], max_position?: number): number {
        /**
         * remove the target if it has been reached
         */
        if (this.currentTarget != null && this.currentTarget.position == current_position) {
            this.currentTarget = null;
        }

        return super.getDelta(current_position, calls, max_position);
    }
}