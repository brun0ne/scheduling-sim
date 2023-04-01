import Process from "./Process";

export default interface AccessAlgorithm {
    name: string

    preprocess(process_queue: Array<Process>): Array<Process>;

    pickNext(process_queue: Array<Process>, previousActiveProcess: Process): Process;
}