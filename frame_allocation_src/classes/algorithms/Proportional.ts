import AllocationAlgorithm from "../AllocationAlgorithm";

import Process from "../Process";
import Frame from "../Frame";

export default class Proportional implements AllocationAlgorithm {
    name: string = "Proportional"

    allocateFrames(frames: Array<Frame>, processes: ReadonlyArray<Readonly<Process>>): void {
        const total_pages = processes.map((process) => (process.range_of_pages)).reduce((prev, curr) => {
            return Math.max(prev, curr[1]);
        }, -1);

        let frames_allocated = 0;
        for (let i = 0; i < processes.length; i++) {
            const process_page_range = processes[i].range_of_pages[1] - processes[i].range_of_pages[0];
            let frames_for_process = Math.floor((process_page_range / total_pages) * frames.length);

            if (frames_for_process < 1) {
                frames_for_process = 1;
            }

            for (let j = 0; j < frames_for_process; j++) {
                if (frames_allocated >= frames.length) {
                    console.error(`There are not enough frames to allocate all frames.`);
                    break;
                }

                if (frames[frames_allocated].process != null) {
                    continue; // skip this frame if it's already allocated
                }

                frames[frames_allocated].process = <Process>processes[i];
                frames_allocated++;
            }
        }

        /* the remaining frames are left unallocated */
    }
}