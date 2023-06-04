import Processor from "./Processor";
import { CurrentStateData } from "./System";

export default interface DistributionAlgorithm {
    /* should be the same as the filename */
    name: string

    pickProcessorToMigrateTo(data: CurrentStateData): Processor | null
}