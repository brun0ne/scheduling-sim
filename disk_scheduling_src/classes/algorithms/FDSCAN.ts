import AccessAlgorithm from "../AccessAlgorithm";
import DeltaToTargetAlgorithm from "../DeltaToTargetAlgorithm";
import ReadCall from "../ReadCall";
import SCAN from "./SCAN";

/**
 * Feasible Deadline SCAN
 * 
 * if there are no real-time calls in the queue, then the algorithm behaves like SCAN
 * otherwise:
 * -> if there is no target, set the target to the nearest real-time call if it can be reached in time
 * -> if there is a target, move the head towards it
 * 
 */
export default class FDSCAN extends DeltaToTargetAlgorithm implements AccessAlgorithm {
    name: string = "FDSCAN"
    readOnFly: boolean = true
    realTime: boolean = true

    nextRealTimeTarget: ReadCall = null

    inner_SCAN: SCAN = new SCAN();

    getNextTarget(head_position: number, call_queue: ReadCall[], max_position: number, current_time: number): ReadCall {
        /*
        * if there are no real-time calls in the queue, then the algorithm behaves like SCAN
        */
        if (!call_queue.some(call => call.real_time))
            return this.inner_SCAN.getNextTarget(head_position, call_queue);

        /*
        * otherwise:
        */
        if (!this.nextRealTimeTarget) {
            // get all real-time calls
            const realTimeCalls = call_queue.filter(call => call.real_time);

            // get the nearest real-time call
            let nearestRealTimeCall = realTimeCalls[0];
            for (let i = 1; i < realTimeCalls.length; i++) {
                if (Math.abs(realTimeCalls[i].position - head_position) < Math.abs(nearestRealTimeCall.position - head_position))
                    nearestRealTimeCall = realTimeCalls[i];
            }

            // if the nearest real-time call can be reached in time, set it as the target
            if (Math.abs(nearestRealTimeCall.position - head_position) <= nearestRealTimeCall.absolute_deadline - current_time)
                this.nextRealTimeTarget = nearestRealTimeCall;
            else
                return this.inner_SCAN.getNextTarget(head_position, call_queue);
        }

        return this.nextRealTimeTarget;
    }
    
    override getDelta(head_position: number, call_queue: ReadCall[], max_position: number): number {
        /**
         * remove the target if it has been reached
         */
        if (this.nextRealTimeTarget && this.nextRealTimeTarget.position == head_position)
            this.nextRealTimeTarget = undefined;

        /**
         * if there is no target, then the algorithm behaves like SCAN
         */
        if (!this.nextRealTimeTarget)
            return this.inner_SCAN.getDelta(head_position, call_queue, max_position);

        return super.getDelta(head_position, call_queue, max_position);
    }
}