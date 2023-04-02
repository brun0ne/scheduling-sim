export default class ReadCall {
    position: number
    appearance_time: number

    real_time: boolean = false
    absolute_deadline?: number

    constructor(position: number, appearance_time: number = 0, relative_deadline?: number) {
        this.position = position;
        this.appearance_time = appearance_time;

        if (relative_deadline){
            this.real_time = true;

            this.absolute_deadline = relative_deadline;
        }
    }
}