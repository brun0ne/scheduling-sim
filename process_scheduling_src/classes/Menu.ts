import { Random } from "random-js";
import gaussian from "gaussian";

import Display from "../../shared/classes/Display";

import Process from "./Process";
import Scheduler from "./Scheduler";

import FCFS from "./algorithms/FCFS";
import RR from "./algorithms/RR";
import SJF from "./algorithms/SJF";
import SRTF from "./algorithms/SRTF";

const random = new Random(); 

export default class Menu {
    scheduler: Scheduler
    display: Display

    constructor(){
        this.scheduler = new Scheduler();
        this.display = new Display();
        
        this.scheduler.initAutoPlay(this.display);
    }

    init(): void {
        const run_button = document.getElementById("run_button");
        run_button.addEventListener("click", () => { this.run() });

        const run_with_animation_button = document.getElementById("run_with_animation_button");
        run_with_animation_button.addEventListener("click", () => { this.run(true) });

        const add_button = document.getElementById("add_button");
        add_button.addEventListener("click", () => { this.addProcesses() });

        const clear_button = document.getElementById("clear_button");
        clear_button.addEventListener("click", () => { this.clearProcesses() });

        const algorithm_select = document.getElementById("a_type");
        algorithm_select.addEventListener("change", (e: Event) => 
        { 
            if ((<HTMLSelectElement> e.target).value.toLowerCase() === "rr")
                document.getElementById("a_time_quanta_all").style.display = "block";
            else
                document.getElementById("a_time_quanta_all").style.display = "none";

            if ((<HTMLSelectElement> e.target).value.toLowerCase() === "compare all")
                (<HTMLButtonElement> document.getElementById("run_with_animation_button")).disabled = true;
            else
                (<HTMLButtonElement> document.getElementById("run_with_animation_button")).disabled = false;
        });

        const distribution_select = document.getElementById("p_distribution");
        distribution_select.addEventListener("change", (e: Event) =>
        {
            if ((<HTMLSelectElement> e.target).value.toLowerCase() === "uniform")
            {
                document.getElementById("p_variance_run_all").style.display = "none";
                document.getElementById("p_variance_arrival_all").style.display = "none";
            }
            else if ((<HTMLSelectElement> e.target).value.toLowerCase() === "normal")
            {
                document.getElementById("p_variance_run_all").style.display = "block";
                document.getElementById("p_variance_arrival_all").style.display = "block";
            }
        });

        this.display.init("main_canvas");
        this.display.setResizeCallback(() => { this.refreshProcesses() });

        /* results buttons */

        const results_close = document.getElementById("results_close");
        results_close.addEventListener("click", () => {
            document.getElementById("results_wrapper").style.display = "none";
        });

        /* animation buttons */
        
        const play_pause_button = document.getElementById("animation_play_pause");
        const stop_button = document.getElementById("animation_stop");
        const step_button = document.getElementById("animation_step");

        step_button.addEventListener("click", () => {
            this.scheduler.nextTick();
            this.scheduler.refreshAnimation(this.display);

            if (this.scheduler.isFinished()){
                this.scheduler.displayResults();
                this.scheduler.afterDone();

                return;
            }
        });

        play_pause_button.addEventListener("click", () => {
            if (this.scheduler._paused){
                this.scheduler.resumeAnimation();
                play_pause_button.innerHTML = "Pause";
            }
            else{
                this.scheduler.pauseAnimation();
                play_pause_button.innerHTML = "Play";
            }
        });

        stop_button.addEventListener("click", () => {
            // go back to menu
            document.getElementById("settings").style.display = "flex";
            document.getElementById("results_wrapper").style.display = "none";
            document.getElementById("animation_gui").style.display = "none";

            // clear the canvas
            this.display.ctx.clearRect(0, 0, this.display.ctx.canvas.width, this.display.ctx.canvas.height);

            // reset
            this.scheduler.reset();
            document.getElementById("animation_play_pause").innerHTML = "Play";

            // draw process preview
            this.refreshProcesses();

            // set back the resize callback
            this.display.setResizeCallback(() => { this.refreshProcesses() });
        });

        const see_code_button = document.getElementById("code_button");
        see_code_button.addEventListener("click", () => {
            const algorithmName = this.scheduler.algorithm.name;
            window.open(`https://github.com/brun0ne/scheduling-sim/blob/main/process_scheduling_src/classes/algorithms/${algorithmName}.ts`, "_blank").focus();
        });

        /* speed control slider */
        const speed_slider = document.getElementById("animation_speed_slider");
        speed_slider.addEventListener("input", (e: Event) => {
            this.scheduler.setAnimationSpeed(parseInt((<HTMLInputElement> e.target).value));
        });
    }

    addProcesses(): void {
        const process_count = parseInt((<HTMLInputElement> document.getElementById("p_count")).value);

        const min_process_run_time = parseInt((<HTMLInputElement> document.getElementById("p_min_run_time")).value);
        const max_process_run_time = parseInt((<HTMLInputElement> document.getElementById("p_max_run_time")).value);

        const min_process_arrival_time = parseInt((<HTMLInputElement> document.getElementById("p_min_arrival_time")).value);
        const max_process_arrival_time = parseInt((<HTMLInputElement> document.getElementById("p_max_arrival_time")).value);

        const distribution = (<HTMLInputElement> document.getElementById("p_distribution")).value;

        // check if input is valid
        if (isNaN(process_count) || isNaN(max_process_run_time) || isNaN(min_process_run_time) || isNaN(max_process_arrival_time) || isNaN(min_process_arrival_time)){
            alert("Invalid input");
            return;
        }

        switch (distribution){
            case "uniform":
                {
                    for(let i = 0; i < process_count; i++){
                        const run_time = random.integer(min_process_run_time, max_process_run_time);
                        const arrival_time = random.integer(min_process_arrival_time, max_process_arrival_time);
    
                        this.scheduler.addProcessToPool(new Process(arrival_time, run_time));
                    }
                }
                break;
            case "normal":
                {
                    const mean_run = (min_process_run_time + max_process_run_time) / 2;
                    const mean_arrival = (min_process_arrival_time + max_process_arrival_time) / 2;

                    const variance_run = parseInt((<HTMLInputElement> document.getElementById("p_variance_run")).value);
                    const variance_arrival = parseInt((<HTMLInputElement> document.getElementById("p_variance_arrival")).value);

                    if (isNaN(variance_run) || isNaN(variance_arrival)){
                        alert("Invalid input (variance)");
                        return;
                    }

                    let distribution_run: gaussian | null, distribution_arrival: gaussian | null;

                    if (variance_run > 0)
                        distribution_run = gaussian(mean_run, variance_run);
                    
                    if (variance_arrival > 0)
                        distribution_arrival = gaussian(mean_arrival, variance_arrival);

                    for(let i = 0; i < process_count; i++){
                        let run_time: number, arrival_time: number;

                        if (variance_run > 0)
                            run_time = Math.round(distribution_run.ppf(random.real(0, 1)));
                        else
                            run_time = mean_run;

                        if (variance_arrival > 0)
                            arrival_time = Math.round(distribution_arrival.ppf(random.real(0, 1)));
                        else
                            arrival_time = mean_arrival;

                        if (run_time < min_process_run_time || run_time > max_process_run_time || arrival_time < min_process_arrival_time || arrival_time > max_process_arrival_time)
                        {
                            i--;
                            continue;
                        }

                        this.scheduler.addProcessToPool(new Process(arrival_time, run_time));
                    }
                }
                break;
            default:
                {
                    alert("Invalid distribution");
                    return;
                }
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
        const start_y = 50;

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

    run(animation: boolean = false): void{
        if (this.scheduler.process_pool.length === 0){
            alert("No processes to run");
            return;
        }

        const algStr = (<HTMLInputElement> document.getElementById("a_type")).value;
        let compare_all = false;

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

            // round robin
            case "rr":
                const quantum = parseInt((<HTMLInputElement> document.getElementById("a_time_quanta")).value);
                if (isNaN(quantum)){
                    alert("Invalid input");
                    return;
                }

                this.scheduler.setAlgorithm(new RR(quantum));
                break;

            // compare all algorithms
            case "compare all":
                compare_all = true;
                break;

            default:
                console.log("Invalid algorithm");
                return;

        }
        
        if (animation && !compare_all){
            document.getElementById("settings").style.display = "none";
            document.getElementById("results_wrapper").style.display = "none";
            document.getElementById("animation_gui").style.display = "block";

            // clear the canvas
            this.display.ctx.clearRect(0, 0, this.display.ctx.canvas.width, this.display.ctx.canvas.height);

            // initialize
            this.scheduler.refreshAnimation(this.display);

            // set resize callback
            this.display.resizeCallback = () => {
                this.scheduler.refreshAnimation(this.display);
            }
        }
        else
        {
            if (compare_all){
                this.scheduler.compareAllAndDisplayResults();
                return;
            }

            // return the results immediately
            const results = this.scheduler.simulate();
            this.scheduler.displayResults(algStr, results);
        }
    }
}
