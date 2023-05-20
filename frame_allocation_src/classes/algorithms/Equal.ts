import AllocationAlgorithm from "../AllocationAlgorithm";

import Process from "../Process";
import Frame from "../Frame";

export default class Equal implements AllocationAlgorithm {
    name: string = "Equal"

    allocateFrames(frames: Array<Frame>, processes: ReadonlyArray<Readonly<Process>>): void {
        const frames_per_process = Math.floor(frames.length / processes.length);

        console.log(`Allocating ${frames_per_process} frames per process`);
        console.log(`data.current_frames.length = ${frames.length}, data.processes.length = ${processes.length}`);

        for (let i = 0; i < frames.length; i++) {
            if (frames[i].process != null) {
                continue; // skip this frame if it's already allocated
            }

            frames[i].process = <Process>processes[Math.floor(i / frames_per_process)];
        }

        /* the remaining frames are left unallocated */
    }
}