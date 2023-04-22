import IMenu from "../../shared/interfaces/IMenu";
import Display from "../../shared/classes/Display";

import AnimationGUI from "./AnimationGUI";
import Memory from "./Memory";
import Page from "./Page";

import FIFO from "./algorithms/FIFO";
import OPT from "./algorithms/OPT";
import LRU from "./algorithms/LRU";
import ALRU from "./algorithms/ALRU";
import RAND from "./algorithms/RAND";

export default class Menu implements IMenu {
    display: Display
    memory: Memory
    animationGUI: AnimationGUI

    constructor() {
        this.display = new Display();
        this.memory = new Memory();

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
        this.display.init("main_canvas");
        // this.animationGUI.init();
        this.display.setResizeCallback(() => { this.refreshCalls() });

        /** 
         * basic settings
         */
        const number_of_pages = document.getElementById("s_page_count") as HTMLInputElement;
        number_of_pages.addEventListener("change", (e: Event) => {
            this.memory.init((<HTMLInputElement> e.target).valueAsNumber, this.memory.number_of_frames);
            this.clearCalls();
            this.refreshCalls();
        });

        const number_of_frames = document.getElementById("s_frame_count") as HTMLInputElement;
        number_of_frames.addEventListener("change", (e: Event) => {
            this.memory.init(this.memory.number_of_pages, (<HTMLInputElement> e.target).valueAsNumber);
            this.refreshCalls();
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
        this.memory.init(5, 3);
        this.refreshCalls();
    } 

    addCalls(): void {
        const distribution = (<HTMLInputElement> document.getElementById("c_distribution")).value;
        const call_count = parseInt((<HTMLInputElement> document.getElementById("c_count")).value);

        switch (distribution) {
            case "uniform":
            {
                for (let i = 0; i < call_count; i++)
                {
                    this.memory.addPageCallsToPool([Math.floor(Math.random() * this.memory.number_of_pages)]);
                }
            }
            case "real-life":
            {
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
            alert("Not implemented yet");
            this.animationGUI.startAnimation();
        }
        else {
            const results = this.memory.simulate();
            this.memory.displayResults(results);
        }
    }
}