import Process from "./Process"
import AccessAlgorithm from "./AccessAlgorithm"

export default class Scheduler {
    process_queue:    Array<Process>    // processes in queue
    process_pool:     Array<Process>    // all processes 
    finished_processes: Array<Process>    // finished 

    algorithm: AccessAlgorithm

    time: number

    constructor(){
        this.reset();
    }

    setAlgorithm(algorithm: AccessAlgorithm){
        this.algorithm = algorithm;
    }

    reset(): void{
        this.process_pool = [];
        this.process_queue = [];
        this.finished_processes = [];

        this.time = 0;
    }

    addProcessToPool(process: Process): void{
        this.process_pool.push(process);
    }

    nextTick(): void {
        // check for processes which should join the queue
        for (const process of this.process_pool){
            if (process.start_time == this.time) this.process_queue.push(process);
        };

        // if queue is not empty
        if (this.process_queue.length > 0)
        {
            this.process_queue = this.algorithm.preprocess(this.process_queue);

            // increase wait_time
            for (const process of this.process_queue){
                process.wait_time++;
            };

            // pick a process from the queue to be run in this tick
            let current_process: Process = this.algorithm.pickNext(this.process_queue);
            let finished: boolean = current_process.run();

            // if it's finished, remove from queue
            if (finished)
            {
                this.finished_processes.push(current_process);
                this.process_queue.splice(this.process_queue.indexOf(current_process), 1);
            }
        }

        // increase time
        this.time++;
    }

    simulate(): any{
        while (this.process_pool.length != this.finished_processes.length){
            this.nextTick();
        }

        /* when finished */
        
        // average time
        let avgWaitTime = 0;
        for (const process of this.finished_processes) {
            avgWaitTime += process.wait_time;
        }
        avgWaitTime /= this.finished_processes.length;

        // maximum time
        let maxTime = Math.max(...this.finished_processes.map(o => o.wait_time));

        return { avgWaitTime, maxTime };
    }
}