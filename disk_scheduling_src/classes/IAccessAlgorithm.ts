import ReadCall from "./ReadCall";

export default interface IAccessAlgorithm {
    name: string
    readOnFly: boolean

    getNextTarget(current_position: number, calls: Array<ReadCall>): ReadCall

    getDelta(current_position: number, calls: Array<ReadCall>): -1|0|1
}
