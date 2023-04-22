import ReplacementAlgorithm, { MemoryStateData } from "../ReplacementAlgorithm";

import Page from "../Page";

/**
 * Approximate Least Recently Used (ALRU)
 */
export default class ALRU implements ReplacementAlgorithm {
    name: string = "ALRU"

    bit_array: Array<boolean> = [];

    onPageCall(page_call: Readonly<Page>) {
        /* initialize the "second chance" bit to 1 */
        if (this.bit_array[page_call.id] == null) {
            this.bit_array[page_call.id] = false;
        }
    }

    onPageAlreadyInMemory(page_call: Readonly<Page>) {
        /* set the "second chance" bit to 1 */
        this.bit_array[page_call.id] = true;
    }

    handlePageFault(data: MemoryStateData): number {
        /* find the firt frame that has the "second chance" bit set to 0 */
        for (let i = 0; i < data.current_frames.length; i++) {
            const frame = data.current_frames[i];
            if (frame.page == null) {
                console.warn("Frame is empty - this should be ensured not to happen by the caller");
                return i;
            }

            /* the "second chance" bit is 0, so we can replace this frame */
            if (this.bit_array[frame.page.id] == false) {
                return i;
            }

            /* set the "second chance" bit to 0 */
            this.bit_array[frame.page.id] = false;
        }

        /* if we get here, all frames had the "second chance" bit set to 1, so we replace the first frame */
        return 0;
    }
}
