import { App } from "../../init/app.js"
import { Slot } from "../../init/systems.js"
import { WorldPeriods } from "../../init/types.js"
import { FrameComponent, FramePlugin } from "../../plugins/core/frame.js"
import { KeyboardComponent, KeyboardEventComponent } from "../../plugins/input/keyboard.js"
import { ReflectComponent } from "../../plugins/core/reflect.js"
import { Renderer2DComponent, Image2DComponent, RectOutlineComponent, Transform2DComponent, Renderer2DPlugin } from "../../plugins/renderer/2d.js"
import { transfrom2d } from "../../math/2d.js"
import { EventReader } from "../../plugins/core/events.js"
import { MouseMoveEventComponent } from "../../plugins/input/mouse.js"
import { defaultPlugins } from "../../plugins/index.js"

class ShowOutlineComponent {
    constructor(
        public showOutline = true
    ) {}
}

class MouseDragComponent {
    constructor(
        public dragging = false,
        public dx = 0,
        public dy = 0,
    ) {}
}

class MyApp {
    init(
        @Slot(ReflectComponent) { world }: ReflectComponent,
    ) {
        const x = (1980 - 300) / 2
        const y = (1080 - 300) / 2

        const image = document.createElement('img')
        image.src = 'http://q1.qlogo.cn/g?b=qq&nk=2433479855&s=100'
        image.onload = () => {
            world.addEntity(
                'miku',
                new Image2DComponent(
                    image,
                    100, 100,
                ),
                new Transform2DComponent(
                    new DOMMatrix([3, 0, 0, 3, x, y]),
                    [50, 50]
                ),
                new ShowOutlineComponent(),
                new RectOutlineComponent(image.width, image.height, 'blue'),
                new MouseDragComponent(),
                new MouseMoveEventComponent(),
            )
        }
    }

    mikuUpdate(
        @Slot(Transform2DComponent) transform: Transform2DComponent,
        @Slot(KeyboardComponent) { keyPressed }: KeyboardComponent,
        @Slot(EventReader) events: EventReader,
        @Slot(MouseDragComponent) drag: MouseDragComponent,
        @Slot(MouseMoveEventComponent) { dx, dy }: MouseMoveEventComponent,
    ) {
        const mouseLeft = events.type('MouseLeft').latest<number>()

        let rotX = 0, rotY = 0, rotZ = 0

        if (mouseLeft) {
            if (mouseLeft.data) {
                drag.dragging = true
            } else {
                drag.dragging = false
            }
        }

        if (drag.dragging) {
            rotY += dx
            rotX += dy
        }

        if (keyPressed.has('KeyW')) {
            rotX += 1
        }

        if (keyPressed.has('KeyS')) {
            rotX -= 1
        }

        if (keyPressed.has('KeyA')) {
            rotY -= 1
        }

        if (keyPressed.has('KeyD')) {
            rotY += 1
        }

        if (keyPressed.has('KeyQ')) {
            rotZ -= 1
        }

        if (keyPressed.has('KeyE')) {
            rotZ += 1
        }

        const { matrix, anchor } = transform

        transform.matrix = transfrom2d(
            matrix,
            anchor,
            'rotate',
            rotX, rotY, rotZ,
        )
    }

    clearCanvas(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent,
    ) {
        ctx.clearRect(0, 0, 1920, 1080)
    }

    toggleOutline(
        @Slot(ShowOutlineComponent) outline: ShowOutlineComponent,
        @Slot(ReflectComponent) { world }: ReflectComponent,
        @Slot(EventReader) events: EventReader,
    ) {
        const e = events
            .type<KeyboardEventComponent>('keydown')
            //@ts-ignore
            .filter(({ data: { press } }) => press)
            .latest<KeyboardEventComponent>()

        if (!e) {
            return
        }

        const { data: { press } } = e

        if (press === 'Space') {
            if (outline.showOutline) {
                world.deactivateComponent('miku', RectOutlineComponent)
            } else {
                world.activateComponent('miku', RectOutlineComponent)
            }

            outline.showOutline = !outline.showOutline
        }
    }

    start() {
        const app = App.empty()
            .addPlugins(defaultPlugins)
            .addPlugin(new Renderer2DPlugin())
            .addPlugin(new FramePlugin())
            .addSystem(WorldPeriods.Init, this.init)
            .addSystem(WorldPeriods.BeforeUpdate, this.clearCanvas)
            .addSystem(this.mikuUpdate)
            .addSystem(this.toggleOutline)

        
        app.world.addEntity(
            'init',
            new FrameComponent(0, document.getElementById('fps') as HTMLElement)
        )

        app.run()
    }
}

new MyApp().start()