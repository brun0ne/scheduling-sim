export default class ReadCall {
    joined: boolean
    position: number
    appearance_time: number
    
    absolute_deadline?: number

    constructor(position: number, appearance_time: number = 0) {
        this.position = position;
        this.appearance_time = appearance_time;

        this.absolute_deadline = 0;
        
        this.joined = false;
    }

    evaluate(current_time?: number): void{}
}