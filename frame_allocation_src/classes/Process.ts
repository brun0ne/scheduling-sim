import Frame from "./Frame"

export default class Process {
    range_of_pages: [number, number]
    number_of_calls: number
    id: number

    page_faults: number = 0
    done_calls: number = 0

    running: boolean = true
    assignedFrames: number = 0

    private calls: Array<number> = []
    fault_times: Array<number> = []

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

        this.fault_times = [];
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

    getFaultsInLastNTicks(n: number, time: number) {
        let faults: number = 0;

        for (let i = this.fault_times.length - 1; i >= 0; i--) {
            if (time - this.fault_times[i] > n)
                break;

            faults++;
        }

        return faults;
    }
}
