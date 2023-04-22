import ReplacementAlgorithm, { MemoryStateData } from "../ReplacementAlgorithm";

/**
 * Optimal (OPT)
 * Not possible to implement in practice (without the knowledge of the future calls)
 */
export default class OPT implements ReplacementAlgorithm {
    name: string = "OPT"

    handlePageFault(data: MemoryStateData): number {
        /* find the page that will be used the farthest in the future */
        let frame_to_replace_index = -1;
        let farthest_page_index = -1;

        for (let i = 0; i < data.current_frames.length; i++) {
            const frame = data.current_frames[i];
            if (frame.page == null) {
                console.warn("Frame is empty - this should be ensured not to happen by the caller");
                return i;
            }

            let page_index = -1;
            for (let j = 0; j < data.future_page_calls.length; j++) {
                const future_page_call = data.future_page_calls[j];

                if (future_page_call.id == frame.page.id) {
                    page_index = j;
                    break;
                }
            }
            
            if (page_index == -1) {
                /* page is not used in the future */
                return i;
            }

            if (page_index > farthest_page_index) {
                /* page is used further in the future */
                frame_to_replace_index = i;
                farthest_page_index = page_index;
            }
        }

        return frame_to_replace_index;
    }
}
