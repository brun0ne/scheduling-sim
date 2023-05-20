import Process from "./Process";

export default class Page {
    id: number
    last_call_time: number = 0
    process: Process

    constructor(id: number, process: Process) {
        this.id = id;
        this.process = process;
    }

    call(time: number): void {
        this.last_call_time = time;
    }
}