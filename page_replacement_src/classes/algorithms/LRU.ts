import ReplacementAlgorithm from "../ReplacementAlgorithm";

import Page from "../Page";
import Frame from "../Frame";

/**
 * Least Recently Used (LRU)
 */
export default class LRU implements ReplacementAlgorithm {
    name: string = "LRU"

    handlePageFault(page_call: Readonly<Page>, last_replaced_index: number, current_frames: ReadonlyArray<Readonly<Frame>>, future_page_calls: ReadonlyArray<Readonly<Page>>, previous_page_calls: ReadonlyArray<Readonly<Page>>): number { 
        /* find the page that was used the longest ago */
        let frame_to_replace_index = -1;
        let least_recently_used_page_index = -1;

        for (let i = 0; i < current_frames.length; i++) {
            const frame = current_frames[i];
            if (frame.page == null) {
                console.warn("Frame is empty - this should be ensured not to happen by the caller");
                return i;
            }

            let page_index = -1;
            for (let j = previous_page_calls.length - 1; j >= 0; j--) {
                const previous_page_call = previous_page_calls[j];

                if (previous_page_call.id == frame.page.id) {
                    page_index = j;
                    break;
                }
            }
            
            if (page_index == -1) {
                /* page was never used before */
                return i;
            }

            if (page_index < least_recently_used_page_index || least_recently_used_page_index == -1) {
                /* page was used longer ago */
                frame_to_replace_index = i;
                least_recently_used_page_index = page_index;
            }
        }

        return frame_to_replace_index;
    }
}
