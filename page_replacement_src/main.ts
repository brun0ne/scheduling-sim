import Memory from "./classes/Memory";
import Page from "./classes/Page";

import FIFO from "./classes/algorithms/FIFO";
import OPT from "./classes/algorithms/OPT";
import LRU from "./classes/algorithms/LRU";
import ALRU from "./classes/algorithms/ALRU";
import RAND from "./classes/algorithms/RAND";

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
        memory.addPageCallsToPool([1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]);
        memory.setAlgorithm(new ALRU());
        
        while (memory.page_calls.length > 0) {
            memory.nextTick();
        }

        console.log("Total page faults: " + memory.total_page_faults);
    }
}

main();
