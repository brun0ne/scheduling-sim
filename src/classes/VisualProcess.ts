import Process from "./Process";

export default class VisualProcess {
    process: Process

    x: number
    y: number
    width: number
    height: number

    color: string

    constructor(process: Process){
        this.process = process;

        this.height = 50;
        this.color = this.process.start_time > 0 ? "#ff0000" : "#00ff00";
    }

    setPos(x: number, y: number, width: number = 50): void {
        this.x = x;
        this.y = y;

        this.width = width;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}