import Page from "./Page";
import Process from "./Process";

export default class Frame {
    static next_id: number = 0

    id: number
    page: Page | null
    process: Process | null

    constructor() {
        this.page = null;
        this.process = null;

        this.id = Frame.next_id++;
    }
}