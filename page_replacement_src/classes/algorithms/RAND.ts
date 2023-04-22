import ReplacementAlgorithm, { MemoryStateData } from "../ReplacementAlgorithm";

/**
 * Random (RAND)
 */
export default class RAND implements ReplacementAlgorithm {
    name: string = "RAND"

    handlePageFault(data: MemoryStateData): number {
        return Math.floor(Math.random() * data.current_frames.length);
    }
}
