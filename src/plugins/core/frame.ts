import { Global, Slot } from "../../init/systems.js"
import { IApp, IPlugin } from "../../init/types.js"

@Global
export class FrameComponent {
    constructor(
        public frames: number,
        public element: HTMLElement,
        public timer?: number,
    ) {}
}

export class FramePlugin implements IPlugin {

    build(app: IApp): void {
        app.addSystem(this.update)
    }

    update(
        @Slot(FrameComponent) frame: FrameComponent
    ) {
        const { frames, timer, element } = frame

        frame.frames++

        if (timer) {
            return
        }

        //@ts-ignore
        element.innerText = frames
        frame.frames = 0
        frame.timer = setTimeout(() => frame.timer = 0, 1000)
    }
}