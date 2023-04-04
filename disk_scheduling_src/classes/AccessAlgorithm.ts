import ReadCall from "./ReadCall";

export default interface AccessAlgorithm {
    name: string
    readOnFly: boolean
    
    realTime?: boolean
    abandonsNotFeasible?: boolean

    getNextTarget(current_position: number, calls: Array<ReadCall>, max_position?: number, current_time?: number, currentTarget?: ReadCall): ReadCall

    getDelta(current_position: number, calls: Array<ReadCall>, max_position?: number, current_time?: number, currentTarget?: ReadCall): number
}
