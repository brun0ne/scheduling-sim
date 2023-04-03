import { Random } from "random-js";
import gaussian from "gaussian";

import Display from "../../shared/classes/Display";

import Disk from "./Disk";
import ReadCall from "./ReadCall";

import FCFS from "./algorithms/FCFS";
import SSTF from "./algorithms/SSTF";
import SCAN from "./algorithms/SCAN";
import CSCAN from "./algorithms/CSCAN";
import EDF from "./algorithms/EDF";
import FDSCAN from "./algorithms/FDSCAN";
import RealTimeReadCall from "./RealTimeReadCall";

const random = new Random();

export default class Menu {
    display: Display
    disk: Disk

    constructor() {
        this.display = new Display();
        this.disk = new Disk();
    }

    init(): void {
        const run_button = document.getElementById("run_button");
        run_button.addEventListener("click", () => { this.run() });

        const run_with_animation_button = document.getElementById("run_with_animation_button");
        run_with_animation_button.addEventListener("click", () => { this.run(true) });

        const add_button = document.getElementById("add_button");
        add_button.addEventListener("click", () => { this.addCalls() });

        const clear_button = document.getElementById("clear_button");
        clear_button.addEventListener("click", () => { this.clearCalls() });

        this.display.init("main_canvas");
        this.display.setResizeCallback(() => { this.refreshCalls() });

        /*
        * algorithm select
        */
        const distribution_select = document.getElementById("c_distribution");
        distribution_select.addEventListener("change", (e: Event) =>
        {
            if ((<HTMLSelectElement> e.target).value.toLowerCase() === "uniform")
            {
                document.getElementById("c_variance_position_all").style.display = "none";
            }
            else if ((<HTMLSelectElement> e.target).value.toLowerCase() === "normal")
            {
                document.getElementById("c_variance_position_all").style.display = "block";
            }
        });

        /*
        * time slider
        * -> refresh info
        * -> refresh calls
        */
        const time_slider = document.getElementById("time_slider_input");
        time_slider.addEventListener("input", (e: Event) => {
            const time_slider_info = document.getElementById("time_slider_info");
            time_slider_info.innerHTML = `t = ${(<HTMLSelectElement> e.target).value}`;

            this.refreshCalls();
        });

        /*
        * max time change
        * -> update time slider
        */
        const max_time_input = document.getElementById("c_max_time");
        max_time_input.addEventListener("input", (e: Event) => {
            const time_slider = document.getElementById("time_slider_input");
            time_slider.setAttribute("max", (<HTMLSelectElement> e.target).value);
        });

        /*
        * deadline on/off
        * -> show/hide deadline input
        */
        const deadline_checkbox = document.getElementById("c_with_deadline");
        deadline_checkbox.addEventListener("change", (e: Event) => {
            if ((<HTMLInputElement> e.target).value == "on")
            {
                document.getElementById("c_max_deadline_all").style.display = "block";
            }
            else
            {
                document.getElementById("c_max_deadline_all").style.display = "none";
            }
        });

        /* 
        * results buttons
        */
        const results_close = document.getElementById("results_close");
        results_close.addEventListener("click", () => {
            document.getElementById("results_wrapper").style.display = "none";
        });

        /*
        * refresh calls 
        */
        this.disk.init();
        this.refreshCalls();
    }

    addCalls(): void {
        const distribution = (<HTMLInputElement> document.getElementById("c_distribution")).value;
        const call_count = parseInt((<HTMLInputElement> document.getElementById("c_count")).value);

        const min_position = parseInt((<HTMLInputElement> document.getElementById("c_min_position")).value);
        const max_position = parseInt((<HTMLInputElement> document.getElementById("c_max_position")).value);

        const max_time = parseInt((<HTMLInputElement> document.getElementById("c_max_time")).value);
        const disk_size = parseInt((<HTMLInputElement> document.getElementById("disk_size")).value);

        const deadline: boolean = (<HTMLInputElement> document.getElementById("c_with_deadline")).value == "on";
        const max_deadline = parseInt((<HTMLInputElement> document.getElementById("c_max_deadline")).value);

        console.log(distribution, call_count, min_position, max_position, disk_size);

        // check if input is valid
        if (isNaN(call_count) || isNaN(min_position) || isNaN(max_position) || isNaN(disk_size) || isNaN(max_time) || isNaN(max_deadline)) {
            alert("Invalid input");
            return;
        }
        if (min_position < 0 || max_position > disk_size || max_deadline < 0 || max_time < 0 || disk_size < 0) {
            alert("Invalid input");
            return;
        }

        this.disk.init(disk_size);

        switch (distribution) {
            case "uniform":
                {
                    for (let i = 0; i < call_count; i++) {
                        const position = random.integer(min_position, max_position);

                        if (deadline)
                            this.disk.addCallToPool(new RealTimeReadCall(position, random.integer(0, max_time), random.integer(0, max_deadline)));
                        else
                            this.disk.addCallToPool(new ReadCall(position, random.integer(0, max_time)));
                    }
                }
                break;
            case "normal":
                {
                    const mean = (min_position + max_position) / 2;
                    const variance = parseInt((<HTMLInputElement> document.getElementById("c_variance_position")).value);

                    if (isNaN(variance)) {
                        alert("Invalid input");
                        return;
                    }
                    if (variance == 0) {
                        alert("Variance cannot be 0");
                        return;
                    }

                    const distribution = gaussian(mean, variance);

                    for (let i = 0; i < call_count; i++) {
                        const position = Math.round(distribution.ppf(random.real(0, 1)));

                        if (position < min_position || position > max_position) {
                            i--;
                            continue;
                        }

                        if (deadline)
                            this.disk.addCallToPool(new RealTimeReadCall(position, random.integer(0, max_time), random.integer(0, max_deadline)));
                        else
                            this.disk.addCallToPool(new ReadCall(position, random.integer(0, max_time)));
                    }
                }
                break;
            default:
                {
                    alert("Invalid distribution");
                    return;
                }
        }

        this.refreshCalls();
    }

    clearCalls(): void {
        this.disk.clearCallPool();
        this.refreshCalls();
    }

    refreshCalls(): void {
        const process_current_count_el = document.getElementById("p_current_count");
        process_current_count_el.innerHTML = `(${this.disk.call_pool.length.toString()})`;

        const time_point = parseInt((<HTMLInputElement> document.getElementById("time_slider_input")).value);

        /* clear */
        this.display.ctx.clearRect(0, 0, this.display.ctx.canvas.width, this.display.ctx.canvas.height);

        /*
        * draw a rect representing the disk
        * from 0 to disk_size
        */
        const disk_height = 50;
        const disk_y = this.display.ctx.canvas.height / 2 - disk_height / 2;

        this.display.ctx.strokeStyle = "#ffffff";
        this.display.ctx.strokeRect(this.display.ctx.canvas.width / 2, disk_y, this.display.ctx.canvas.width / 2 - 50, disk_height);

        /* 
        * add text "0" nad "disk_size" at the edges
        */
        this.display.ctx.font = "20px Arial";
        this.display.ctx.fillStyle = "#ffffff";
        this.display.ctx.textAlign = "center";
        this.display.ctx.fillText("0", this.display.ctx.canvas.width / 2, disk_y + disk_height + 25);
        this.display.ctx.fillText(this.disk.MAX_POSITION.toString(), this.display.ctx.canvas.width - 50, disk_y + disk_height + 25);

        /*
        * draw a circle for each call
        * (only if the call is in the time point)
        * 
        * calls with deadline are drawn in yellow
        */
        const call_radius = 2;
        const call_y = this.display.ctx.canvas.height / 2;

        for (let i = 0; i < this.disk.call_pool.length; i++) {
            const call = this.disk.call_pool[i];

            if (call.appearance_time != time_point)
                continue;

            const call_x = this.display.ctx.canvas.width / 2 + (this.display.ctx.canvas.width / 2 - 50) * call.position / this.disk.MAX_POSITION;

            this.display.ctx.beginPath();
            this.display.ctx.arc(call_x, call_y, call_radius, 0, 2 * Math.PI);

            if (call.absolute_deadline != null && call.absolute_deadline != 0)
                /* white without deadline */
                this.display.ctx.fillStyle = "#ffff00";
            else
                /* yellow with deadline */
                this.display.ctx.fillStyle = "#ffffff";

            this.display.ctx.fill();
            this.display.ctx.closePath();
        }
    }

    run(animation: boolean = false): void {
        if (animation)
            return;

        const algStr = (<HTMLInputElement> document.getElementById("a_type")).value;

        switch(algStr.toLowerCase()){
            case "fcfs":
                {
                    this.disk.setAlgorithm(new FCFS());
                }
                break;
            case "sstf":
                {
                    this.disk.setAlgorithm(new SSTF());
                }
                break;
            case "scan":
                {
                    this.disk.setAlgorithm(new SCAN());
                }
                break;
            case "cscan":
                {
                    this.disk.setAlgorithm(new CSCAN());
                }
                break;
            case "edf":
                {
                    this.disk.setAlgorithm(new EDF());
                }
                break;
            case "fdscan":
                {
                    this.disk.setAlgorithm(new FDSCAN());
                }
                break;
            default:
                {
                    alert("Invalid algorithm");
                    return;
                }
        }

        const results = this.disk.simulate();
        this.disk.displayResults(results);
    }
}