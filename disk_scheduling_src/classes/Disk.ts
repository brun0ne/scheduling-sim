import Display from "../../shared/classes/Display";
import AccessAlgorithm from "./AccessAlgorithm";
import ReadCall from "./ReadCall";
import RealTimeReadCall from "./RealTimeReadCall";

type results = {
    totalHeadMovement: number
    missed_deadline: number
    satisfied_deadline: number
    non_real_time: number
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

        for (let i = 0; i < this.call_pool.length; i++) {
            this.call_pool[i].joined = false;
        }
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
            if (this.call_pool[i].appearance_time <= this.time && this.call_pool[i].joined == false) {
                this.call_pool[i].joined = true;
                this.call_queue.push(this.call_pool[i]);
            }
        }

        // if the algorithm abandons calls with not feasible deadline
        if (this.algorithm.realTime === true && this.algorithm.abandonNotFeasible === true){
            // remove from the queue and count as not satisfied
            for (let i = 0; i < this.call_queue.length; i++){
                if (!(this.call_queue[i] instanceof RealTimeReadCall))
                    continue;

                if (this.call_queue[i].absolute_deadline < this.time){
                    if (this.nextTarget == this.call_queue[i])
                        this.nextTarget = null;

                    (<RealTimeReadCall> this.call_queue[i]).missed_deadline = true;
                    this.call_finished.push(this.call_queue.splice(i, 1)[0]);

                    i--;
                }
            }
        }

        // pick next target
        this.nextTarget = this.algorithm.getNextTarget(this.head_position, this.call_queue, this.MAX_POSITION, this.time, this.nextTarget);

        // move head
        const delta = this.algorithm.getDelta(this.head_position, this.call_queue, this.MAX_POSITION, this.time, this.nextTarget);
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
                if (!this.algorithm.readOnFly)
                    this.nextTarget = null;

                this.call_queue[i].evaluate(this.time);
                this.call_finished.push(this.call_queue.splice(i, 1)[0]);
                
                const doMoreThanOnePerTick = true;
                if (!doMoreThanOnePerTick)
                    break;
                else
                    i--;
            }
        }
        
        /**
         * Only moving the disk head takes time
         */
        this.time += Math.abs(delta);
        /**
         * Except when the queue is empty
         *  - then the disk waits for a call
         *  - so the time is incremented by 1
         */
        if (this.call_queue.length == 0 && Math.abs(delta) == 0)
            this.time++;
    }

    isFinished(): boolean {
        return this.call_pool.length == this.call_finished.length;
    }

    simulate(): results {
        this.init();

        while (!this.isFinished()) {
            this.nextTick();
        }

        return this.getResults();
    }

    getResults(): results {
        /*
         * count missed & satisfied deadlines
         */
        let missed = 0;
        let satisfied = 0;

        for (let i = 0; i < this.call_finished.length; i++) {
            if (!(this.call_finished[i] instanceof RealTimeReadCall))
                continue;

            if ((<RealTimeReadCall> this.call_finished[i]).missed_deadline)
                missed++;
            if ((<RealTimeReadCall> this.call_finished[i]).missed_deadline == false)
                satisfied++;
        }

        const non_real_time = this.call_finished.length - missed - satisfied;
    
        return { 
            totalHeadMovement: this.total_head_movement,
            missed_deadline: missed,
            satisfied_deadline: satisfied,
            non_real_time: non_real_time
        }
    }

    /**
     * visualization & output
     */

    displayResults(results: results, algStr: string = this.algorithm.name): void {
        const results_wrapper = document.getElementById("results_wrapper");
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results");
        results_el.innerHTML = `
        Algorithm: ${algStr.toUpperCase()}

        Total disk head movement: ${results.totalHeadMovement.toFixed(0)}
        `.replace(RegExp("\n", "g"), "<br />");

        if (this.algorithm.realTime && this.algorithm.realTime === true) {
            results_el.innerHTML += `
            Missed deadlines: ${results.missed_deadline}
            Satisfied deadlines: ${results.satisfied_deadline}
            Non real-time finished: ${results.non_real_time}
            `.replace(RegExp("\n", "g"), "<br />");
        }
    }

    compareAllAndDisplayResults(algorithms: Array<AccessAlgorithm>): void {
        const results_wrapper = document.getElementById("results_wrapper");
        results_wrapper.style.display = "flex";

        const results_el = document.getElementById("results");
        results_el.innerHTML = "";

        for (let i = 0; i < algorithms.length; i++) {
            this.setAlgorithm(algorithms[i]);
            const results = this.simulate();

            results_el.innerHTML += `
            Algorithm: ${algorithms[i].name.toUpperCase()}
            Total disk head movement: ${results.totalHeadMovement.toFixed(0)}
            `.replace(RegExp("\n", "g"), "<br />");

            if (this.algorithm.realTime && this.algorithm.realTime === true) {
                results_el.innerHTML += `Missed deadlines: ${results.missed_deadline}
                Satisfied deadlines: ${results.satisfied_deadline}
                `.replace(RegExp("\n", "g"), "<br />");
            }

            results_el.innerHTML += "<br />";
        }
    }
}