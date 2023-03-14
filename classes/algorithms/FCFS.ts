import AccessAlgorithm from "../AccessAlgorithm";
import Process from "../Process";

export default class FCFS implements AccessAlgorithm {
    name: string = "FCFS"

    preprocess(process_queue: Array<Process>): Array<Process> {
        return process_queue; // do nothing
    }

    pickNext(process_queue: Array<Process>, previousActiveProcess: Process): Process {
        return process_queue[0]; // returns the first element (first come)
    }
}
