import Process from "./Process";

export default interface AccessAlgorithm {
    preprocess(process_queue: Array<Process>): Array<Process>;

    pickNext(process_queue: Array<Process>): Process;
}