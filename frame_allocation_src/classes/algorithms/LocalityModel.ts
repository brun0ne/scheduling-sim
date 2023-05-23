import AllocationAlgorithm from "../AllocationAlgorithm";

import Frame from "../Frame";
import Process from "../Process";

import Proportional from "./Proportional";

export default class LocalityModel implements AllocationAlgorithm {
    name: string = "LocalityModel"
    time_window: number

    run_proportional: boolean = true

    constructor(time_window: number) {
        this.time_window = time_window;
    }

    allocateFrames(frames: Array<Frame>, processes: ReadonlyArray<Readonly<Process>>): void {
        /* first run proportional allocation */
        if (this.run_proportional) {
            this.run_proportional = false;
            return new Proportional().allocateFrames(frames, processes);
        }

        /* deallocate all frames */
        for (let i = 0; i < frames.length; i++) {
            frames[i].process = null;
        }

        let allocated_frames = 0;

        for (const process of processes) {
            if (process.done_calls == process.getCalls().length) // skip finished processes
                continue;

            let time_window = this.time_window;
            if (time_window > process.call_log.length)
                time_window = process.call_log.length;

            let uniquePagesInTimeWindow = process.getUniquePagesInLastN(this.time_window);

            if (uniquePagesInTimeWindow < 1)
                uniquePagesInTimeWindow = 1;

            /* allocate uniquePagesInTimeWindow frames */
            for (let i = 0; i < frames.length; i++) {
                if (frames[i].process != null) {
                    continue; // skip this frame if it's already allocated
                }

                if (uniquePagesInTimeWindow > 0) {
                    frames[i].process = <Process>process;

                    uniquePagesInTimeWindow--;
                    allocated_frames++;
                }

                if (uniquePagesInTimeWindow == 0)
                    break;
                if (allocated_frames == frames.length) {
                    console.warn("Allocated all frames (LocalityModel)");
                    break;
                }
            }
        }
    }
}