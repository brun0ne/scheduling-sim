import VisualProcess from "./VisualProcess"

export default class Process {
    static incremented_id = 0

    id: number
    start_time: number
    run_time: number
    time_left: number

    wait_time: number

    visual: VisualProcess

    constructor(start_time: number, run_time: number){
        this.id = Process.incremented_id;
        Process.incremented_id++;

        this.start_time = start_time;

        this.run_time = run_time;
        this.time_left = run_time;

        this.wait_time = 0;

        this.visual = new VisualProcess(this);
    }

    run(): boolean{
        this.time_left -= 1;

        if (this.time_left <= 0)
            return true;

        return false;
    }

    getCopy(): Process{
        const copy = new Process(this.start_time, this.run_time);

        copy.id = this.id;
        copy.time_left = this.time_left;
        copy.wait_time = this.wait_time;

        return copy;
    }
}
