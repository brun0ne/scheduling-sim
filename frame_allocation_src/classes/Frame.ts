import Page from "./Page";
import Process from "./Process";

export default class Frame {
    id: number
    page: Page | null
    process: Process | null

    constructor(id: number) {
        this.page = null;
        this.process = null;

        this.id = id;
    }
}