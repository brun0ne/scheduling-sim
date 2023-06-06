import Processor from "./Processor";
import { CurrentStateData } from "./System";

export default interface DistributionAlgorithm {
    /* should be the same as the filename */
    name: string
    display_name?: string

    pickProcessorToMigrateTo(data: CurrentStateData): Processor | null

    reallocateProcesses?(data: CurrentStateData): void
}