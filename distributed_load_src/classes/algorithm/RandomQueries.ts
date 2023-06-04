import DistributionAlgorithm from "../DistributionAlgorithm";
import Processor from "../Processor";
import { CurrentStateData } from "../System";

export default class RandomQueries implements DistributionAlgorithm {
    name: string = "RandomQueries"

    load_threshold: number
    number_of_tries: number

    constructor(load_threshold: number, number_of_tries: number) {
        this.load_threshold = load_threshold;
        this.number_of_tries = number_of_tries;
    }

    pickProcessorToMigrateTo(data: CurrentStateData): Processor | null {
        const { processor, all_processors } = data;
        const processors = all_processors.filter(p => p.id !== processor.id);

        const checked: Array<Processor> = [];

        for (let i = 0; i < this.number_of_tries; i++) {
            const not_yet_checked = processors.filter(p => !checked.includes(p));

            const random_index = Math.floor(Math.random() * not_yet_checked.length);
            const random_processor = not_yet_checked[random_index];

            if (random_processor.calculateLoad() < this.load_threshold) {
                return random_processor;
            }

            checked.push(random_processor);
        }

        return null; // don't migrate
    }
}