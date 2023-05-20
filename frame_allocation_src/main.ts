import Menu from "./classes/Menu";

function main() {
    if (typeof document !== "undefined") {
        const menu = new Menu();
        menu.init();
    }
    else {
        /*
        * run with: tsc && node .\dist\frame_allocation_src\main.js
        */

    }
}

main();
