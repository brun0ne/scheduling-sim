import AllocationAlgorithm from "../AllocationAlgorithm";

import Frame from "../Frame";
import Process from "../Process";

import Proportional from "./Proportional";

export default class PageFaultControl implements AllocationAlgorithm {
    name: string = "PageFaultControl"
    run_proportional: boolean = true

    min_fault_freq: number
    max_faults_freq: number
    time_window: number

    constructor(min_fault_freq: number, max_fault_freq: number, time_window: number = 5) {
        this.min_fault_freq = min_fault_freq;
        this.max_faults_freq = max_fault_freq;

        this.time_window = time_window;
    }

    allocateFrames(frames: Frame[], processes: readonly Readonly<Process>[], time: number): void {
        /* first run proportional allocation */
        if (this.run_proportional) {
            this.run_proportional = false;
            return new Proportional().allocateFrames(frames, processes);
        }

        /* then run page fault control */
        const MIN_FAULTS = this.min_fault_freq;
        const MAX_FAULTS = this.max_faults_freq; // frequency

        for (let i = 0; i < processes.length; i++) {
            const faultsInTimeWindow = processes[i].getFaultsInLastNTicks(this.time_window, time!);
            let fault_frequency = faultsInTimeWindow / this.time_window;
            let frames_number = frames.filter(frame => frame.process == processes[i]).length;

            console.log(`Process ${processes[i].id} fault frequency: ${fault_frequency} (${faultsInTimeWindow} / ${this.time_window})`);

            if (fault_frequency < MIN_FAULTS && frames_number > 1) {
                /* deallocate 1 frame */
                for (let j = 0; j < frames.length; j++) {
                    if (frames[j].process == processes[i]) {
                        frames[j].process = null;
                        return this.allocateFrames(frames, processes, time);
                    }
                }
            }

            if (fault_frequency > MAX_FAULTS) {
                /* allocate 1 frame if possible */
                for (let j = 0; j < frames.length; j++) {
                    if (frames[j].process == null) {
                        frames[j].process = <Process>processes[i];
                        break;
                    }
                }
            }
        }
    }
}