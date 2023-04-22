import IAnimationGUI from "../../shared/interfaces/IAnimationGUI";
import IMenu from "../../shared/interfaces/IMenu";
import Menu from "./Menu";

export default class AnimationGUI implements IAnimationGUI {
    menu: IMenu;

    visible: boolean = false;
    playing: boolean = false;
    speed: number = 1;

    GUI: HTMLDivElement | null = null;
    MENU: HTMLDivElement | null = null;

    constructor(menu: Menu) {
        this.menu = menu;
    }

    init(): void {
        throw new Error("Method not implemented.");
    }
    togglePlaying(playing?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }
    toggleVisible(visible?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }
    reset(): void {
        throw new Error("Method not implemented.");
    }
    startAnimation(): void {
        throw new Error("Method not implemented.");
    }
    drawCurrentState(): void {
        throw new Error("Method not implemented.");
    }
    drawCalls(START_X: number, START_Y: number, WIDTH: number, HEIGHT: number, callsToDraw: any): void {
        throw new Error("Method not implemented.");
    }
    refreshInfo(): void {
        throw new Error("Method not implemented.");
    }
    refreshSpeed(): void {
        throw new Error("Method not implemented.");
    }
    step(): void {
        throw new Error("Method not implemented.");
    }
    afterDone(): void {
        throw new Error("Method not implemented.");
    }
}