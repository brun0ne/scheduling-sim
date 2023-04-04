import ReadCall from "./ReadCall";

export default abstract class DeltaToTargetAlgorithm {
    abstract getNextTarget(current_position: number, calls: Array<ReadCall>, max_position?: number, current_time?: number, currentTarget?: ReadCall): ReadCall;

    getDelta(current_position: number, calls: Array<ReadCall>, max_position: number, current_time: number, currentTarget: ReadCall): number {
        if (currentTarget == null)
            return 0;

        const diff = currentTarget.position - current_position;

        if (diff > 0)
            return 1;
        else if (diff < 0)
            return -1;
        else
            return 0;
    }
}