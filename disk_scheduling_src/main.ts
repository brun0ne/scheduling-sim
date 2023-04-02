import Disk from './classes/Disk';
import Menu from './classes/Menu';
import ReadCall from './classes/ReadCall';
import FCFS from './classes/algorithms/FCFS';
import SSTF from './classes/algorithms/SSTF';

function main(){
    if (typeof document !== "undefined") {
        const menu = new Menu();
        menu.init();
    }
    else {
        /*
        * run with: tsc && node .\dist\disk_scheduling_src\main.js
        */

        const disk = new Disk();
        disk.init(100);

        disk.addCallToPool(new ReadCall(5));
        disk.addCallToPool(new ReadCall(10));
        disk.addCallToPool(new ReadCall(8));
        disk.addCallToPool(new ReadCall(3));
        disk.addCallToPool(new ReadCall(11));

        disk.setAlgorithm(new SSTF());

        disk.simulate();
    }
}

main();
