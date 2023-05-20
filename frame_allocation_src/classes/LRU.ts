import ReplacementAlgorithm from "./ReplacementAlgorithm";
import { MemoryStateData } from "./AllocatingMMU";

/**
 * Least Recently Used (LRU)
 */
export default class LRU implements ReplacementAlgorithm {
    name: string = "LRU"

    handlePageFault(data: MemoryStateData): number {
        /* find the page that was used the longest ago */
        let frame_to_replace_index = -1;
        let least_recently_used_page_index = -1;

        for (let i = 0; i < data.current_frames.length; i++) {
            const frame = data.current_frames[i];

            if (frame.process != data.page_call.process) {
                console.error("Frame is assigned to a different process - this should be ensured not to happen by the caller");
            }

            if (frame.page == null) {
                console.warn("Frame is empty - this should be ensured not to happen by the caller");
                return i;
            }

            let page_index = -1;
            for (let j = data.previous_page_calls.length - 1; j >= 0; j--) {
                const previous_page_call = data.previous_page_calls[j];

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

        if (frame_to_replace_index == -1) {
            console.warn("No frame to replace found by LRU");
            return -1;
        }

        return data.current_frames[frame_to_replace_index].id;
    }
}
