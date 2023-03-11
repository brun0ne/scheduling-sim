import Process from './classes/Process';
import Scheduler from './classes/Scheduler';

import FCFS from './classes/algorithms/FCFS';

function main(){
    const scheduler = new Scheduler();
    scheduler.setAlgorithm(new FCFS());

    scheduler.addProcessToPool(new Process(0, 3));
    scheduler.addProcessToPool(new Process(0, 5));
    scheduler.addProcessToPool(new Process(0, 20));

    console.log(scheduler.simulate());
}

main();

/*
document.addEventListener("load", function(){
    main();
});
*/