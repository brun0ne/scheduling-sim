import Processor from "./Processor";
import { CurrentStateData, Results } from "./System";

export default interface DistributionAlgorithm {
    /* should be the same as the filename */
    name: string
    display_name?: string

    pickProcessorToMigrateTo(data: CurrentStateData, results: Results): Processor | null

    reallocateProcesses?(data: CurrentStateData, results: Results): number
}