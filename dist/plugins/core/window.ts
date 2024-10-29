import { Global, Slot } from "../../init/systems.js"
import { IApp, IPlugin, WorldPeriods } from "../../init/types.js"

@Global
export class WindowComponent {
    constructor(
        public canvas = document.createElement('canvas'),
        //@ts-ignore
        public width = visualViewport.width,
        //@ts-ignore
        public height = visualViewport.height,
        public aspectRatio = 16 / 9,
        public backgroundColor = '#000'
    ) {}
}

function setWindow(
    canvas: HTMLCanvasElement,
    maxWidth: number,
    maxHeight: number,
    aspectRatio: number,
    backgroundColor: string
) {
    //是否匹配屏幕的宽度（上下留黑边）
    const matchWidth = maxWidth / aspectRatio <= maxHeight

    let width, height
    if (matchWidth) {
        width = maxWidth
        height = maxWidth / aspectRatio
    } else {
        height = maxHeight
        width = maxHeight * aspectRatio
    }

    //设置背景色
    document.body.style.backgroundColor = backgroundColor
    //居中
    canvas.style.position = 'fixed'
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.style.top = `${(maxHeight - height) / 2}px`
    canvas.style.left = `${(maxWidth - width) / 2}px`
}

export class WindowPlugin implements IPlugin {

    ready() {
        return !!visualViewport
    }

    build(app: IApp): void {
        app.addSystem(WorldPeriods.Init, this.initWindow)
            .world.globalComponents
            .set(WindowComponent, new WindowComponent())
    }

    initWindow(
        @Slot(WindowComponent) { canvas, width: maxWidth, height: maxHeight, aspectRatio, backgroundColor }: WindowComponent
    ) {
        setWindow(canvas, maxWidth, maxHeight, aspectRatio, backgroundColor)

        document.body.appendChild(canvas)
    }
}