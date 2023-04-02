import Display from "../../shared/classes/Display";

export default class Menu {
    display: Display

    constructor() {
        this.display = new Display();
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

        this.display.init("main_canvas");
        this.display.setResizeCallback(() => { this.refreshProcesses() });

        /* results buttons */

        const results_close = document.getElementById("results_close");
        results_close.addEventListener("click", () => {
            document.getElementById("results_wrapper").style.display = "none";
        });
    }

    addProcesses(): void {
    }

    clearProcesses(): void {
    }

    refreshProcesses(): void {
    }

    run(x = false): void {

    }
}