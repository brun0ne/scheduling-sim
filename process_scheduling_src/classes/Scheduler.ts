import Process from "./Process"
import AccessAlgorithm from "./AccessAlgorithm"
import Display from "../../shared/classes/Display"

import FCFS from "./algorithms/FCFS"
import SJF from "./algorithms/SJF"
import SRTF from "./algorithms/SRTF"
import RR from "./algorithms/RR"

export default class Scheduler {
    process_queue:    Array<Process>      // processes in queue
    process_pool:     Array<Process>      // all processes 
    finished_processes: Array<Process>    // finished 

    algorithm: AccessAlgorithm
    time: number
    previousActiveProcess: Process

    /* animation */
    _paused: boolean
    _speed: number
    _interval: NodeJS.Timer
    _display: Display

    constructor(){
        this.process_pool = [];
        this.process_queue = [];
        this.finished_processes = [];

        this.time = 0;

        this.previousActiveProcess = null;

        this._paused = true;
        this._speed = 1;
        this._interval = null;
        this._display = null;
    }

    setAlgorithm(algorithm: AccessAlgorithm): void {
        this.algorithm = algorithm;
    }

    reset(): void{
        this.process_queue = [];
        this.finished_processes = [];

        this.previousActiveProcess = null;

        this.time = 0;
        this.pauseAnimation();
    }

    addProcessToPool(process: Process): void {
        this.process_pool.push(process);
    }

    nextTick(): void {
        // check for processes which should join the queue
        for (const process of this.process_pool){
            if (process.start_time == this.time) this.process_queue.push(process.getCopy());
        };

        // if queue is not empty
        if (this.process_queue.length > 0)
        {
            this.process_queue = this.algorithm.preprocess(this.process_queue);

            // increase turnaround time
            for (const process of this.process_queue){
                process.turnaround_time++;
            };

            // pick a process from the queue to be run in this tick
            let current_process: Process = this.algorithm.pickNext(this.process_queue, this.previousActiveProcess);
            let finished: boolean = current_process.run();

            // if it's finished
            if (finished)
            {
                this.finished_processes.push(current_process);
                
                // will be removed from the queue after being displayed in refreshAnimation() 
            }

            this.previousActiveProcess = current_process;
        }

        // increase time
        this.time++;
    }

    isFinished(): boolean {
        return this.process_pool.length == this.finished_processes.length;
    }

    getResults(): { avgTurnaroundTime: number, maxTime: number, avgWaitingTime: number } {
        // average time
        let avgTurnaroundTime = 0;
        for (const process of this.finished_processes) {
            avgTurnaroundTime += process.turnaround_time;
        }
        avgTurnaroundTime /= this.finished_processes.length;

        // maximum time
        let maxTime = Math.max(...this.finished_processes.map(o => o.turnaround_time));

        // avarage waiting time
        let avgWaitingTime = 0;
        for (const process of this.finished_processes){
            avgWaitingTime += process.turnaround_time - process.run_time;
        }
        avgWaitingTime /= this.finished_processes.length;

        return { avgTurnaroundTime, maxTime, avgWaitingTime };
    }

    /* running the simulation */
    /*
    /*
    /* */

    simulate(): { avgTurnaroundTime: number, maxTime: number, avgWaitingTime: number } {
        while (!this.isFinished()){
            this.nextTick();
        }

        /* when finished */
        
        const results = this.getResults();

        // reset back to initial state
        this.reset();

        return results;
    }

    compareAllAndDisplayResults(): void {
        this.setAlgorithm(new FCFS());
        const fcfs_results = this.simulate();
        this.reset();

        this.setAlgorithm(new SJF());
        const sjf_results = this.simulate();
        this.reset();

        this.setAlgorithm(new SRTF());
        const srtf_results = this.simulate();
        this.reset();

        this.setAlgorithm(new RR(1));
        const rr1_results = this.simulate();
        this.reset();

        this.setAlgorithm(new RR(3));
        const rr3_results = this.simulate();
        this.reset();

        let resText = `(average turnaround time)

        FCFS:   ${fcfs_results.avgTurnaroundTime.toFixed(2)}
        SJF:    ${sjf_results.avgTurnaroundTime.toFixed(2)}
        SRTF:   ${srtf_results.avgTurnaroundTime.toFixed(2)}
        RR (1):  ${rr1_results.avgTurnaroundTime.toFixed(2)}
        RR (3):  ${rr3_results.avgTurnaroundTime.toFixed(2)}`;
        resText = resText.replace(RegExp("\n", "g"), "<br>");

        const resultsWrapper = document.getElementById("results_wrapper");
        resultsWrapper.style.display = "flex";

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = resText;
    }

    /* animation */
    /*
    /*
    /* */

    initAutoPlay(display: Display): void {
        this._display = display;

        if (this._interval != null) clearInterval(this._interval);

        this._interval = setInterval((() => {
            if (!this._paused){
                this.nextTick();
                this.refreshAnimation(display);

                if (this.isFinished()){
                    this.pauseAnimation();
                    this.displayResults(this.algorithm.name);
                    
                    this.afterDone();
                }
            }
        }).bind(this), 1000 / this._speed);
    }

    refreshAnimation(display: Display){
        if (!this.isFinished()){
            (<HTMLButtonElement> document.getElementById("animation_play_pause")).disabled = false;
            (<HTMLButtonElement> document.getElementById("animation_step")).disabled = false;
            document.getElementById("animation_is_done").style.display = "none";
        }

        // get ctx
        const ctx = display.ctx;
        const screenWidth = display.ctx.canvas.width;
        const screenHeight = display.ctx.canvas.height;

        // set process positions
        let x = 150;
        for (const process of this.process_queue){
            let width_param: number;
            if (process.time_left > 0)
                width_param = process.time_left;
            else
                width_param = 1;

            const WIDTH = width_param * 10;
            process.visual.setPos(x, 2 * (screenHeight / 3) - 50, WIDTH);

            x += WIDTH + 20;
        }

        // make previous active process red and others white
        if (this.previousActiveProcess != null){
            this.previousActiveProcess.visual.color = "#ff0000";
        }
        // if a process just joined, make it green
        for (const process of this.process_queue){
            if (process != this.previousActiveProcess) { // default is white
                process.visual.color = "#ffffff";
            }
            if (process.start_time == this.time - 1) {   // if it just joined, make it green
                process.visual.color = "#00ff00";
            }
            if (process.time_left <= 0) { // if it's finished, make it blue
                process.visual.color = "#0000ff";
            }
        }

        ctx.clearRect(0, 0, screenWidth, screenHeight);
        ctx.fillStyle = "white";

        // horizontal line 
        ctx.fillRect(0, 2 * (screenHeight / 3), screenWidth, 1);

        // microprocessor
        ctx.strokeStyle = "white";
        ctx.strokeRect(50, 2 * (screenHeight / 3) - 100, 50, 100);

        // black text in the middle saying μP
        ctx.font = "15px Roboto";
        ctx.textAlign = "center";
        ctx.fillText("μP", 50 + 25, 2 * (screenHeight / 3) - 50);

        // draw processes
        for (const process of this.process_queue){
            if (process.visual.x + process.visual.width < screenWidth - screenWidth / 4){
                process.visual.draw(ctx);
            }
        }

        // remove dead processes
        for (let i = 0; i < this.process_queue.length; i++){
            if (this.process_queue[i].time_left <= 0){
                this.process_queue.splice(i, 1);
                i--;
            }
        }

        // at the and add "... + n more" if there are more processes
        if (this.process_queue.length > 0){
            const lastProcess = this.process_queue[this.process_queue.length - 1];
            if (lastProcess.visual.x + lastProcess.visual.width > screenWidth - screenWidth / 4){
                ctx.font = "30px Roboto";
                ctx.fillStyle = "white";
                ctx.fillText("... + " + (this.process_queue.length - 1) + " more", screenWidth - screenWidth / 8, 2 * (screenHeight / 3) - 50 + 25);
            }
        }

        // refresh info
        const algorithm_el = document.getElementById("animation_info_algorithm_value");
        algorithm_el.innerHTML = this.algorithm.name;

        const time_el = document.getElementById("animation_info_time_value");
        time_el.innerHTML = this.time.toString();

        const left = (this.process_pool.length - (this.process_queue.length + this.finished_processes.length));
        const processes_left_to_join_el = document.getElementById("processes_info_left_to_join_value");
        processes_left_to_join_el.innerHTML = left.toString();

        if (left > 0)
            processes_left_to_join_el.style.color = "yellow";
        else
            processes_left_to_join_el.style.color = "white";

        const finished_processes_el = document.getElementById("processes_info_finished_value");
        finished_processes_el.innerHTML = this.finished_processes.length.toString();
    }

    displayResults(algStr: string = this.algorithm.name, results: { avgTurnaroundTime: number, maxTime: number, avgWaitingTime: number } = null): void {
        // get results
        if (results == null)
            results = this.getResults();

        // display results
        const results_wrapper = document.getElementById("results_wrapper");
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results");
        results_el.innerHTML = `
        Algorithm: ${algStr.toUpperCase()} ${algStr.toLowerCase() === "rr" ? `(${(<HTMLInputElement> document.getElementById("a_time_quanta")).value})` : ""}

        Average turnaround time: ${results.avgTurnaroundTime.toFixed(2)}

        Maximum turnaround time: ${results.maxTime.toFixed(2)}

        Average waiting time: ${results.avgWaitingTime.toFixed(2)}
        `.replace(RegExp("\n", "g"), "<br />");
}

    resumeAnimation(): void {
        this._paused = false;
    }

    pauseAnimation(): void {
        this._paused = true;
    }

    setAnimationSpeed(speed: number): void {
        this._speed = speed;

        this.initAutoPlay(this._display);
    }

    afterDone(): void {
        document.getElementById("animation_is_done").style.display = "block";

        (<HTMLButtonElement> document.getElementById("animation_play_pause")).disabled = true;
        (<HTMLButtonElement> document.getElementById("animation_step")).disabled = true;
    }
}
