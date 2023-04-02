export default class ReadCall {
    position: number
    appearance_time: number

    constructor(position: number, appearance_time: number = 0) {
        this.position = position;
        this.appearance_time = appearance_time;
    }
}