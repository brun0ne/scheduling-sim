import Display from "../../shared/classes/Display";
import Process from "./Process";
import System from "./System";
import RandomQueries from "./algorithms/RandomQueries";
import RandomQueriesUntilSuccess from "./algorithms/RandomQueriesUntilSuccess";
import Sharing from "./algorithms/Sharing";

export default class Menu {
    display: Display
    system: System
    animationGUI: any

    constructor() {
        this.display = new Display();
        this.system = new System();
    }

    init(): void {
        const run_button = document.getElementById("run_button") as HTMLButtonElement;
        run_button.addEventListener("click", () => { this.run() });

        const run_with_animation_button = document.getElementById("run_with_animation_button") as HTMLButtonElement;
        run_with_animation_button.addEventListener("click", () => { this.run(true) });

        const add_button = document.getElementById("add_button") as HTMLButtonElement;
        add_button.addEventListener("click", () => { this.addProcesses() });

        const clear_button = document.getElementById("clear_button") as HTMLButtonElement;
        clear_button.addEventListener("click", () => { this.clearProcesses() });

        /*
         * init 
         * set callback for resize
         */
        const initial_processor_count = parseInt((<HTMLInputElement>document.getElementById("s_processor_count")).value);
        this.system.init(initial_processor_count);
        this.display.init("main_canvas");
        // this.animationGUI.init();
        this.display.setResizeCallback(() => { this.refreshCalls() });

        /** 
         * basic settings
         */
        const processor_count = document.getElementById("s_processor_count") as HTMLInputElement;
        processor_count.addEventListener("change", (e: Event) => {
            const new_val = parseInt((<HTMLInputElement>e.target).value);

            if (isNaN(new_val) || new_val < 1) {
                alert("Invalid processor count");
                return;
            }

            this.system.init(new_val);
            this.refreshCalls();
        });

        /**
         * algorithm select
         * -> disable running with animation if compare_all
         * -> show special options
         */
        const algorithm_select = document.getElementById("a_type") as HTMLSelectElement;
        algorithm_select.addEventListener("change", (e: Event) => {
            const algStr = (<HTMLSelectElement>e.target).value.toLowerCase();

            if (algStr === "compare_all") {
                (<HTMLButtonElement>document.getElementById("run_with_animation_button")).setAttribute("disabled", "true");
            }
            else {
                (<HTMLButtonElement>document.getElementById("run_with_animation_button")).removeAttribute("disabled");
            }

            if (algStr === "random_queries" || algStr === "compare_all") {
                (<HTMLDivElement>document.getElementById("s_number_of_tries_all")).style.display = "block";
            }
            else {
                (<HTMLDivElement>document.getElementById("s_number_of_tries_all")).style.display = "none";
            }

            if (algStr === "sharing" || algStr === "compare_all") {
                (<HTMLDivElement>document.getElementById("s_ask_threshold_all")).style.display = "block";
            }
            else {
                (<HTMLDivElement>document.getElementById("s_ask_threshold_all")).style.display = "none";
            }
        });
        /* 
         * results buttons
         */
        const results_close = document.getElementById("results_close") as HTMLButtonElement;
        results_close.addEventListener("click", () => {
            (<HTMLDivElement>document.getElementById("results_wrapper")).style.display = "none";
        });

        /*
         * refresh calls 
         */
        this.refreshCalls();
    }

    addProcesses(): void {
        const process_count = parseInt((<HTMLInputElement>document.getElementById("c_count")).value);
        const min_load = parseInt((<HTMLInputElement>document.getElementById("s_min_load")).value);
        const max_load = parseInt((<HTMLInputElement>document.getElementById("s_max_load")).value);
        const min_time = parseInt((<HTMLInputElement>document.getElementById("s_min_time")).value);
        const max_time = parseInt((<HTMLInputElement>document.getElementById("s_max_time")).value);

        if (isNaN(process_count) || process_count < 1 ||
            isNaN(min_load) || min_load < 1 ||
            isNaN(max_load) || max_load < 1 ||
            isNaN(min_time) || min_time < 1 ||
            isNaN(max_time) || max_time < 1) {
            alert("Invalid input");
            return;
        }

        for (let i = 0; i < process_count; i++) {
            const load = Math.floor(Math.random() * (max_load - min_load + 1)) + min_load;
            const time = Math.floor(Math.random() * (max_time - min_time + 1)) + min_time;

            this.system.addProcess(new Process(i, load, time));
        }

        this.refreshCalls();
    }

    clearProcesses(): void {
        this.system.process_pool = [];
        this.refreshCalls();
    }

    refreshCalls(): void {
        const current_count_el = document.getElementById("p_current_count") as HTMLParagraphElement;
        current_count_el.innerHTML = `(${this.system.process_pool.length.toString()})`;

        let callStrings = [];
        for (const process of this.system.process_pool) {
            callStrings.push(`${process.load}%`);
        }

        const calls_el = document.getElementById("current_state_wrapper") as HTMLParagraphElement;
        calls_el.innerHTML = `Process queue: [${callStrings.join(", ")}]`;

        if (this.system.process_pool.length == 0) {
            calls_el.innerHTML = `Process queue: [<span style="color: yellow">empty</span>]`;
        }
    }

    run(animation?: boolean | undefined): void {
        if (this.system.process_pool.length === 0) {
            alert("Empty process queue");
            return;
        }

        const algStr = (<HTMLInputElement>document.getElementById("a_type")).value;
        let compare_all: boolean = false;

        const load_threshold = parseFloat((<HTMLInputElement>document.getElementById("s_load_threshold")).value);
        const ask_threshold = parseFloat((<HTMLInputElement>document.getElementById("s_ask_threshold")).value);
        const number_of_tries = parseInt((<HTMLInputElement>document.getElementById("s_number_of_tries")).value);

        switch (algStr.toLowerCase()) {
            case "random_queries":
                {
                    this.system.setAlgorithm(new RandomQueries(load_threshold, number_of_tries));
                    break;
                }
            case "random_queries_until_success":
                {
                    this.system.setAlgorithm(new RandomQueriesUntilSuccess(load_threshold));
                    break;
                }
            case "sharing":
                {
                    this.system.setAlgorithm(new Sharing(load_threshold, ask_threshold));
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
                new RandomQueries(load_threshold, number_of_tries),
                new RandomQueriesUntilSuccess(load_threshold),
                new Sharing(load_threshold, ask_threshold)
            ];

            this.system.compareAllAndDisplayResults(algorithms);
            return;
        }

        if (animation) {
            alert("Not implemented yet");
        }
        else {
            const results = this.system.simulate();
            this.system.displayResults(results);
        }
    }
}