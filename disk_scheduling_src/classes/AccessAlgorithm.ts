import ReadCall from "./ReadCall";

export default interface AccessAlgorithm {
    /* should be the same as the filename */
    name: string
    readOnFly: boolean
    
    realTime?: boolean
    abandonNotFeasible?: boolean

    getNextTarget(current_position: number, calls: Array<ReadCall>, max_position?: number, current_time?: number, currentTarget?: ReadCall): ReadCall

    getDelta(current_position: number, calls: Array<ReadCall>, max_position?: number, current_time?: number, currentTarget?: ReadCall): number
}
