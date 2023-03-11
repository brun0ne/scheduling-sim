export default class Display {
    ctx: CanvasRenderingContext2D

    constructor(){}
    
    init(elem_id: string): void {
        const canvas = <HTMLCanvasElement> document.getElementById(elem_id);
        this.ctx = canvas.getContext('2d');

        this.resizeToFit();
    }


    resizeToFit(): void {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }
}