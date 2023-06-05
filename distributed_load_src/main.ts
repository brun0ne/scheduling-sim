// import Menu from "./classes/Menu";

import Process from "./classes/Process";
import System from "./classes/System";
import RandomQueries from "./classes/algorithms/RandomQueries";
import RandomQueriesUntilSuccess from "./classes/algorithms/RandomQueriesUntilSuccess";

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

        for (let i = 0; i < 500; i++) {
            system.addProcess(new Process(i, Math.floor(Math.random() * 50), Math.floor(Math.random() * 30)));
        }
        system.init(5);

        const algorithms = [
            new RandomQueries(40, 5),
            new RandomQueriesUntilSuccess(40)
        ];

        for (const algorithm of algorithms) {
            system.setAlgorithm(algorithm);
            console.log(system.simulate());
        }
    }
}

main();
