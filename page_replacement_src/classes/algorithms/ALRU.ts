import ReplacementAlgorithm, { MemoryStateData } from "../ReplacementAlgorithm";

import Page from "../Page";

/**
 * Approximate Least Recently Used (ALRU)
 */
export default class ALRU implements ReplacementAlgorithm {
    name: string = "ALRU"

    bit_array: Array<boolean> = []
    pointer: number = 0

    onPageAlreadyInMemory(data: MemoryStateData) {
        /* set the "second chance" bit to 1 */
        const index = data.current_frames.findIndex(x => x.page?.id == data.page_call.id);

        if (index == -1)
            throw new Error("ALRU: fatal error (index -1)");

        this.bit_array[index] = true;
    }

    handlePageFault(data: MemoryStateData): number {
        /* make sure all bits are initialized to 0 (if unset) */
        for (let i = 0; i < data.current_frames.length; i++) {
            if (this.bit_array[i] == null)
                this.bit_array[i] = false;
        }

        /* make sure the pointer is in range */
        this.pointer = this.pointer % data.current_frames.length;

        /* find the first frame that has the "second chance" bit set to 0 */
        while (true) {
            const frame = data.current_frames[this.pointer];
            if (frame.page == null) {
                console.warn("Frame is empty - this should be ensured not to happen by the caller");

                /* set the "second chance" bit to 1 */
                this.bit_array[this.pointer] = true;
                return this.pointer++;
            }

            /* the "second chance" bit is 0, so we can replace this frame */
            if (this.bit_array[this.pointer] == false) {
                /* set the "second chance" bit to 1 */
                this.bit_array[this.pointer] = true;
                return this.pointer++;
            }

            /* set the "second chance" bit to 0 */
            this.bit_array[this.pointer] = false;

            /* increment the pointer */
            this.pointer = (this.pointer + 1) % data.current_frames.length;
        }
    }
}
