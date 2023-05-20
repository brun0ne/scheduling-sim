import IAnimationGUI from "../../shared/interfaces/IAnimationGUI";
import Menu from "./Menu";

export default class AnimationGUI implements IAnimationGUI {
    menu: Menu

    visible: boolean = false
    playing: boolean = false
    speed: number = 1

    GUI: HTMLDivElement | null = null
    MENU: HTMLDivElement | null = null

    play_pause_button: HTMLButtonElement | null = null
    step_button: HTMLButtonElement | null = null
    stop_button: HTMLButtonElement | null = null
    speed_slider: HTMLInputElement | null = null

    info_algorithm: HTMLParagraphElement | null = null
    info_time: HTMLParagraphElement | null = null
    info_is_done: HTMLDivElement | null = null

    info_in_queue: HTMLParagraphElement | null = null
    info_finished: HTMLParagraphElement | null = null
    info_total_page_faults: HTMLParagraphElement | null = null
    info_total_page_hits: HTMLParagraphElement | null = null

    frame_rows: Array<HTMLTableRowElement> = []

    see_code_button: HTMLButtonElement | null = null

    /* setInterval */
    storedSetInterval: NodeJS.Timer | null = null

    constructor(menu: Menu) {
        this.menu = menu;
    }

    init(): void {
        this.GUI = document.getElementById("animation_gui") as HTMLDivElement;
        this.MENU = document.getElementById("settings") as HTMLDivElement;

        this.play_pause_button = document.getElementById("animation_play_pause") as HTMLButtonElement;
        this.step_button = document.getElementById("animation_step") as HTMLButtonElement;
        this.stop_button = document.getElementById("animation_stop") as HTMLButtonElement;
        this.speed_slider = document.getElementById("animation_speed_slider") as HTMLInputElement;

        this.info_algorithm = document.getElementById("animation_info_algorithm_value") as HTMLParagraphElement;
        this.info_time = document.getElementById("animation_info_time_value") as HTMLParagraphElement;
        this.info_is_done = document.getElementById("animation_is_done") as HTMLDivElement;

        this.info_in_queue = document.getElementById("calls_in_queue_value") as HTMLParagraphElement;
        this.info_finished = document.getElementById("calls_finished_value") as HTMLParagraphElement;
        this.info_total_page_faults = document.getElementById("total_page_faults_value") as HTMLParagraphElement;
        this.info_total_page_hits = document.getElementById("total_page_hits_value") as HTMLParagraphElement;

        this.see_code_button = document.getElementById("code_button") as HTMLButtonElement;

        /**
         * hide elements
         */
        this.info_is_done.style.display = "none";

        /*
         * Bind event listeners
         */
        this.play_pause_button.addEventListener("click", () => {
            this.togglePlaying();
        });

        this.step_button.addEventListener("click", () => {
            this.step();
        });

        this.stop_button.addEventListener("click", () => {
            this.toggleVisible(false);
        });

        this.speed_slider.addEventListener("input", () => {
            this.speed = parseInt(this.speed_slider!.value);
            this.refreshSpeed();
        });

        this.see_code_button.addEventListener("click", () => {
            if (this.menu.memory.allocationAlgorithm == null)
                return;

            const algorithmName = this.menu.memory.allocationAlgorithm.name;
            window.open(`https://github.com/brun0ne/scheduling-sim/blob/main/page_replacement_src/classes/algorithms/${algorithmName}.ts`, "_blank")!.focus();
        });

        /**
         * SetInterval
         */
        this.refreshSpeed();

        /**
         * prepare HTML table of states
         */
        this.initStateTable();
    }
    togglePlaying(playing?: boolean): void {
        if (playing == null)
            this.playing = !this.playing;
        else
            this.playing = playing;

        this.refreshSpeed();

        this.play_pause_button!.innerHTML = this.playing ? "Pause" : "Play";
    }

    toggleVisible(visible?: boolean): void {
        if (visible == null)
            this.visible = !this.visible;
        else
            this.visible = visible;

        if (this.visible) {
            this.GUI!.style.display = "block";
            this.MENU!.style.display = "none";

            this.menu.display.resizeCallback = () => {
                this.drawCurrentState();
            }
            this.drawCurrentState();
        }
        else {
            this.GUI!.style.display = "none";
            this.MENU!.style.display = "flex";

            if (this.storedSetInterval != null)
                clearInterval(this.storedSetInterval);

            this.menu.display.resizeCallback = () => {
                this.menu.refreshCalls();
            }
            this.menu.refreshCalls();
        }
    }

    reset(): void {
        if (this.play_pause_button == null || this.info_is_done == null || this.step_button == null)
            throw new Error("call init() first!");

        this.menu.memory.init();

        this.play_pause_button.innerHTML = "Play";
        this.playing = false;

        this.info_is_done.style.display = "none";

        this.play_pause_button.disabled = false;
        this.step_button.disabled = false;

        this.initStateTable();
    }

    startAnimation(): void {
        this.reset();
        this.toggleVisible(true);
    }

    drawCurrentState(): void {
        /**
         * refresh info
         */
        this.refreshInfo();

        this.drawCalls();
    }

    initStateTable(): void {
        /* grab elements */
        const time_row = document.getElementById("animation_table_time") as HTMLTableRowElement;
        const calls_row = document.getElementById("animation_table_page_calls") as HTMLTableRowElement;
        const tbody = document.getElementById("animation_table_body") as HTMLTableSectionElement;

        /* clear table */
        time_row.innerHTML = "";
        calls_row.innerHTML = "";

        /* time */
        {
            const time_row_header = document.createElement("th");
            time_row_header.innerHTML = "Time";
            time_row_header.classList.add("header");
            time_row.appendChild(time_row_header);
        }

        /* calls */
        {
            const calls_row_header = document.createElement("th");
            calls_row_header.innerHTML = "Page calls";
            calls_row_header.classList.add("header");
            calls_row.appendChild(calls_row_header);
        }

        /* frames */
        {
            /* remove old rows */
            while (tbody.lastChild != null) {
                const id = (tbody.lastChild as HTMLElement).id;
                if (id == "animation_table_page_calls") // skip the row with page calls
                    break;

                tbody.removeChild(tbody.lastChild);
            }

            /* add a row for each frame */
            const frame_rows: Array<HTMLTableRowElement> = [];
            for (let i = 0; i < this.menu.memory.number_of_frames; i++) {
                const frame_row = document.createElement("tr");

                const frame_row_header = document.createElement("th");
                frame_row_header.innerHTML = `Frame ${i}`;
                frame_row.appendChild(frame_row_header);

                frame_rows.push(frame_row);
                tbody.appendChild(frame_row);
            }
            this.frame_rows = frame_rows;
        }
    }

    drawCalls(START_X?: number, START_Y?: number, WIDTH?: number, HEIGHT?: number, callsToDraw?: any): void {
        /* grab elements */
        const time_row = document.getElementById("animation_table_time") as HTMLTableRowElement;
        const calls_row = document.getElementById("animation_table_page_calls") as HTMLTableRowElement;

        /* only add one column for the new state */
        const newCall = this.menu.memory.call_history.at(-1);
        if (newCall == null)
            return;

        /* time */
        {
            const timeTickEl = document.createElement("th");
            timeTickEl.innerHTML = `${this.menu.memory.time}`;
            time_row.appendChild(timeTickEl);
        }

        /* calls */
        {
            const callsTickEl = document.createElement("th");
            callsTickEl.innerHTML = `${newCall.id}`;

            calls_row.appendChild(callsTickEl);
        }

        /* frames */
        {
            for (let i = 0; i < this.menu.memory.number_of_frames; i++) {
                const frame_row = this.frame_rows[i];
                const page = this.menu.memory.frames[i].page;

                const frameTickEl = document.createElement("th");
                frameTickEl.innerHTML = `${page != null ? page.id : ""}`;

                if (page != null && page.id == newCall.id && this.menu.memory.last_call_caused_fault) {
                    // make page faults red
                    frameTickEl.style.backgroundColor = "red";
                }

                if (this.menu.memory.frames[i].process != null) {
                    frameTickEl.innerHTML += ` <span style='color: yellow'>(${this.menu.memory.frames[i].process!.id})</span>`;
                }

                frame_row.appendChild(frameTickEl);
            }
        }

        /* scroll to the right */
        const table = document.getElementById("animation_call_table") as HTMLTableElement;
        table.scrollLeft = table.scrollWidth;
    }

    refreshInfo(): void {
        const memory = this.menu.memory;
        if (memory.allocationAlgorithm == null)
            throw new Error("call startAnimation() first!");

        this.info_algorithm!.innerHTML = memory.allocationAlgorithm.name;
        this.info_time!.innerHTML = memory.time.toString();

        if (memory.isFinished())
            this.info_is_done!.style.display = "block";
        else
            this.info_is_done!.style.display = "none";

        this.info_total_page_hits!.innerHTML = (memory.call_history.length - memory.total_page_faults).toString();
        this.info_total_page_faults!.innerHTML = memory.total_page_faults.toString();

        this.info_in_queue!.innerHTML = memory.call_queue.length.toString();
        this.info_finished!.innerHTML = memory.call_history.length.toString();
    }

    refreshSpeed(): void {
        if (this.storedSetInterval != null)
            clearInterval(this.storedSetInterval);

        this.storedSetInterval = setInterval((() => {
            if (this.playing) {
                this.step();
            }
        }).bind(this), 1000 / this.speed);
    }

    step(): void {
        if (this.menu.memory.isFinished())
            return;

        this.menu.memory.nextTick();
        this.drawCurrentState();

        if (this.menu.memory.isFinished()) {
            this.togglePlaying(false);
            this.menu.memory.displayResults(this.menu.memory.getResults());

            this.afterDone();
        }
    }

    afterDone(): void {
        if (this.info_is_done == null || this.play_pause_button == null || this.step_button == null)
            throw new Error("call init() first!");

        this.info_is_done.style.display = "block";

        this.play_pause_button.disabled = true;
        this.step_button.disabled = true;
    }
}