import Process from "./Process";
import DistributionAlgorithm from "./DistributionAlgorithm";
import Processor from "./Processor";

export type CurrentStateData = {
    process: Readonly<Process>,
    processor: Readonly<Processor>,
    all_processors: ReadonlyArray<Readonly<Processor>>,
    time: number
}

export type Results = {
    average_load: number
}

export default class System {
    number_of_processors: number = 0
    processors: Array<Processor> = []

    process_pool: Array<Process> = []
    process_queue: Array<Process> = []
    finished_processes: Array<Process> = []

    distributionAlgorithm: DistributionAlgorithm | null = null

    time: number = 0

    constructor() { }

    init(number_of_processors?: number): void {
        this.number_of_processors = number_of_processors ?? this.number_of_processors;

        this.process_queue = [...this.process_pool]; // copy the array
        this.finished_processes = [];

        this.processors = [];
        for (let i = 0; i < this.number_of_processors; i++) {
            this.processors.push(new Processor(i));
        }

        this.time = 0;
    }

    addProcess(process: Process): void {
        this.process_pool.push(process);
    }

    clearProcesses(): void {
        this.process_pool = [];
    }

    setAlgorithm(algorithm: DistributionAlgorithm): void {
        this.distributionAlgorithm = algorithm;
    }

    nextTick(): void {
        /* ensure that an algorithm is selected */
        if (this.distributionAlgorithm == null) {
            throw new Error("No algorithm selected");
        }

        const process = this.process_queue.shift();

        /* no process at this time */
        if (process == null) {
            console.warn("Empty process queue but not finished");
            this.time++;
            return;
        }

        if (process) {
            /* send the process to a random processor */
            const randomProcessor = this.processors[Math.floor(Math.random() * this.processors.length)];

            /* run the distribution algorithm */
            const processor = this.distributionAlgorithm.pickProcessorToMigrateTo?.(this.getCurrentStateData(process, randomProcessor));

            /* ensure that the algorithm returned a different processor */
            if (processor == randomProcessor) {
                throw new Error("Algorithm returned the same processor");
            }

            /* if the algorithm returned a processor, send the process to that processor */
            if (processor != null) {
                processor.startProcess(process);
            }

            /* tick all processors */
            for (const processor of this.processors) {
                processor.tick();
            }

            /* collect all finished processes */
            for (const processor of this.processors) {
                for (const process of processor.finished_processes) {
                    if (!this.finished_processes.includes(process)) {
                        this.finished_processes.push(process);
                    }
                }
            }

            this.time++;
        }
    }

    getCurrentStateData(process: Process, processor: Processor): CurrentStateData {
        return {
            process: process,
            processor: processor,
            all_processors: this.processors,
            time: this.time
        };
    }

    isFinished(): boolean {
        return this.process_queue.length == 0;
    }

    getResults(): Results {
        return {
            average_load: this.calculateAverageLoad()
        };
    }

    calculateAverageLoad(): number {
        const total_load = this.processors.reduce((acc, processor) => acc + processor.calculateAverageLoad(), 0);
        return total_load / this.processors.length;
    }

    simulate(): Results {
        throw new Error("Method not implemented.");
    }
}