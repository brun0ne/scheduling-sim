export default class Process {
    id: number
    load: number

    time_ran: number = 0
    time_needed: number = 0

    constructor(id: number, load: number, time_needed: number) {
        this.id = id;
        this.load = load;
        this.time_needed = time_needed;

        if (load < 0 || load > 100)
            throw new Error(`Invalid load value ${load} for process ${id}`);
    }

    tick(): void {
        this.time_ran++;
    }

    ended(): boolean {
        return this.time_ran >= this.time_needed;
    }
}