export default class Process {
    range_of_pages: [number, number]
    number_of_calls: number
    id: number

    static next_id: number = 0

    private calls: Array<number> = []

    constructor(range_of_pages: [number, number], number_of_calls: number) {
        this.range_of_pages = range_of_pages;
        this.number_of_calls = number_of_calls;

        this.id = Process.next_id++;
    }

    generateCalls(): void {
        this.calls = [];

        for (let i = 0; i < this.number_of_calls; i++) {
            this.calls.push(Math.floor(Math.random() * (this.range_of_pages[1] - this.range_of_pages[0])) + this.range_of_pages[0]);
        }
    }

    getCalls(): Array<number> {
        return this.calls;
    }
}
