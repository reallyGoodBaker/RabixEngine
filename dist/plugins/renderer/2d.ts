import { Global, Slot } from "../../init/systems.js"
import { IApp, IPlugin, WorldPeriods } from "../../init/types.js"
import { WindowComponent } from "../core/window.js"
import { Optional } from "../../init/systems.js"

@Global
export class Renderer2DComponent {
    constructor(
        public ctx: CanvasRenderingContext2D,
    ) {}
}

export class Transform2DComponent {
    constructor(
        public matrix = new DOMMatrix([1, 0, 0, 1, 0, 0]),
        public anchor: [number, number] = [0, 0],
    ) {}
}

export class RectOutlineComponent {
    constructor(
        public w = 0,
        public h = 0,
        public color = 'red',
        public width = 4,
        public alpha = 1,
    ) {}
}

export class RectComponent {
    constructor(
        public w = 0,
        public h = 0,
        public color = 'red',
    ) {}
}

export class Image2DComponent {
    constructor(
        public source: CanvasImageSource,
        public w: number,
        public h: number,
        public sx: number = 0,
        public sy: number = 0,
        public color = 'red',
    ) {}
}

export class Renderer2DPlugin implements IPlugin {
    build(app: IApp): void {
        //@ts-ignore
        const mainCanvas = app.world.globalComponents.get(WindowComponent).canvas
        const ctx = mainCanvas.getContext('2d')

        if (!ctx) {
            throw Error('Update your browser!')
        }

        mainCanvas.width = 1920
        mainCanvas.height = 1080

        app
        // .addSystem(WorldPeriods.AfterUpdate, this.applyTransfrom)
            .addSystem(WorldPeriods.AfterUpdate, this.renderRect)
            .addSystem(WorldPeriods.AfterUpdate, this.renderImage)
            .addSystem(WorldPeriods.AfterUpdate, this.renderRectOutline)
            // .addSystem(WorldPeriods.AfterUpdate, this.restoreTransfrom)

        app.world.globalComponents
            .set(Renderer2DComponent, new Renderer2DComponent(ctx))
    }

    applyTransfrom(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent,
        @Slot(Transform2DComponent) { matrix }: Transform2DComponent,
    ) {
        ctx.save()
        ctx.setTransform(matrix)
    }

    restoreTransfrom(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent,
        @Slot(Transform2DComponent) _: Transform2DComponent,
    ) {
        ctx.restore()
    }

    renderRect(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent,
        @Slot(RectComponent) { w, h, color }: RectComponent,
        @Optional(Transform2DComponent) t?: Transform2DComponent,
    ) {
        if (t) {
            ctx.save()
            ctx.setTransform(t.matrix)
        }

        ctx.fillStyle = color
        ctx.fillRect(0, 0, w, h)

        if (t) {
            ctx.restore()
        }
    }

    renderRectOutline(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent,
        @Slot(RectOutlineComponent) { w, h, color, width, alpha }: RectOutlineComponent,
        @Optional(Transform2DComponent) t?: Transform2DComponent,
    ) {
        if (t) {
            ctx.save()
            ctx.setTransform(t.matrix)
        }

        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.globalAlpha = alpha
        ctx.strokeRect(0, 0, w, h)

        if (t) {
            ctx.restore()
        }
    }

    renderImage(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent,
        @Slot(Image2DComponent) image: Image2DComponent,
        @Optional(Transform2DComponent) t?: Transform2DComponent,
    ) {
        if (t) {
            ctx.save()
            ctx.setTransform(t.matrix)
        }

        const {
            source,
            sx, sy,
            w, h
        } = image

        ctx.drawImage(source, sx, sy, w, h, 0, 0, w, h)

        if (t) {
            ctx.restore()
        }
    }
}