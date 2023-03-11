import Menu from './classes/Menu';
import Display from './classes/Display';


function main(){
    const screen = new Display();
    screen.init("main_canvas");

    window.addEventListener("resize", () => { screen.resizeToFit() });

    const menu = new Menu();
    menu.init();
}

main();
