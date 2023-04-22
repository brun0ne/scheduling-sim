import IMenu from "./IMenu";

export default interface IAnimationGUI {
    menu: IMenu
    visible: boolean 
    playing: boolean 
    speed: number
    
    GUI: HTMLDivElement | null
    MENU: HTMLDivElement | null
    
    init(): void

    togglePlaying(playing?: boolean): void

    toggleVisible(visible?: boolean): void

    reset(): void

    startAnimation(): void

    drawCurrentState(): void

    drawCalls(START_X: number, START_Y: number, WIDTH: number, HEIGHT: number, callsToDraw: any): void

    refreshInfo(): void

    refreshSpeed(): void

    step(): void

    afterDone(): void
}