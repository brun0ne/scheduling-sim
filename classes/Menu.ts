import Process from "./Process";
import Scheduler from "./Scheduler";

import FCFS from "./algorithms/FCFS";
import SJF from "./algorithms/SJF";


export default class Menu {
    scheduler: Scheduler

    constructor(){
        this.scheduler = new Scheduler();
    }

    init(){
        const run_button = document.getElementById("run_button");
        run_button.addEventListener("click", () => { this.run() });

        const add_button = document.getElementById("add_button");
        add_button.addEventListener("click", () => { this.addProcesses() });

        const clear_button = document.getElementById("clear_button");
        clear_button.addEventListener("click", () => { this.clearProcesses() });
    }

    addProcesses(){
        const process_count = parseInt((<HTMLInputElement> document.getElementById("p_count")).value);
        const max_process_run_time = parseInt((<HTMLInputElement> document.getElementById("p_max_run_time")).value);
        const max_process_arrival_time = parseInt((<HTMLInputElement> document.getElementById("p_max_arrival_time")).value);

        for(let i = 0; i < process_count; i++){
            const arrival_time = Math.floor(Math.random() * max_process_arrival_time);
            const run_time = Math.floor(Math.random() * max_process_run_time) + 1;

            this.scheduler.addProcessToPool(new Process(arrival_time, run_time));
        }

        this.refreshProcesses();
    }

    clearProcesses(){
        this.scheduler.process_pool = [];

        this.refreshProcesses();
    }

    refreshProcesses(){
        const process_current_count_el = document.getElementById("p_current_count");
        process_current_count_el.innerHTML = `(${this.scheduler.process_pool.length.toString()})`;
    }

    run(){
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

            default:
                console.log("Invalid algorithm");
                return;

        }

        console.log(this.scheduler.simulate());
    }
}
