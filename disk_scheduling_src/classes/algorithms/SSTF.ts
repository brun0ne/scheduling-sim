import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import AccessAlgorithm from "../AccessAlgorithm";
import ReadCall from "../ReadCall";

export default class SSTF extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "SSTF"
    readOnFly: boolean = false

    currentTarget: ReadCall = null

    SWITCH_TARGET_MID_FLY: boolean = false

    getNextTarget(current_position: number, calls: ReadCall[]): ReadCall {
        /**
         * switch target ONLY if previous target has been reached
         */
        if (this.currentTarget != null && !this.SWITCH_TARGET_MID_FLY)
            return this.currentTarget;

        let min = Infinity;
        let min_index = 0;

        for (let i = 0; i < calls.length; i++) {
            const diff = Math.abs(calls[i].position - current_position);

            if (diff < min) {
                min = diff;
                min_index = i;
            }
        }

        this.currentTarget = calls[min_index];
        return calls[min_index];
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