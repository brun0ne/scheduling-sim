import Frame from "./Frame";
import Page from "./Page";

import { MemoryStateData } from "./AllocatingMMU";

export default interface ReplacementAlgorithm {
    /* should be the same as the filename */
    name: string

    onPageCall?: (data: MemoryStateData) => void;

    onPageAlreadyInMemory?: (data: MemoryStateData) => void;

    handlePageFault: (data: MemoryStateData) => number;
}
