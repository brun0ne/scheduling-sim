import Page from "./Page"
import Frame from "./Frame"
import ReplacementAlgorithm from "./ReplacementAlgorithm"

export default class Memory {
    number_of_pages: number = 0
    number_of_frames: number = 0

    page_calls: Array<Page> = []
    frames: Array<Frame> = []

    algorithm: ReplacementAlgorithm | null = null
    last_replaced_index: number = -1

    total_page_faults: number
    time: number

    constructor() {
        this.time = 0;
        this.total_page_faults = 0;
    }

    init(number_of_pages: number, number_of_frames: number): void {
        this.number_of_pages = number_of_pages;
        this.number_of_frames = number_of_frames;

        this.frames = [];

        this.time = 0;
        this.total_page_faults = 0;

        for (let i = 0; i < this.number_of_frames; i++) {
            this.frames.push(new Frame());
        }
    }

    addPageCallToPool(page_call: Page): void {
        this.page_calls.push(page_call);
    }

    clearPageCallPool(): void {
        this.page_calls = [];
    }

    setAlgorithm(algorithm: ReplacementAlgorithm): void {
        this.algorithm = algorithm;
    }

    nextTick(): void {
        const page_call = this.page_calls.shift();

        /* no page call at this time */
        if (page_call == null) {
            this.time++;
            return;
        }

        console.log("Page call: " + page_call.id);

        if (page_call) {
            let page_fault = true;

            for (let i = 0; i < this.frames.length; i++) {
                if (this.frames[i] == null)
                    throw new Error("Frame is null");

                if (this.frames[i].page == null) {
                    /* insert into the first free frame */
                    this.frames[i].page = page_call;
                    this.last_replaced_index = i;

                    page_fault = false;
                    break;
                }

                if ((<Page> this.frames[i].page).id == page_call.id) {
                    /* page is already in memory */
                    page_fault = false;
                    break;
                }
            }

            /* handle page fault */
            if (page_fault) {
                console.log("Page fault: " + page_call.id);

                /* ensure that there are no free frames */
                if (this.frames.find(frame => frame.page == null) != null) {
                    throw new Error("Initial page fill not handled properly");
                }

                /* ensure that an algorithm is selected */
                if (this.algorithm == null) {
                    throw new Error("No algorithm selected");
                }

                /* increment the total page faults */
                this.total_page_faults++;

                /* replace a page */
                const index_to_replace = this.algorithm.handlePageFault(page_call, this.last_replaced_index, this.frames, this.page_calls);
                this.frames[index_to_replace].page = page_call;

                this.last_replaced_index = index_to_replace;
            }

            /* ensure that the page is now in memory */
            let page_in_memory = false;
            for (const frame of this.frames) {
                if (frame.page == null)
                    continue;

                if ((<Page> frame.page).id == page_call.id) {
                    /* page is in memory */
                    page_in_memory = true;
                    break;
                }
            }
            if (!page_in_memory) {
                throw new Error("Page fault not handled properly - page not in memory");
            }

            /* call the page */
            page_call.call(this.time);
        }

        this.time++;
        this.displayFrames();
    }

    displayFrames(): void {
        console.log("Frames:");
        for (const frame of this.frames) {
            console.log(frame.page ? frame.page.id : "null");
        }
    }
}