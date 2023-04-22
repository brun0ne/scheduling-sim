import Frame from "./Frame";
import Page from "./Page";

export default interface ReplacementAlgorithm {
    /* should be the same as the filename */
    name: string

    onPageCall?: (page_call: Readonly<Page>) => void;

    onPageAlreadyInMemory?: (page_call: Readonly<Page>) => void;

    handlePageFault: (page_call: Readonly<Page>, 
        last_replaced_index: number, 
        current_frames: ReadonlyArray<Readonly<Frame>>, 
        future_page_calls: ReadonlyArray<Readonly<Page>>,
        previous_page_calls: ReadonlyArray<Readonly<Page>>) => number;
}
