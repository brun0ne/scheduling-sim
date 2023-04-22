import IAnimationGUI from './IAnimationGUI'
import Display from '../classes/Display'

export default interface IMenu {
    display: Display
    animationGUI: IAnimationGUI

    init(): void

    addCalls(): void

    clearCalls(): void

    refreshCalls(): void

    run(animation?: boolean): void
}