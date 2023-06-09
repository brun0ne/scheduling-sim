import AllocationAlgorithm from "./AllocationAlgorithm"

import Frame from "./Frame"
import Page from "./Page"
import Process from "./Process"

import ReplacementAlgorithm from "./ReplacementAlgorithm"
import LRU from "./LRU"

export type MemoryStateData = {
    page_call: Readonly<Page>,
    current_frames: ReadonlyArray<Readonly<Frame>>,
    previous_page_calls: ReadonlyArray<Readonly<Page>>,
    processes: ReadonlyArray<Readonly<Process>>
};

export type Results = {
    total_page_faults: number,
    total_page_hits: number,
    total_calls: number
};

export default class AllocatingMMU {
    processes: Array<Process> = []
    frames: Array<Frame> = []

    call_pool: Array<Page> = []
    call_queue: Array<Page> = []
    call_history: Array<Page> = []

    number_of_frames: number = 0
    number_of_pages: number = 0

    allocationAlgorithm: AllocationAlgorithm | null = null
    replacementAlgorithm: ReplacementAlgorithm = new LRU()

    total_page_faults: number = 0
    time: number = 0

    last_call_caused_fault: boolean = false
    last_empty_queue: boolean = false

    constructor() { }

    init(number_of_frames?: number): void {
        this.number_of_frames = number_of_frames ?? this.number_of_frames;

        this.call_queue = [...this.call_pool]; // copy array
        this.frames = [];
        this.call_history = [];

        this.time = 0;
        this.total_page_faults = 0;

        for (let i = 0; i < this.number_of_frames; i++) {
            this.frames.push(new Frame(i));
        }

        for (const process of this.processes) {
            process.reset();
        }
    }

    addProcess(process: Process): void {
        this.processes.push(process);
    }

    clearProcesses(): void {
        this.processes = [];
    }

    generatePageCallPool(): void {
        for (let i = 0; i < this.processes.length; i++) {
            this.processes[i].generateCalls();
            this.addPageCallsToPool(this.processes[i].getCalls(), this.processes[i]);
        }
    }

    private addPageCallToPool(page_call: Page): void {
        this.call_pool.push(page_call);
    }

    private addPageCallsToPool(page_calls: Array<number>, process: Process) {
        for (let i = 0; i < page_calls.length; i++) {
            this.addPageCallToPool(new Page(page_calls[i], process));
        }
    }

    clearPageCallPool(): void {
        this.call_pool = [];
    }

    setAlgorithm(algorithm: AllocationAlgorithm): void {
        this.allocationAlgorithm = algorithm;
    }

    nextTick(): void {
        /* ensure that an algorithm is selected */
        if (this.allocationAlgorithm == null) {
            throw new Error("No algorithm selected");
        }

        /* check if any process is stopped/resumed */
        for (const process of this.processes) {
            process.updateRunningStatus(this.frames);
        }

        /* deallocate finished processes */
        this.frames.forEach(frame => {
            if (frame.process != null && !frame.process.running)
                frame.process = null;
        });

        /* reallocate frames to processes */
        this.allocationAlgorithm.allocateFrames?.(this.frames, this.processes);

        /* remove pages from unallocated frames */
        this.frames.forEach(frame => {
            if (frame.process == null && frame.page != null)
                frame.page = null;
        });

        const unallocatedFramesLength = this.frames.filter(frame => frame.process == null).length;
        if (unallocatedFramesLength > 0) {
            console.warn(`Not all frames are allocated\nAllocated: ${this.frames.length - unallocatedFramesLength}\nUnallocated: ${unallocatedFramesLength}`);
        }

        /* check again if any process is stopped/resumed */
        for (const process of this.processes) {
            process.updateRunningStatus(this.frames);
        }

        /* traverse the queue until a call belonging to a running process is found */
        let page_call: Page | null = null;
        for (let i = 0; i < this.call_queue.length; i++) {
            if (this.call_queue[i].process.running) {
                page_call = this.call_queue[i];
                this.call_queue.splice(i, 1);
                break;
            }
        }

        /* no page call at this time */
        if (page_call == null) {
            console.warn("Empty page call queue or no processes running");
            this.time++;
            this.last_empty_queue = true;
            return;
        }
        this.last_empty_queue = false;

        this.call_history.push(page_call);
        console.log("Page call: " + page_call.id);

        if (page_call) {
            /* execute replacement algorithm */
            this.replacementAlgorithm.onPageCall?.(this.getCurrentStateData(page_call));

            /* check if there is a page fault */
            let page_fault = true;
            for (let i = 0; i < this.frames.length; i++) {
                if (this.frames[i] == null)
                    throw new Error("Frame is null");

                if (this.frames[i].page == null && this.frames[i].process == page_call.process) {
                    /* insert into the first free frame assigned to the process */
                    this.frames[i].page = page_call;

                    /* increment page faults */
                    this.total_page_faults++;
                    page_call.process.page_faults++;

                    this.last_call_caused_fault = true;

                    page_fault = false; // page fault already handled
                    break;
                }

                if (this.frames[i].page != null && this.frames[i].page!.id == page_call.id) {
                    /* page is already in memory */
                    this.replacementAlgorithm.onPageAlreadyInMemory?.(this.getCurrentStateData(page_call));

                    this.last_call_caused_fault = false;
                    page_fault = false;
                    break;
                }
            }

            /* handle page fault */
            if (page_fault) {
                console.log("Page fault: " + page_call.id);

                /* ensure that there are no free frames assigned to the process */
                if (this.frames.find(frame => frame.process == page_call!.process && frame.page == null) != null) {
                    throw new Error("Initial page fill not handled properly");
                }

                /* increment page faults */
                this.total_page_faults++;
                page_call.process.page_faults++;

                this.last_call_caused_fault = true;

                /* replace a page */
                const id_of_frame_to_replace = this.replacementAlgorithm.handlePageFault(this.getCurrentStateData(page_call));

                if (id_of_frame_to_replace != -1)
                    this.frames[this.getFrameIndexById(id_of_frame_to_replace)].page = page_call;
            }

            /* ensure that the page is now in memory */
            let page_in_memory = false;
            for (const frame of this.frames) {
                if (frame.page == null)
                    continue;

                if ((<Page>frame.page).id == page_call.id) {
                    /* page is in memory */
                    page_in_memory = true;
                    break;
                }
            }
            if (!page_in_memory) {
                throw new Error("Page fault not handled properly - page not in memory");
            }

            /* call the page */
            page_call.call(this.time, this.last_call_caused_fault);
        }

        this.time++;
    }

    getCurrentStateData(page_call: Page): MemoryStateData {
        /* get the state of the memory assigned to the process */
        const process_frames = this.frames.filter(frame => frame.process == page_call.process);
        const process_call_history = this.call_history.filter(call => call.process == page_call.process);

        const data: MemoryStateData = {
            page_call: page_call,
            current_frames: process_frames,
            previous_page_calls: process_call_history,
            processes: this.processes
        };

        return data;
    }

    isFinished(): boolean {
        return this.call_queue.length == 0;
    }

    private getFrameIndexById(id: number): number {
        for (let i = 0; i < this.frames.length; i++) {
            if (this.frames[i].id == id)
                return i;
        }

        return -1;
    }

    getResults(): Results {
        const results = {
            total_page_faults: this.total_page_faults,
            total_page_hits: this.call_history.length - this.total_page_faults,
            total_calls: this.call_history.length
        }

        return results;
    }

    simulate(): Results {
        this.init();

        while (!this.isFinished()) {
            this.nextTick();

            const MAX_TIME = 10000;
            if (this.time > MAX_TIME) {
                console.warn("Simulation timed out");
                break;
            }
        }

        return this.getResults();
    }

    displayResults(results?: Results,
        algStr: string = this.allocationAlgorithm!.display_name ?? this.allocationAlgorithm!.name
        ): void {
        const results_wrapper = document.getElementById("results_wrapper") as HTMLElement;
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results") as HTMLElement;
        results_el.innerHTML = `
        Algorithm: ${algStr}

        Total page faults: <b style='color: red'>${results!.total_page_faults.toFixed(0)}</b>
        Total page hits: <b style='color: lime'>${results!.total_page_hits.toFixed(0)}</b>
        Total page calls: <b>${results!.total_calls.toFixed(0)}</b>
        `.replace(RegExp("\n", "g"), "<br />");
    }

    compareAllAndDisplayResults(algorithms: Array<AllocationAlgorithm>): void {
        const results_wrapper = document.getElementById("results_wrapper") as HTMLElement;
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results") as HTMLElement;
        results_el.innerHTML = "";

        const process_data: Array<Array<number>> = [];

        for (let i = 0; i < algorithms.length; i++) {
            this.setAlgorithm(algorithms[i]);
            const results: Results = this.simulate();

            results_el.innerHTML += `
            Algorithm: ${algorithms[i].display_name ?? algorithms[i].name}
            Total page faults: <b style='color: red'>${results.total_page_faults.toFixed(0)}</b>
            Total page hits: <b style='color: lime'>${results.total_page_hits.toFixed(0)}</b>
            Total page calls: <b>${results.total_calls.toFixed(0)}</b>
            `.replace(RegExp("\n", "g"), "<br />");

            results_el.innerHTML += "<br />";

            /* copy individual process page faults to process_data */
            for (let j = 0; j < this.processes.length; j++) {
                if (process_data[i] == null)
                    process_data[i] = [];

                process_data[i].push(this.processes[j].page_faults);
            }
        }

        /* compare results for each process individually (as a table) */
        
        /* 
         * top row is the header, for the algorithm names (first cell left empty - corner)
         * first colums is the process ids (first cell left empty - corner)
         * each cell is the number of page faults for the process with the algorithm
         */

        const table_wrapper = document.createElement("div");
        table_wrapper.style.display = "flex";
        table_wrapper.style.flexDirection = "column";
        table_wrapper.style.alignItems = "center";

        const table = document.createElement("table");
        table.style.border = "1px solid white";
        table.style.borderCollapse = "collapse";

        // add the table into the wrapper
        table_wrapper.appendChild(table);

        const header_row = document.createElement("tr");

        const header_cell = document.createElement("td");
        header_cell.style.border = "1px solid white";
        header_cell.style.padding = "5px";
        header_cell.style.color = "yellow";
        header_cell.innerHTML = "Process";
        header_row.appendChild(header_cell);

        for (let i = 0; i < algorithms.length; i++) {
            const header_cell = document.createElement("td");
            header_cell.style.border = "1px solid white";
            header_cell.style.padding = "5px";
            header_cell.style.color = "yellow";

            header_cell.innerHTML = algorithms[i].display_name ?? algorithms[i].name;
            header_row.appendChild(header_cell);
        }

        table.appendChild(header_row);

        for (let i = 0; i < this.processes.length; i++) {
            const row = document.createElement("tr");

            const cell = document.createElement("td");
            cell.style.border = "1px solid white";
            cell.style.padding = "5px";
            cell.style.color = "yellow";
            cell.innerHTML = this.processes[i].id.toString();
            row.appendChild(cell);

            for (let j = 0; j < algorithms.length; j++) {
                const cell = document.createElement("td");
                cell.style.border = "1px solid white";
                cell.style.padding = "5px";
                cell.innerHTML = process_data[j][i].toString();
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        // add the table wrapper to the results element
        results_el.appendChild(table_wrapper);
    }
}