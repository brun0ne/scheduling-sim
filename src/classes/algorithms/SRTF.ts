import AccessAlgorithm from "../AccessAlgorithm";
import Process from "../Process";

export default class SRTF implements AccessAlgorithm {
    name: string = "SRTF"

    preprocess(process_queue: Array<Process>): Array<Process> {
        return process_queue.sort((a, b) => a.time_left - b.time_left);
    }

    pickNext(process_queue: Array<Process>, previousActiveProcess: Process): Process {
        return process_queue[0];
    }
}