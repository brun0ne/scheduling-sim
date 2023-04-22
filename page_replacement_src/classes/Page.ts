export default class Page {
    id: number
    last_call_time: number

    constructor(id: number) {
        this.id = id;
        this.last_call_time = 0;
    }

    call(time: number): void {
        this.last_call_time = time;
    }
}