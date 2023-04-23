import IMenu from "../../shared/interfaces/IMenu";
import Display from "../../shared/classes/Display";

import AnimationGUI from "./AnimationGUI";
import MMU from "./MMU";
import Page from "./Page";

import FIFO from "./algorithms/FIFO";
import OPT from "./algorithms/OPT";
import LRU from "./algorithms/LRU";
import ALRU from "./algorithms/ALRU";
import RAND from "./algorithms/RAND";

export default class Menu implements IMenu {
    display: Display
    memory: MMU
    animationGUI: AnimationGUI

    constructor() {
        this.display = new Display();
        this.memory = new MMU();

        this.animationGUI = new AnimationGUI(this);
    }

    init(): void {  
        const run_button = document.getElementById("run_button") as HTMLButtonElement;
        run_button.addEventListener("click", () => { this.run() });

        const run_with_animation_button = document.getElementById("run_with_animation_button") as HTMLButtonElement;
        run_with_animation_button.addEventListener("click", () => { this.run(true) });

        const add_button = document.getElementById("add_button") as HTMLButtonElement;
        add_button.addEventListener("click", () => { this.addCalls() });

        const clear_button = document.getElementById("clear_button") as HTMLButtonElement;
        clear_button.addEventListener("click", () => { this.clearCalls() });

        /*
         * init 
         * set callback for resize
         */
        this.memory.init(5, 3);
        this.display.init("main_canvas");
        this.animationGUI.init();
        this.display.setResizeCallback(() => { this.refreshCalls() });

        /** 
         * basic settings
         */
        const number_of_pages = document.getElementById("s_page_count") as HTMLInputElement;
        number_of_pages.addEventListener("change", (e: Event) => {
            const new_val = parseInt((<HTMLInputElement> e.target).value);

            if (isNaN(new_val) || new_val < 1) {
                alert("Invalid number of pages");
                return;
            }

            this.memory.init(new_val, this.memory.number_of_frames);
            this.clearCalls();
            this.refreshCalls();
        });

        const number_of_frames = document.getElementById("s_frame_count") as HTMLInputElement;
        number_of_frames.addEventListener("change", (e: Event) => {
            const new_val = parseInt((<HTMLInputElement> e.target).value);

            if (isNaN(new_val) || new_val < 1) {
                alert("Invalid number of frames");
                return;
            }

            this.memory.init(this.memory.number_of_pages, new_val);
            this.refreshCalls();
        });

        /**
         * distribution select
         * -> show/hide specific options
         */
        const distribution_select = document.getElementById("c_distribution") as HTMLSelectElement;
        distribution_select.addEventListener("change", (e: Event) => {
            const distribution = (<HTMLSelectElement> e.target).value.toLowerCase();
            
            const window_size_el = document.getElementById("c_window_size_all") as HTMLDivElement;
            const window_delta_el = document.getElementById("c_window_delta_all") as HTMLDivElement;

            switch (distribution) {
                case "uniform":
                {
                    window_size_el.style.display = "none";
                    window_delta_el.style.display = "none";
                    break;
                }
                case "locality":
                {
                    window_size_el.style.display = "block";
                    window_delta_el.style.display = "block";
                    break;
                }
                default:
                {
                    alert("Invalid distribution");
                }
            }
        });

        /**
         * algorithm select
         * -> disable running with animation if compare_all
         */
        const algorithm_select = document.getElementById("a_type") as HTMLSelectElement;
        algorithm_select.addEventListener("change", (e: Event) =>
        {
            if ((<HTMLSelectElement> e.target).value.toLowerCase() === "compare_all")
            {
                (<HTMLButtonElement> document.getElementById("run_with_animation_button")).setAttribute("disabled", "true");
            }
            else
            {
                (<HTMLButtonElement> document.getElementById("run_with_animation_button")).removeAttribute("disabled");
            }
        });

        /* 
         * results buttons
         */
        const results_close = document.getElementById("results_close") as HTMLButtonElement;
        results_close.addEventListener("click", () => {
            (<HTMLDivElement> document.getElementById("results_wrapper")).style.display = "none";
        });

        /*
         * refresh calls 
         */
        this.refreshCalls();
    } 

    addCalls(): void {
        const distribution = (<HTMLInputElement> document.getElementById("c_distribution")).value;
        const call_count = parseInt((<HTMLInputElement> document.getElementById("c_count")).value);

        switch (distribution) {
            case "uniform":
            {
                /* generate calls */
                for (let i = 0; i < call_count; i++)
                {
                    this.memory.addPageCallsToPool([Math.floor(Math.random() * this.memory.number_of_pages)]);
                }
                break;
            }
            case "locality":
            {
                const window_size = parseInt((<HTMLInputElement> document.getElementById("c_window_size")).value);
                const window_delta = parseInt((<HTMLInputElement> document.getElementById("c_window_delta")).value);

                /* validate input */
                if (isNaN(window_size) || isNaN(window_delta)) {
                    alert("Invalid input");
                    return;
                }
                if (window_size > this.memory.number_of_pages) {
                    alert("Window size is bigger than number of pages");
                    return;
                }
                if (window_delta > this.memory.number_of_pages) {
                    alert("Window delta is bigger than number of pages");
                    return;
                }

                /* generate calls */
                let window_start = Math.floor(Math.random() * (this.memory.number_of_pages - window_size));
                for(let i = 0; i < call_count; i++) {
                    const page_id = Math.floor(Math.random() * window_size) + window_start;
                    this.memory.addPageCallsToPool([page_id]);

                    /* move window by delta in range [-window_delta, window_delta] */
                    const delta = Math.floor(Math.random() * (window_delta * 2 + 1)) - window_delta;
                    window_start = (window_start + delta) % (this.memory.number_of_pages - window_size);

                    /* avoid 0 % 0 */
                    if (this.memory.number_of_pages - window_size === 0) {
                        window_start = 0;
                    }

                    /* make sure window_start is in range [0, number_of_pages - window_size] */
                    if (window_start < 0) {
                        window_start += this.memory.number_of_pages;
                    }
                }

                break;
            }
            default:
            {
                alert("Invalid distribution");
                return;
            }
        }

        this.refreshCalls();
    }

    clearCalls(): void {
        this.memory.clearPageCallPool();
        this.refreshCalls();
    }

    refreshCalls(): void {
        console.log("Calls in pool: " + this.memory.page_call_pool.length);

        const current_count_el = document.getElementById("p_current_count") as HTMLParagraphElement;
        current_count_el.innerHTML = `(${this.memory.page_call_pool.length.toString()})`;

        const current_page_calls_el = document.getElementById("current_page_calls_val") as HTMLParagraphElement;
        current_page_calls_el.innerHTML = this.memory.page_call_pool.reduce((acc: string, page_call: Page) => acc + page_call.id.toString() + ", ", "").slice(0, -2);

        if(this.memory.page_call_pool.length == 0) {
            current_page_calls_el.innerHTML = "<span style='color: yellow'>empty</span>";
        }
    }

    run(animation?: boolean): void {
        const algStr = (<HTMLInputElement> document.getElementById("a_type")).value;
        let compare_all: boolean = false;

        switch(algStr.toLowerCase()) {
            case "fifo":
            {
                this.memory.setAlgorithm(new FIFO());
                break;
            }
            case "opt":
            {
                this.memory.setAlgorithm(new OPT());
                break;
            }
            case "lru":
            {   
                this.memory.setAlgorithm(new LRU());
                break;
            }
            case "alru":
            {
                this.memory.setAlgorithm(new ALRU());
                break;
            }
            case "rand":
            {
                this.memory.setAlgorithm(new RAND());
                break;
            }
            case "compare_all":
            {
                compare_all = true;
                break;
            }
            default:
            {
                alert("Invalid algorithm");
            }
        }

        if (compare_all) {
            const algorithms = [
                new FIFO(),
                new OPT(),
                new LRU(),
                new ALRU(),
                new RAND()
            ];
            
            this.memory.compareAllAndDisplayResults(algorithms);
            return;
        }

        if (animation) {
            this.animationGUI.startAnimation();
        }
        else {
            const results = this.memory.simulate();
            this.memory.displayResults(results);
        }
    }
}