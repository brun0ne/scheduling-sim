import ReplacementAlgorithm, { MemoryStateData } from "../ReplacementAlgorithm";

/**
 * First In First Out (FIFO)
 */
export default class FIFO implements ReplacementAlgorithm {
    name: string = "FIFO";

    handlePageFault(data: MemoryStateData): number {
        return (data.last_replaced_index + 1) % data.current_frames.length;
    }
}
