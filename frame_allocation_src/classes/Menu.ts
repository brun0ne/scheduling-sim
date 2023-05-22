import IMenu from "../../shared/interfaces/IMenu";
import Display from "../../shared/classes/Display";
import AllocatingMMU from "./AllocatingMMU";
import Process from "./Process";
import Page from "./Page";
import Equal from "./algorithms/Equal";
import AnimationGUI from "./AnimationGUI";
import Proportional from "./algorithms/Proportional";
import PageFaultControl from "./algorithms/PageFaultControl";
import LocalityModel from "./algorithms/LocalityModel";

export default class Menu implements IMenu {
    display: Display
    memory: AllocatingMMU
    animationGUI: AnimationGUI

    constructor() {
        this.display = new Display();
        this.memory = new AllocatingMMU();

        this.animationGUI = new AnimationGUI(this);
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

        const generate_call_queue_button = document.getElementById("generate_call_queue_button") as HTMLButtonElement;
        generate_call_queue_button.addEventListener("click", () => { this.addCalls() });

        const clear_call_queue_button = document.getElementById("clear_call_queue_button") as HTMLButtonElement;
        clear_call_queue_button.addEventListener("click", () => { this.clearCalls() });

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
        const number_of_frames = document.getElementById("s_frame_count") as HTMLInputElement;
        number_of_frames.addEventListener("change", (e: Event) => {
            const new_val = parseInt((<HTMLInputElement>e.target).value);

            if (isNaN(new_val) || new_val < 1) {
                alert("Invalid number of frames");
                return;
            }

            this.memory.init(this.memory.number_of_pages, new_val);
            this.refreshCalls();
        });

        /**
         * algorithm select
         * -> disable running with animation if compare_all
         * -> show special options for page fault control
         */
        const algorithm_select = document.getElementById("a_type") as HTMLSelectElement;
        algorithm_select.addEventListener("change", (e: Event) => {
            if ((<HTMLSelectElement>e.target).value.toLowerCase() === "compare_all") {
                (<HTMLButtonElement>document.getElementById("run_with_animation_button")).setAttribute("disabled", "true");
            }
            else {
                (<HTMLButtonElement>document.getElementById("run_with_animation_button")).removeAttribute("disabled");
            }

            if ((<HTMLSelectElement>e.target).value.toLowerCase() === "fault_control" ||
                (<HTMLSelectElement>e.target).value.toLowerCase() === "compare_all")
            {
                (<HTMLDivElement>document.getElementById("s_min_page_faults_all")).style.display = "block";
                (<HTMLDivElement>document.getElementById("s_max_page_faults_all")).style.display = "block";
            }
            else {
                (<HTMLDivElement>document.getElementById("s_min_page_faults_all")).style.display = "none";
                (<HTMLDivElement>document.getElementById("s_max_page_faults_all")).style.display = "none";
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

        const page_range_min = parseInt((<HTMLInputElement>document.getElementById("s_min_range")).value);
        const page_range_max = parseInt((<HTMLInputElement>document.getElementById("s_max_range")).value);

        const call_count_min = parseInt((<HTMLInputElement>document.getElementById("s_min_calls")).value);
        const call_count_max = parseInt((<HTMLInputElement>document.getElementById("s_max_calls")).value);

        let current_range_min = 0;

        for (let i = 0; i < process_count; i++) {
            const page_range = Math.floor(Math.random() * (page_range_max - page_range_min + 1)) + page_range_min;

            this.memory.addProcess(new Process(
                [current_range_min, current_range_min + page_range],
                Math.floor(Math.random() * (call_count_max - call_count_min + 1)) + call_count_min,
                i
            ));
            this.memory.processes[this.memory.processes.length - 1].generateCalls();

            current_range_min += page_range;
        }

        this.refreshCalls();
    }

    clearProcesses(): void {
        this.memory.clearProcesses();
        this.refreshCalls();
    }

    addCalls(): void {
        /* combine all process calls into one array */
        for (let i = 0; i < this.memory.processes.length; i++) {
            for (let j = 0; j < this.memory.processes[i].getCalls().length; j++) {
                this.memory.call_pool.push(new Page(this.memory.processes[i].getCalls()[j], this.memory.processes[i]));
            }
        }
        /* shuffle array */
        this.memory.call_pool.sort(() => Math.random() - 0.5);

        this.refreshCalls();
    }

    clearCalls(): void {
        this.memory.call_pool = [];
        this.refreshCalls();
    }

    refreshCalls(): void {
        const current_count_el = document.getElementById("p_current_count") as HTMLParagraphElement;
        current_count_el.innerHTML = `(${this.memory.processes.length.toString()})`;

        const generate_call_queue_button = document.getElementById("generate_call_queue_button") as HTMLButtonElement;

        if (this.memory.processes.length > 0 && this.memory.call_pool.length == 0) {
            generate_call_queue_button.removeAttribute("disabled");
        }
        else {
            generate_call_queue_button.attributes.setNamedItem(document.createAttribute("disabled"));
        }

        /* display individual process calls */
        const all_processes_el = document.getElementById("all_processes") as HTMLDivElement;
        all_processes_el.innerHTML = "";

        for (let i = 0; i < this.memory.processes.length; i++) {
            const process = this.memory.processes[i];

            const process_el = document.createElement("span");
            process_el.classList.add("process");

            process_el.innerHTML = `<span class="process_name">Calls of process ${i}: </span> <span class="process_calls">${process.getCalls().join(", ")}</span><br />`;

            all_processes_el.appendChild(process_el);
        }

        if (this.memory.processes.length == 0) {
            all_processes_el.innerHTML = "<span style='color: yellow'>No processes added yet.</span>";
        }

        /* display call queue */
        const call_count_el = document.getElementById("current_call_count") as HTMLParagraphElement;
        call_count_el.innerHTML = `(${this.memory.call_pool.length.toString()})`;

        const call_queue_el = document.getElementById("main_call_queue") as HTMLDivElement;
        call_queue_el.innerHTML = this.memory.call_pool.map((page) => { return page.id }).join(", ");

        if (this.memory.call_pool.length == 0) {
            call_queue_el.innerHTML = "<span style='color: yellow'>No calls in queue.</span>";
        }
    }

    run(animation?: boolean | undefined): void {
        if (this.memory.processes.length > this.memory.frames.length) {
            alert("Not enough frames for all processes");
            return;
        }

        const algStr = (<HTMLInputElement>document.getElementById("a_type")).value;
        let compare_all: boolean = false;

        switch (algStr.toLowerCase()) {
            case "equal":
                {
                    this.memory.setAlgorithm(new Equal());
                    break;
                }
            case "proportional":
                {
                    this.memory.setAlgorithm(new Proportional());
                    break;
                }
            case "fault_control":
                {
                    const min_freq = parseFloat((<HTMLInputElement>document.getElementById("s_min_page_faults")).value);
                    const max_freq = parseFloat((<HTMLInputElement>document.getElementById("s_max_page_faults")).value);

                    if (min_freq >= max_freq) {
                        alert("Minimum frequency has to be smaller than the maximum");
                        return;
                    }

                    this.memory.setAlgorithm(new PageFaultControl(min_freq, max_freq));
                    break;
                }
            case "locality_model":
                {
                    this.memory.setAlgorithm(new LocalityModel());
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
            const min_freq = parseFloat((<HTMLInputElement>document.getElementById("s_min_page_faults")).value);
            const max_freq = parseFloat((<HTMLInputElement>document.getElementById("s_max_page_faults")).value);

            if (min_freq >= max_freq) {
                alert("Minimum frequency has to be smaller than the maximum");
                return;
            }

            const algorithms = [
                new Equal(),
                new Proportional(),
                new PageFaultControl(min_freq, max_freq),
                // new LocalityModel()
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
