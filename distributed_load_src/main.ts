// import Menu from "./classes/Menu";

import Process from "./classes/Process";
import System from "./classes/System";
import RandomQueries from "./classes/algorithm/RandomQueries";

function main() {
    if (typeof document !== "undefined") {
        // const menu = new Menu();
        // menu.init();
    }
    else {
        /*
        * run with: tsc && node .\dist\main.js
        */

        const system = new System();

        for (let i = 0; i < 200; i++) {
            system.addProcess(new Process(i, Math.floor(Math.random() * 100), Math.floor(Math.random() * 10)));
        }
        system.init(10);

        system.setAlgorithm(new RandomQueries(50, 5));

        while (!system.isFinished()) {
            system.nextTick();
        }

        console.log(system.getResults());
    }
}

main();
