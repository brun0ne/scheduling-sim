export default class Display {
    ctx: CanvasRenderingContext2D
    resizeCallback: () => void

    constructor(){
        this.resizeCallback = null;
    }
    
    init(elem_id: string): void {
        const canvas = <HTMLCanvasElement> document.getElementById(elem_id);
        this.ctx = canvas.getContext('2d');

        window.addEventListener("resize", this.resizeToFit.bind(this));

        this.resizeToFit();
    }

    resizeToFit(): void {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        if (this.resizeCallback != null){
            this.resizeCallback();
        }
    }

    setResizeCallback(callback: () => void): void {
        this.resizeCallback = callback;
    }
}