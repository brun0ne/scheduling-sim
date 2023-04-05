import AccessAlgorithm from "../AccessAlgorithm";
import Process from "../Process";

/**
 * RR (Round Robin)
 */
export default class RR implements AccessAlgorithm {
    quantum: number

    current_quantum: number
    current_processIndex: number

    name: string = "RR"

    constructor(quantum: number){
        this.quantum = quantum;
    }

    preprocess(process_queue: Array<Process>): Array<Process> {
        return process_queue; // do nothing
    }

    pickNext(process_queue: Array<Process>, previousActiveProcess: Process): Process {
        // if it's the first process
        if (previousActiveProcess == null){
            const nextProcess = process_queue[0];

            this.current_processIndex = 0;
            this.current_quantum = this.quantum;

            this.current_quantum--;
            
            return nextProcess;
        }
        
        // if the previous process has time left and quantum left
        if (previousActiveProcess.time_left > 0 && this.current_quantum > 0){
            this.current_quantum--;
            return previousActiveProcess;
        }

        // if the previous process has time left and quantum is over
        if (previousActiveProcess.time_left > 0 && this.current_quantum <= 0){
            this.current_processIndex = (this.current_processIndex + 1) % process_queue.length;
            this.current_quantum = this.quantum;

            this.current_quantum--;

            return process_queue[this.current_processIndex];
        }
        
        // the previous process ended
        if (previousActiveProcess.time_left == 0){
            // the process got removed from queue so return the same index
            this.current_quantum = this.quantum;
            this.current_quantum--;

            if (this.current_processIndex >= process_queue.length) this.current_processIndex = 0;
            
            return process_queue[this.current_processIndex];
        }
    }
}