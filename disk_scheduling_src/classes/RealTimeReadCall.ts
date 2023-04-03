import ReadCall from "./ReadCall";

export default class RealTimeReadCall extends ReadCall {
    absolute_deadline: number
    missed_deadline: boolean = false

    constructor(position: number, appearance_time: number = 0, relative_deadline: number) {
        super(position, appearance_time);

        this.absolute_deadline = appearance_time + relative_deadline;
    }

    evaluate(current_time: number): void {
        if (current_time > this.absolute_deadline)
        {
            this.missed_deadline = true;
        }
        else
        {
            this.missed_deadline = false;
        }
    }
}