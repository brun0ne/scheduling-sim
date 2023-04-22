import ReplacementAlgorithm from "../ReplacementAlgorithm";

import Page from "../Page";
import Frame from "../Frame";

/**
 * First In First Out (FIFO)
 */
export default class FIFO implements ReplacementAlgorithm {
    name: string = "FIFO";

    handlePageFault(page_call: Readonly<Page>, last_replaced_index: number, current_frames: ReadonlyArray<Readonly<Frame>>): number {
        return (last_replaced_index + 1) % current_frames.length;
    }
}
