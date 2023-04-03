import AccessAlgorithm from "./AccessAlgorithm";
import ReadCall from "./ReadCall";

type results = {
    totalHeadMovement: number
}

export default class Disk {
    head_position: number
    MAX_POSITION: number

    call_pool: Array<ReadCall>
    call_queue: Array<ReadCall>
    call_finished: Array<ReadCall>

    algorithm: AccessAlgorithm

    total_head_movement: number
    time: number

    nextTarget: ReadCall

    constructor(MAX_POSITION: number = 100) {
        this.time = 0;

        this.head_position = 0;
        this.MAX_POSITION = MAX_POSITION;

        this.call_pool = [];
        this.call_queue = [];
        this.call_finished = [];
    }

    init(MAX_POSITION: number = null): void {
        if (MAX_POSITION)
            this.MAX_POSITION = MAX_POSITION;

        this.call_queue = [];
        this.call_finished = [];

        this.time = 0;
        this.head_position = 0;
        this.total_head_movement = 0;
    }

    addCallToPool(call: ReadCall): void {
        this.call_pool.push(call);
    }

    clearCallPool(): void {
        this.call_pool = [];
    }

    setAlgorithm(algorithm: AccessAlgorithm): void {
        this.algorithm = algorithm;
    }

    nextTick(): void {
        // add calls to queue
        for (let i = 0; i < this.call_pool.length; i++) {
            if (this.call_pool[i].appearance_time == this.time) {
                this.call_queue.push(this.call_pool[i]);
            }
        }

        // pick next target
        this.nextTarget = this.algorithm.getNextTarget(this.head_position, this.call_queue, this.MAX_POSITION, this.time);

        // move head
        const delta = this.algorithm.getDelta(this.head_position, this.call_queue, this.MAX_POSITION, this.time);
        this.head_position += delta;

        this.total_head_movement += Math.abs(delta);

        // check if any call is ready
        for (let i = 0; i < this.call_queue.length; i++) {
            /*
            * if algorithm is not set to read on fly
            *   skip calls that are not the next target
            */
            if (!this.algorithm.readOnFly && this.call_queue[i] != this.nextTarget)
                continue;

            if (this.call_queue[i].position == this.head_position) {
                this.call_finished.push(this.call_queue.splice(i, 1)[0]);
                
                const doMoreThanOnePerTick = true;

                if (!doMoreThanOnePerTick)
                    break;
                else
                    i--;
            }
        }
        
        this.time += 1;
    }

    isFinished(): boolean {
        return this.call_pool.length == this.call_finished.length;
    }

    simulate(): results {
        this.init();

        while (!this.isFinished()) {
            this.nextTick();
        }

        console.log("Total head movement: " + this.total_head_movement);
    
        return { totalHeadMovement: this.total_head_movement }
    }

    /**
     * visualization & output
     */

    displayResults(algStr: string = this.algorithm.name, results: results): void {
        const results_wrapper = document.getElementById("results_wrapper");
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results");
        results_el.innerHTML = `
        Algorithm: ${algStr.toUpperCase()}

        Total disk head movement: ${results.totalHeadMovement.toFixed(0)}
        `.replace(RegExp("\n", "g"), "<br />");

        /*
        * TODO: missed & satisfied deadlines
        */
    }
}