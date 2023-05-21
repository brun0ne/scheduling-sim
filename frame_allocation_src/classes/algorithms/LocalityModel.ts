import AllocationAlgorithm from "../AllocationAlgorithm";

import Frame from "../Frame";
import Process from "../Process";

export default class LocalityModel implements AllocationAlgorithm {
    name: string = "LocalityModel"

    allocateFrames(frames: Array<Frame>, processes: ReadonlyArray<Readonly<Process>>): void {
        throw new Error("Method not implemented.");
    }
}