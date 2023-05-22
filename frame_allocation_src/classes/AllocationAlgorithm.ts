import Frame from "./Frame"
import Process from "./Process"

export default interface AllocationAlgorithm {
    /* should be the same as the filename */
    name: string

    allocateFrames(frames: Array<Frame>, processes: ReadonlyArray<Readonly<Process>>, time: number): void
}