import Memory from "./classes/Memory";
import Page from "./classes/Page";
import FIFO from "./classes/algorithms/FIFO";

function main() {
    if (typeof document !== "undefined") {
        // const menu = new Menu();
        // menu.init();
    }
    else {
        /*
        * run with: tsc && node .\dist\page_replacement_src\main.js
        */

        const memory = new Memory();
        memory.init(5, 3);

        memory.addPageCallToPool(new Page(1));
        memory.addPageCallToPool(new Page(2));
        memory.addPageCallToPool(new Page(3));
        memory.addPageCallToPool(new Page(4));
        memory.addPageCallToPool(new Page(1));
        memory.addPageCallToPool(new Page(2));
        memory.addPageCallToPool(new Page(5));
        memory.addPageCallToPool(new Page(1));
        memory.addPageCallToPool(new Page(2));
        memory.addPageCallToPool(new Page(3));
        memory.addPageCallToPool(new Page(4));
        memory.addPageCallToPool(new Page(5));

        memory.setAlgorithm(new FIFO());
        
        while (memory.page_calls.length > 0) {
            memory.nextTick();
        }

        console.log("Total page faults: " + memory.total_page_faults);
    }
}

main();
