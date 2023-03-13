import Process from "./Process"
import AccessAlgorithm from "./AccessAlgorithm"
import Display from "./Display"

export default class Scheduler {
    process_queue:    Array<Process>      // processes in queue
    process_pool:     Array<Process>      // all processes 
    finished_processes: Array<Process>    // finished 

    algorithm: AccessAlgorithm

    time: number

    previousActiveProcess: Process

    paused: boolean

    constructor(){
        this.process_pool = [];
        this.process_queue = [];
        this.finished_processes = [];

        this.time = 0;

        this.previousActiveProcess = null;

        this.paused = true;
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

            // increase wait_time
            for (const process of this.process_queue){
                process.wait_time++;
            };

            // pick a process from the queue to be run in this tick
            let current_process: Process = this.algorithm.pickNext(this.process_queue, this.previousActiveProcess);
            let finished: boolean = current_process.run();

            // if it's finished, remove from queue
            if (finished)
            {
                this.finished_processes.push(current_process);
                this.process_queue.splice(this.process_queue.indexOf(current_process), 1);
            }

            this.previousActiveProcess = current_process;
        }

        // increase time
        this.time++;
    }

    isFinished(): boolean {
        return this.process_pool.length == this.finished_processes.length;
    }

    getResults(): { avgWaitTime: number, maxTime: number } {
        // average time
        let avgWaitTime = 0;
        for (const process of this.finished_processes) {
            avgWaitTime += process.wait_time;
        }
        avgWaitTime /= this.finished_processes.length;

        // maximum time
        let maxTime = Math.max(...this.finished_processes.map(o => o.wait_time));

        return { avgWaitTime, maxTime };
    }

    simulate(): { avgWaitTime: number, maxTime: number } {
        while (!this.isFinished()){
            this.nextTick();
        }

        /* when finished */
        
        const results = this.getResults();

        // reset back to initial state
        this.reset();

        return results;
    }

    initAutoPlay(display: Display): void {
        setInterval((() => {
            if (!this.paused){
                this.nextTick();
                this.refreshAnimation(display);

                if (this.isFinished()){
                    this.pauseAnimation();
                    this.displayResults(this.algorithm.constructor.name);
                }
            }
        }).bind(this), 1000);
    }

    refreshAnimation(display: Display){
        // get ctx
        const ctx = display.ctx;
        const screenWidth = display.ctx.canvas.width;
        const screenHeight = display.ctx.canvas.height;

        // set process positions
        let x = 150;
        for (const process of this.process_queue){
            const WIDTH = process.time_left * 10;
            process.visual.setPos(x, 2 * (screenHeight / 3) - 50, WIDTH);

            x += WIDTH + 20;
        }

        // make previous active process red and others white
        if (this.previousActiveProcess != null){
            this.previousActiveProcess.visual.color = "#ff0000";
        }
        for (const process of this.process_queue){
            if (process != this.previousActiveProcess){
                process.visual.color = "#ffffff";
            }
        }

        ctx.clearRect(0, 0, screenWidth, screenHeight);
        ctx.fillStyle = "white";

        // horizontal line 
        ctx.fillRect(0, 2 * (screenHeight / 3), screenWidth, 1);

        // microprocessor
        ctx.strokeRect(50, 2 * (screenHeight / 3) - 100, 50, 100);

        // black text in the middle saying μP
        ctx.font = "15px Roboto";
        ctx.fillText("μP", 50 + 25, 2 * (screenHeight / 3) - 50);

        // draw processes
        for (const process of this.process_queue){
            if (process.visual.x + process.visual.width < screenWidth - screenWidth / 4){
                process.visual.draw(ctx);
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
        algorithm_el.innerHTML = this.algorithm.constructor.name;

        const time_el = document.getElementById("animation_info_time_value");
        time_el.innerHTML = this.time.toString();
    }

    displayResults(algStr: string = this.algorithm.constructor.name, results: { avgWaitTime: number, maxTime: number } = null): void {
        // get results
        if (results == null)
            results = this.getResults();

        const results_el = document.getElementById("results");

        results_el.style.display = "block";

        results_el.innerHTML = `
        Algorithm: ${algStr.toUpperCase()} ${algStr.toLowerCase() === "rr" ? `(${(<HTMLInputElement> document.getElementById("a_time_quanta")).value})` : ""}

        Average waiting time: ${results.avgWaitTime}

        Maximum waiting time: ${results.maxTime}
        `.replace(RegExp("\n", "g"), "<br />");
}

    resumeAnimation(): void {
        this.paused = false;
    }

    pauseAnimation(): void {
        this.paused = true;
    }
}
