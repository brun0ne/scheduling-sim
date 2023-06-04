import Process from "./Process";

export default class Processor {
    id: number
    running_processes: Array<Process> = []
    finished_processes: Array<Process> = []

    load_history: Array<number> = []

    constructor(id: number) {
        this.id = id;
    }

    startProcess(process: Process): void {
        this.running_processes.push(process);
        console.log(`Processor ${this.id} started process ${process.id}`);
    }

    calculateLoad(): number {
        return this.running_processes.reduce((acc, process) => acc + process.load, 0);
    }

    calculateAverageLoad(): number {
        const avgLoad = this.load_history.reduce((acc, load) => acc + load, 0) / this.load_history.length;
        return avgLoad;
    }

    tick(): void {
        this.running_processes.forEach(process => process.tick());

        for (const process of this.running_processes) {
            if (process.ended()) {
                this.finished_processes.push(process);
            }
        }

        this.running_processes = this.running_processes.filter(process => !process.ended());

        const load = this.calculateLoad();
        this.load_history.push(load);

        if (load > 100)
            console.warn(`Processor ${this.id} overloaded (${load}%)`);
    }
}