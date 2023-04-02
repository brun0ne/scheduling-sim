import Menu from './classes/Menu';
import Process from './classes/Process';

import Scheduler from './classes/Scheduler';
import FCFS from './classes/algorithms/FCFS';
import RR from './classes/algorithms/RR';

function main(){
    if (typeof document !== "undefined") {
        const menu = new Menu();
        menu.init();

        menu.scheduler.addProcessToPool(new Process(0, 2));
        menu.scheduler.addProcessToPool(new Process(0, 5));
        menu.scheduler.addProcessToPool(new Process(0, 3));
        menu.refreshProcesses();
    }
    else {
        const scheduler = new Scheduler();

        scheduler.addProcessToPool(new Process(0, 2));
        scheduler.addProcessToPool(new Process(0, 1));
        scheduler.addProcessToPool(new Process(0, 3));

        scheduler.setAlgorithm(new RR(1));

        console.log(scheduler.simulate());
    }
}

main();
