import AllocationAlgorithm from "../AllocationAlgorithm";

import Frame from "../Frame";
import Process from "../Process";

import Proportional from "./Proportional";

export default class PageFaultControl implements AllocationAlgorithm {
    name: string = "PageFaultControl"
    run_proportional: boolean = true

    allocateFrames(frames: Frame[], processes: readonly Readonly<Process>[]): void {
        /* first run proportional allocation */
        if (this.run_proportional) {
            this.run_proportional = false;
            return new Proportional().allocateFrames(frames, processes);
        }

        /* then run page fault control */
        const MIN_FAULTS = 3;
        const MAX_FAULTS = 5; // frequency

        for (let i = 0; i < processes.length; i++) {
            const fault_frequency = processes[i].page_faults / processes[i].done_calls;
            const frames_number = frames.filter(frame => frame.process == processes[i]).length;

            if (fault_frequency < MIN_FAULTS && frames_number > 1) {
                /* deallocate 1 frame */
                for (let j = 0; j < frames.length; j++) {
                    if (frames[j].process == processes[i]) {
                        frames[j].process = null;
                        break;
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