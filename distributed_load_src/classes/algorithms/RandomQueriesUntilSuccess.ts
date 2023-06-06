import DistributionAlgorithm from "../DistributionAlgorithm";
import Processor from "../Processor";
import { CurrentStateData } from "../System";

export default class RandomQueriesUntilSuccess implements DistributionAlgorithm {
    name: string = "RandomQueriesUntilSuccess"
    display_name: string = "Random Queries Until Success"

    load_threshold: number

    constructor(load_threshold: number) {
        this.load_threshold = load_threshold;
    }

    pickProcessorToMigrateTo(data: CurrentStateData): Processor | null {
        const { processor, all_processors } = data;

        if (processor.calculateLoad() < this.load_threshold)
            return processor; // don't migrate

        const processors = all_processors.filter(p => p.id !== processor.id);

        for (const other of processors) {
            if (other.calculateLoad() < this.load_threshold) {
                return other;
            }
        }

        return null; // postpone to the next tick
    }
}