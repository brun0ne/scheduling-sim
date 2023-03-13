import Menu from './classes/Menu';
import Process from './classes/Process';

import Scheduler from './classes/Scheduler';
import FCFS from './classes/algorithms/FCFS';
import RR from './classes/algorithms/RR';

function main(){
    if (typeof document !== "undefined") {
        const menu = new Menu();
        menu.init();
    }
    else {
        const scheduler = new Scheduler();

        // const proc_runtime = 100;
        // const proc_start = 50;
        // const proc_count = 10000;

        // for (let i = 0; i < proc_count; i++){
        //     scheduler.addProcessToPool(new Process(Math.floor(Math.random() * proc_start), Math.floor(Math.random() * proc_runtime)));
        // }

        // scheduler.setAlgorithm(new FCFS());

        scheduler.addProcessToPool(new Process(0, 2));
        scheduler.addProcessToPool(new Process(0, 1));
        scheduler.addProcessToPool(new Process(0, 3));

        scheduler.setAlgorithm(new RR(1));

        console.log(scheduler.simulate());
    }
}

main();
