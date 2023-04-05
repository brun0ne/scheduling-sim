import AccessAlgorithm from "../AccessAlgorithm";
import Process from "../Process";

/**
 * SJF (Shortest Job First)
 */
export default class SJF implements AccessAlgorithm {
    name: string = "SJF"

    preprocess(process_queue: Array<Process>): Array<Process> {
        return process_queue.sort((a, b) => a.run_time - b.run_time);
    }

    pickNext(process_queue: Array<Process>, previousActiveProcess: Process): Process {
        if (previousActiveProcess != null && previousActiveProcess.time_left > 0)
            return previousActiveProcess;

        return process_queue[0];
    }
}