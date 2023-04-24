import Frame from "./Frame";
import Page from "./Page";

export type MemoryStateData = {
    page_call: Readonly<Page>,
    last_replaced_index: number,
    current_frames: ReadonlyArray<Readonly<Frame>>,
    future_page_calls: ReadonlyArray<Readonly<Page>>,
    previous_page_calls: ReadonlyArray<Readonly<Page>>
}

export default interface ReplacementAlgorithm {
    /* should be the same as the filename */
    name: string

    onPageCall?: (data: MemoryStateData) => void;

    onPageAlreadyInMemory?: (data: MemoryStateData) => void;

    handlePageFault: (data: MemoryStateData) => number;
}
