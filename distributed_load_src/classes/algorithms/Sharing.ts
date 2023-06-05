import DistributionAlgorithm from "../DistributionAlgorithm";
import Processor from "../Processor";
import { CurrentStateData } from "../System";
import RandomQueriesUntilSuccess from "./RandomQueriesUntilSuccess";

export default class Sharing implements DistributionAlgorithm {
    name: string = "Sharing"

    load_treshold: number
    ask_threshold: number

    constructor(load_threshold: number, ask_threshold: number) {
        this.load_treshold = load_threshold;
        this.ask_threshold = ask_threshold;
    }

    pickProcessorToMigrateTo(data: CurrentStateData): Processor | null {
        return new RandomQueriesUntilSuccess(this.load_treshold).pickProcessorToMigrateTo(data);
    }

    reallocateProcesses(data: CurrentStateData): void {
        if (data.processor.calculateLoad() > this.ask_threshold)
            return;

        /* get an array of shuffled processors */
        const processors = data.all_processors.filter(p => p.id !== data.processor.id);
        processors.sort(() => Math.random() - 0.5);

        for (const other of data.all_processors) {
            if (other.calculateLoad() > this.load_treshold) {
                const process = other.running_processes.pop();
                if (process != null) {
                    data.processor.startProcess(process);
                    break;
                }
            }
        }
    }
}