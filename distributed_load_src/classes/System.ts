import Process from "./Process";
import DistributionAlgorithm from "./DistributionAlgorithm";
import Processor from "./Processor";

export type CurrentStateData = {
    process: Readonly<Process>,
    processor: Readonly<Processor>,
    all_processors: ReadonlyArray<Readonly<Processor>>,
    time: number
}

export class Results {
    total_ticks: number = 0
    average_load: number = 0
    std_dev: number = 0
    migrated: number = 0
    not_migrated: number = 0
    postponed: number = 0
    overloaded_processor_ticks: number = 0
    query_count: number = 0
}

export default class System {
    number_of_processors: number = 0
    processors: Array<Processor> = []

    process_pool: Array<Process> = []
    process_queue: Array<Process> = []
    finished_processes: Array<Process> = []

    distributionAlgorithm: DistributionAlgorithm | null = null

    current_result = new Results()

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

        this.current_result = new Results(); // reset results

        for (const process of this.process_queue) {
            process.reset();
        }
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
            const pickedProcessor = this.distributionAlgorithm.pickProcessorToMigrateTo(this.getCurrentStateData(process, randomProcessor), this.current_result);

            /* if the algorithm returned a processor, send the process to that processor */
            if (pickedProcessor != null) {
                pickedProcessor.startProcess(process);

                if (pickedProcessor.id === randomProcessor.id) {
                    /* not migrated */
                    this.current_result.not_migrated++;
                }
                else {
                    /* migrated */
                    this.current_result.migrated++;
                }
            }
            else {
                /* postponed */
                this.current_result.postponed++;
            }

            /* reallocate processes */
            const reallocated = this.distributionAlgorithm.reallocateProcesses?.(this.getCurrentStateData(process, pickedProcessor ?? randomProcessor), this.current_result);
            if (reallocated != null) {
                this.current_result.migrated += reallocated;
            }

            /* tick all processors */
            for (const processor of this.processors) {
                const load = processor.tick();
                if (load > 100) {
                    this.current_result.overloaded_processor_ticks++;
                }
            }

            /* collect all finished processes */
            for (const processor of this.processors) {
                for (const process of processor.finished_processes) {
                    if (!this.finished_processes.includes(process)) {
                        this.finished_processes.push(process);
                    }
                }
            }

            /* if the process execution was postponed, add it to the front of the queue */
            if (pickedProcessor == null) {
                this.process_queue.unshift(process);
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
        this.current_result.average_load = this.calculateAverageLoad();
        this.current_result.std_dev = this.calculateStandardDeviation(this.current_result.average_load);
        this.current_result.total_ticks = this.time;

        return this.current_result;
    }

    calculateAverageLoad(): number {
        const total_load = this.processors.reduce((acc, processor) => acc + processor.calculateAverageLoad(), 0);
        return total_load / this.processors.length;
    }

    calculateStandardDeviation(average?: number): number {
        const avg = average ?? this.calculateAverageLoad();
        const variance = this.processors.reduce((acc, processor) => acc + Math.pow(processor.calculateAverageLoad() - avg, 2), 0) / this.processors.length;
        return Math.sqrt(variance);
    }

    simulate(): Results {
        this.init();

        while (!this.isFinished()) {
            this.nextTick();
        }

        return this.getResults();
    }

    displayResults(results?: Results, algStr: string = this.distributionAlgorithm!.display_name ?? this.distributionAlgorithm!.name): void {
        const results_wrapper = document.getElementById("results_wrapper") as HTMLElement;
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results") as HTMLElement;
        results_el.innerHTML = `
        Algorithm: ${algStr}

        Average load: ${results!.average_load.toFixed(2)} +- ${results!.std_dev.toFixed(2)}

        Total ticks: ${results!.total_ticks}
        Migrated: ${results!.migrated}
        Not migrated: ${results!.not_migrated}
        Postponed: ${results!.postponed}
        Overloaded processor ticks: ${results!.overloaded_processor_ticks}
        Query count: ${results!.query_count}
        `.replace(RegExp("\n", "g"), "<br />");
    }

    compareAllAndDisplayResults(algorithms: Array<DistributionAlgorithm>): void {
        const results_wrapper = document.getElementById("results_wrapper") as HTMLElement;
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results") as HTMLElement;
        results_el.innerHTML = "";

        for (let i = 0; i < algorithms.length; i++) {
            this.setAlgorithm(algorithms[i]);
            const results: Results = this.simulate();

            results_el.innerHTML += `
            Algorithm: <span style="color: yellow">${algorithms[i].display_name ?? algorithms[i].name}</span>
            Average load: <span style="color: yellow">${results.average_load.toFixed(2)}</span> +- ${results.std_dev.toFixed(2)}
            Migrations: <span style="color: yellow">${results.migrated}</span> / ${results.not_migrated + results.migrated + results.postponed}
            Postponed process ticks: <span style="color: yellow">${results.postponed}</span>
            Query count: <span style="color: yellow">${results.query_count}</span>
            `.replace(RegExp("\n", "g"), "<br />");

            results_el.innerHTML += "<br />";
        }
    }
}