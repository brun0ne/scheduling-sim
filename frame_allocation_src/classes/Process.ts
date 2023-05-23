import Frame from "./Frame"
import Page from "./Page"

export default class Process {
    range_of_pages: [number, number]
    number_of_calls: number
    id: number

    page_faults: number = 0
    done_calls: number = 0
    call_log: Array<Page> = []
    fault_log: Array<boolean> = []

    running: boolean = true
    assignedFrames: number = 0

    private calls: Array<number> = []

    constructor(range_of_pages: [number, number], number_of_calls: number, id: number) {
        this.range_of_pages = range_of_pages;
        this.number_of_calls = number_of_calls;
        this.id = id;
    }

    reset() {
        this.page_faults = 0;
        this.done_calls = 0;

        this.running = true;
        this.assignedFrames = 0;

        this.fault_log = [];
        this.call_log = [];
    }

    generateCalls(): void {
        this.calls = [];

        for (let i = 0; i < this.number_of_calls; i++) {
            this.calls.push(Math.floor(Math.random() * (this.range_of_pages[1] - this.range_of_pages[0])) + this.range_of_pages[0]);
        }
    }

    getCalls(): Array<number> {
        return this.calls;
    }

    addToFaultLog(fault: boolean) {
        this.fault_log.push(fault);

        if (this.fault_log.length != this.done_calls)
            throw new Error("Fault log length does not match done calls");
    }

    addToCallLog(page: Page) {
        this.call_log.push(page);

        if (this.call_log.length != this.done_calls)
            throw new Error("Call log length does not match done calls");
    }

    updateRunningStatus(frames: ReadonlyArray<Readonly<Frame>>) {
        let assignedFrames: number = 0;

        for (const frame of frames) {
            if (frame.process == this)
                assignedFrames++;
        }

        if (assignedFrames > 0)
            this.running = true;
        else
            this.running = false;

        if (this.done_calls == this.number_of_calls)
            this.running = false;
        else if (this.done_calls >= this.number_of_calls)
            throw new Error("Process done calls exceeded number of calls");

        this.assignedFrames = assignedFrames;
    }

    getFaultsInLastN(n: number) {
        return this.fault_log.slice(this.fault_log.length - n, this.fault_log.length).filter(fault => fault).length;
    }

    getUniquePagesInLastN(n: number) {
        return this.call_log.slice(this.call_log.length - n, this.call_log.length).map(page => page.id).filter((value, index, self) => self.indexOf(value) === index).length;
    }
}
