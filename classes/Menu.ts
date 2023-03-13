import Display from "./Display";

import Process from "./Process";
import Scheduler from "./Scheduler";

import FCFS from "./algorithms/FCFS";
import SJF from "./algorithms/SJF";
import SRTF from "./algorithms/SRTF";


export default class Menu {
    scheduler: Scheduler
    display: Display

    constructor(){
        this.scheduler = new Scheduler();
        this.display = new Display();
    }

    init(): void {
        const run_button = document.getElementById("run_button");
        run_button.addEventListener("click", () => { this.run() });

        const add_button = document.getElementById("add_button");
        add_button.addEventListener("click", () => { this.addProcesses() });

        const clear_button = document.getElementById("clear_button");
        clear_button.addEventListener("click", () => { this.clearProcesses() });

        this.display.init("main_canvas");
        this.display.setResizeCallback(() => { this.refreshProcesses() });
    }

    addProcesses(): void {
        const process_count = parseInt((<HTMLInputElement> document.getElementById("p_count")).value);
        const max_process_run_time = parseInt((<HTMLInputElement> document.getElementById("p_max_run_time")).value);
        const max_process_arrival_time = parseInt((<HTMLInputElement> document.getElementById("p_max_arrival_time")).value);

        // check if input is valid
        if (isNaN(process_count) || isNaN(max_process_run_time) || isNaN(max_process_arrival_time)){
            alert("Invalid input");
            return;
        }

        for(let i = 0; i < process_count; i++){
            const arrival_time = Math.floor(Math.random() * max_process_arrival_time);
            const run_time = Math.floor(Math.random() * max_process_run_time) + 1;

            this.scheduler.addProcessToPool(new Process(arrival_time, run_time));
        }

        this.refreshProcesses();
    }

    clearProcesses(): void {
        this.scheduler.process_pool = [];

        this.refreshProcesses();
    }

    refreshProcesses(): void{
        const process_current_count_el = document.getElementById("p_current_count");
        process_current_count_el.innerHTML = `(${this.scheduler.process_pool.length.toString()})`;

        // draw processes as squares on the screen
        this.display.ctx.clearRect(0, 0, this.display.ctx.canvas.width, this.display.ctx.canvas.height);

        const start_x = this.display.ctx.canvas.width / 2;
        const start_y = 0;

        let i = 0;
        let previousWidth = start_x;
        let previousHeight = start_y;

        let widthScale = 1;
        const HEIGHT = 50;

        let sumOfRunTimes = this.scheduler.process_pool.reduce((a, b) => a + b.run_time, 0);

        // reduce scale by to fit the screen
        while (sumOfRunTimes * 10 * widthScale > (this.display.ctx.canvas.width / 2) * (this.display.ctx.canvas.height / HEIGHT) * 0.95){
            widthScale *= 0.5;
        }

        for (const process of this.scheduler.process_pool){
            let width = process.run_time * 10 * widthScale;

            // check if it will fit on the screen
            if (previousWidth + width > this.display.ctx.canvas.width){
                previousWidth = start_x;
                previousHeight += HEIGHT;
            }

            // black rectangles with white border
            this.display.ctx.fillStyle = "black";
            this.display.ctx.strokeStyle = "white";
            this.display.ctx.fillRect(previousWidth, previousHeight, width, HEIGHT);
            this.display.ctx.strokeRect(previousWidth, previousHeight, width, HEIGHT);

            // text (run_time) inside the rectangle
            if (width > 10){
                this.display.ctx.fillStyle = "white";
                this.display.ctx.font = "10px Consolas";
                this.display.ctx.textAlign = "center";
                this.display.ctx.fillText(process.run_time.toString(), previousWidth + width/2, previousHeight + 40);
            }

            previousWidth += width;
            i++;
        }
    }

    run(): void{
        const algStr = (<HTMLInputElement> document.getElementById("a_type")).value;
        
        switch(algStr.toLowerCase()){

            // first come first serve
            case "fcfs":
                this.scheduler.setAlgorithm(new FCFS());
                break;

            // shortest job first
            case "sjf":
                this.scheduler.setAlgorithm(new SJF());
                break;

            // shortest remaining time first
            case "srtf":
                this.scheduler.setAlgorithm(new SRTF());
                break;

            default:
                console.log("Invalid algorithm");
                return;

        }

        console.log(this.scheduler.simulate());
    }
}
