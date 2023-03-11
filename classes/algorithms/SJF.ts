import AccessAlgorithm from "../AccessAlgorithm";
import Process from "../Process";

export default class SJF implements AccessAlgorithm {
    preprocess(process_queue: Array<Process>): Array<Process> {
        return process_queue.sort((a, b) => a.run_time - b.run_time);
    }

    pickNext(process_queue: Array<Process>): Process {
        return process_queue[0];
    }
}