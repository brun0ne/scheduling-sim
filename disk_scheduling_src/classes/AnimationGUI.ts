import Menu from "./Menu";
import ReadCall from "./ReadCall";

export default class AnimationGUI {
    menu: Menu
    visible: boolean = false
    playing: boolean = false
    speed: number = 1

    /*
    * DOM Elements
    */
    GUI: HTMLDivElement
    MENU: HTMLDivElement

    play_pause_button: HTMLButtonElement
    step_button: HTMLButtonElement
    stop_button: HTMLButtonElement
    speed_slider: HTMLInputElement

    info_algorithm: HTMLParagraphElement
    info_time: HTMLParagraphElement
    info_is_done: HTMLDivElement

    info_left_to_join: HTMLParagraphElement
    info_finished: HTMLParagraphElement
    info_total_head_movement: HTMLParagraphElement

    storedSetInterval: NodeJS.Timer

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

        this.info_left_to_join = document.getElementById("calls_info_left_to_join_value") as HTMLParagraphElement;
        this.info_finished = document.getElementById("calls_info_finished_value") as HTMLParagraphElement;
        this.info_total_head_movement = document.getElementById("current_total_head_movement_value") as HTMLParagraphElement;

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
            this.speed = parseInt(this.speed_slider.value);
            this.refreshSpeed();
        });

        /**
         * SetInterval
         */
        this.refreshSpeed();
    }

    togglePlaying(playing?: boolean): void {
        if (playing == null)
            this.playing = !this.playing;
        else
            this.playing = playing;

        this.refreshSpeed();
            
        this.play_pause_button.innerHTML = this.playing ? "Pause" : "Play";
    }

    toggleVisible(visible?: boolean): void {
        if (visible == null)
            this.visible = !this.visible;
        else
            this.visible = visible;
            
        if (this.visible){
            this.GUI.style.display = "block";
            this.MENU.style.display = "none";

            this.menu.display.resizeCallback = () => {
                this.drawCurrentState();
            }
            this.drawCurrentState();
        }
        else {
            this.GUI.style.display = "none";
            this.MENU.style.display = "flex";

            clearInterval(this.storedSetInterval);

            this.menu.display.resizeCallback = () => {
                this.menu.refreshCalls();
            }
            this.menu.refreshCalls();
        }
    }

    reset(): void {
        this.menu.disk.init();

        this.play_pause_button.innerHTML = "Play";
        this.playing = false;
    
        this.info_is_done.style.display = "none";
    }

    startAnimation(): void {
        this.reset();
        this.toggleVisible(true);
    }

    drawCurrentState(): void {;
        const display = this.menu.display;
        const disk = this.menu.disk;

        const DISK_WIDTH = display.ctx.canvas.width - 100;
        const DISK_HEIGHT = 50;
        const DISK_X = 50;
        const DISK_Y = display.ctx.canvas.height / 2 - DISK_HEIGHT / 2;

        /* clear */
        display.ctx.clearRect(0, 0, display.ctx.canvas.width, display.ctx.canvas.height);

        /*
         * draw a rect representing the disk
         * from 0 to disk_size
         */
        display.ctx.strokeStyle = "#ffffff";
        display.ctx.strokeRect(50, DISK_Y, DISK_WIDTH, DISK_HEIGHT);

        /*
         * draw each read call as a circle
         */
        this.drawCalls(DISK_X, DISK_Y, DISK_WIDTH, DISK_HEIGHT, disk.call_queue);

        /*
         * draw a rect representing the current position of the disk head
         */
        const disk_head_width = 6;
        const disk_head_height = DISK_HEIGHT + 20;
        const disk_head_x = DISK_X + (disk.head_position / disk.MAX_POSITION) * DISK_WIDTH - disk_head_width / 2;
        const disk_head_y = DISK_Y - 10;

        display.ctx.fillStyle = "#ff0000";
        display.ctx.fillRect(disk_head_x, disk_head_y, disk_head_width, disk_head_height);

        /*
         * refresh info
         */
        this.refreshInfo();

        /*
         * add text "0" and disk_size at the edges
         */
        display.ctx.font = "20px Arial";
        display.ctx.fillStyle = "#ffffff";
        display.ctx.textAlign = "center";

        display.ctx.fillText("0", 50, DISK_Y + DISK_HEIGHT + 25);
        display.ctx.fillText(disk.MAX_POSITION.toString(), display.ctx.canvas.width - 50, DISK_Y + DISK_HEIGHT + 25);
    }

    drawCalls(START_X: number, START_Y: number, WIDTH: number, HEIGHT: number, callsToDraw: Array<ReadCall>): void {
        /*
         * draw a circle for each call
         * (only if the call is in the time point)
         * 
         * calls with deadline are drawn in yellow
         */
        const display = this.menu.display;
        const disk = this.menu.disk;

        const call_radius = 2;
        const call_y = START_Y + HEIGHT / 2;

        for (let i = 0; i < callsToDraw.length; i++) {
            const call = callsToDraw[i];

            const call_x = START_X + WIDTH * call.position / disk.MAX_POSITION;

            display.ctx.beginPath();

            /* the current target is bigger */
            const TARGET_MULTIPLIER = 3;
            if (call === disk.nextTarget)
                display.ctx.arc(call_x, call_y, call_radius * TARGET_MULTIPLIER, 0, 2 * Math.PI);
            else
                display.ctx.arc(call_x, call_y, call_radius, 0, 2 * Math.PI);

            if (call.absolute_deadline != null && call.absolute_deadline != 0)
                /* white without deadline */
                display.ctx.fillStyle = "#ffff00";
            else
                /* yellow with deadline */
                display.ctx.fillStyle = "#ffffff";

            /* target as red */
            if (disk.nextTarget == call)
                display.ctx.fillStyle = "#ff0000";

            display.ctx.fill();
            display.ctx.closePath();
        }
    }

    refreshInfo(): void {
        const disk = this.menu.disk;

        this.info_algorithm.innerHTML = disk.algorithm.name;
        this.info_time.innerHTML = disk.time.toString();

        if (disk.isFinished())
            this.info_is_done.style.display = "block";
        else
            this.info_is_done.style.display = "none";

        const to_join = disk.call_pool.length - disk.call_queue.length - disk.call_finished.length;

        this.info_left_to_join.innerHTML = to_join.toString();
        this.info_finished.innerHTML = disk.call_finished.length.toString();
        this.info_total_head_movement.innerHTML = disk.total_head_movement.toString();

        /**
         * if there are processes to join
         *  - make the number yellow
         */
        if (to_join > 0)
            this.info_left_to_join.style.color = "#ffff00";
        else
            this.info_left_to_join.style.color = "#ffffff";
    }

    refreshSpeed(): void {
        clearInterval(this.storedSetInterval);

        this.storedSetInterval = setInterval((() => {
            if (this.playing){
                this.step();
            }
        }).bind(this), 1000 / this.speed);
    }

    step(): void {
        if (this.menu.disk.isFinished())
            return;

        this.menu.disk.nextTick();
        this.drawCurrentState();

        if (this.menu.disk.isFinished()){
            this.togglePlaying(false);
            this.menu.disk.displayResults(this.menu.disk.getResults());
            
            this.afterDone();
        }
    }

    afterDone(): void {
        this.info_is_done.style.display = "block";

        this.play_pause_button.disabled = true;
        this.step_button.disabled = true;
    }
}