export default class Display {
    ctx: CanvasRenderingContext2D | null = null
    resizeCallback: (() => void) | null

    constructor(){
        this.resizeCallback = null;
    }
    
    init(elem_id: string): void {
        const canvas = document.getElementById(elem_id) as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        window.addEventListener("resize", this.resizeToFit.bind(this));

        this.resizeToFit();
    }

    resizeToFit(): void {
        if (this.ctx == null){
            return;
        }

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