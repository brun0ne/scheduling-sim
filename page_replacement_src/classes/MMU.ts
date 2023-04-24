import Page from "./Page"
import Frame from "./Frame"
import ReplacementAlgorithm, { MemoryStateData } from "./ReplacementAlgorithm"

type results = {
    total_page_faults: number,
    total_page_hits: number,
    total_page_calls: number
}

/**
 * Memory Management Unit
 */
export default class MMU {
    number_of_pages: number = 0
    number_of_frames: number = 0

    page_call_pool: Array<Page> = []
    page_call_queue: Array<Page> = []
    previous_page_calls: Array<Page> = []

    frames: Array<Frame> = []

    algorithm: ReplacementAlgorithm | null = null
    last_replaced_index: number = -1

    total_page_faults: number
    time: number

    last_call_caused_fault: boolean = false

    constructor() {
        this.time = 0;
        this.total_page_faults = 0;
    }

    init(number_of_pages?: number, number_of_frames?: number): void {
        this.number_of_pages = number_of_pages ?? this.number_of_pages;
        this.number_of_frames = number_of_frames ?? this.number_of_frames;

        this.page_call_queue = [...this.page_call_pool]; // copy array
        this.frames = [];
        this.previous_page_calls = [];

        this.time = 0;
        this.total_page_faults = 0;

        for (let i = 0; i < this.number_of_frames; i++) {
            this.frames.push(new Frame());
        }
    }

    addPageCallToPool(page_call: Page): void {
        this.page_call_pool.push(page_call);
    }

    addPageCallsToPool(page_calls: Array<number>) {
        for (let i = 0; i < page_calls.length; i++) {
            this.page_call_pool.push(new Page(page_calls[i]));
        }
    }

    clearPageCallPool(): void {
        this.page_call_pool = [];
    }

    setAlgorithm(algorithm: ReplacementAlgorithm): void {
        this.algorithm = algorithm;
    }

    nextTick(): void {
        /* ensure that an algorithm is selected */
        if (this.algorithm == null) {
            throw new Error("No algorithm selected");
        }

        const page_call = this.page_call_queue.shift();

        /* no page call at this time */
        if (page_call == null) {
            console.warn("Empty page call queue but not finished");
            this.time++;
            return;
        }
        
        this.previous_page_calls.push(page_call);
        console.log("Page call: " + page_call.id);

        if (page_call) {
            this.algorithm.onPageCall?.(this.getCurrentStateData(page_call));

            /* check if there is a page fault */
            let page_fault = true;
            for (let i = 0; i < this.frames.length; i++) {
                if (this.frames[i] == null)
                    throw new Error("Frame is null");

                if (this.frames[i].page == null) {
                    /* insert into the first free frame */
                    this.frames[i].page = page_call;
                    this.last_replaced_index = i;

                    /* increment the total page faults */
                    this.total_page_faults++;
                    this.last_call_caused_fault = true;

                    page_fault = false; // page fault already handled
                    break;
                }

                if ((<Page> this.frames[i].page).id == page_call.id) {
                    /* page is already in memory */
                    this.algorithm.onPageAlreadyInMemory?.(this.getCurrentStateData(page_call));

                    this.last_call_caused_fault = false;
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

                /* increment the total page faults */
                this.total_page_faults++;
                this.last_call_caused_fault = true;

                /* replace a page */
                const index_to_replace = this.algorithm.handlePageFault(this.getCurrentStateData(page_call));
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
    }

    getCurrentStateData(page_call: Page): MemoryStateData {
        const data: MemoryStateData = {
            page_call: page_call,
            last_replaced_index: this.last_replaced_index,
            current_frames: this.frames,
            future_page_calls: this.page_call_queue,
            previous_page_calls: this.previous_page_calls
        };

        return data;
    }

    isFinished(): boolean {
        return this.page_call_queue.length == 0;
    }

    simulate(): results {
        this.init();

        while (!this.isFinished()) {
            this.nextTick();
        }

        return this.getResults();
    }

    getResults(): results {
        return {
            total_page_faults: this.total_page_faults,
            total_page_hits: this.previous_page_calls.length - this.total_page_faults,
            total_page_calls: this.previous_page_calls.length
        };
    }

    /**
     * visualization & output
     */

    printFrames(): void {
        console.log("Frames:");
        for (const frame of this.frames) {
            console.log(frame.page ? frame.page.id : "null");
        }
    }

    displayResults(results: results, algStr: string = (<Algorithm> this.algorithm).name): void {
        const results_wrapper = document.getElementById("results_wrapper") as HTMLElement;
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results") as HTMLElement;
        results_el.innerHTML = `
        Algorithm: ${algStr.toUpperCase()}

        Total page faults: <b style='color: red'>${results.total_page_faults.toFixed(0)}</b>
        Total page hits: <b style='color: lime'>${results.total_page_hits.toFixed(0)}</b>
        Total page calls: <b>${results.total_page_calls.toFixed(0)}</b>
        `.replace(RegExp("\n", "g"), "<br />");
    }

    compareAllAndDisplayResults(algorithms: Array<ReplacementAlgorithm>): void {
        const results_wrapper = document.getElementById("results_wrapper") as HTMLElement;
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results") as HTMLElement;
        results_el.innerHTML = "";

        for (let i = 0; i < algorithms.length; i++) {
            this.setAlgorithm(algorithms[i]);
            const results: results = this.simulate();

            results_el.innerHTML += `
            Algorithm: ${algorithms[i].name.toUpperCase()}
            Total page faults: <b style='color: red'>${results.total_page_faults.toFixed(0)}</b>
            Total page hits: <b style='color: lime'>${results.total_page_hits.toFixed(0)}</b>
            Total page calls: <b>${results.total_page_calls.toFixed(0)}</b>
            `.replace(RegExp("\n", "g"), "<br />");

            results_el.innerHTML += "<br />";
        }
    }
}