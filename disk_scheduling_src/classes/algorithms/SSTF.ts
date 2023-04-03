import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import AccessAlgorithm from "../AccessAlgorithm";
import ReadCall from "../ReadCall";

export default class SSTF extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "SSTF"
    readOnFly: boolean = false

    SWITCH_TARGET_MID_FLY: boolean = false

    getNextTarget(current_position: number, calls: ReadCall[], max_position?: number, current_time?: number, currentTarget?: ReadCall): ReadCall {
        /**
         * SWITCH_TARGET_MID_FLY
         *  - switch target ONLY if previous target has been reached
         */
        if (currentTarget != null && !this.SWITCH_TARGET_MID_FLY)
            return currentTarget;

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