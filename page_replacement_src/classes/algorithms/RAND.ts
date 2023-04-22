import ReplacementAlgorithm from "../ReplacementAlgorithm";

import Page from "../Page";
import Frame from "../Frame";

/**
 * Random (RAND)
 */
export default class RAND implements ReplacementAlgorithm {
    name: string = "RAND"

    handlePageFault(page_call: Readonly<Page>, last_replaced_index: number, current_frames: ReadonlyArray<Readonly<Frame>>, future_page_calls: ReadonlyArray<Readonly<Page>>): number {
        return Math.floor(Math.random() * current_frames.length);
    }
}
