export default class ReadCall {
    position: number
    appearance_time: number

    real_time: boolean = false
    absolute_deadline?: number

    constructor(position: number, appearance_time: number = 0) {
        this.position = position;
        this.appearance_time = appearance_time;

        this.absolute_deadline = 0;
    }

    evaluate(current_time?: number): void{}
}