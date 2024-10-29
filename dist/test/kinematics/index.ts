import { App } from "../../init/app.js"
import { Slot } from "../../init/systems.js"
import { WorldPeriods } from "../../init/types.js"
import { ReflectComponent } from "../../plugins/core/reflect.js"
import { TickComponent } from "../../plugins/core/tick.js"
import { defaultPlugins } from "../../plugins/index.js"
import { KeyboardComponent } from "../../plugins/input/keyboard.js"
import { KinematicsComponent, KinematicsPlugin } from "../../plugins/physics/kinematics.js"
import { Image2DComponent, Transform2DComponent, RectOutlineComponent, Renderer2DComponent, Renderer2DPlugin } from "../../plugins/renderer/2d.js"

class KinematicsTest {

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
                new RectOutlineComponent(image.width, image.height, 'blue'),
                new KinematicsComponent(),
                new TickComponent(),
            )
        }
    }

    update(
        @Slot(KinematicsComponent) kinematics: KinematicsComponent,
        @Slot(Transform2DComponent) transform: Transform2DComponent,
        @Slot(TickComponent) tick: TickComponent,
    ) {
        const vec = kinematics.velocity.multiply(tick.delta)
        transform.matrix = transform.matrix.translate(...vec)
    }

    keyboardEvent(
        @Slot(KeyboardComponent) keyboard: KeyboardComponent,
        @Slot(KinematicsComponent) kinematics: KinematicsComponent,
    ) {
        let vs, hs = vs = 0
        if (keyboard.keyPressed.has('KeyW')) {
            vs -= 0.5
        }

        if (keyboard.keyPressed.has('KeyS')) {
            vs += 0.5
        }

        if (keyboard.keyPressed.has('KeyA')) {
            hs -= 0.5
        }

        if (keyboard.keyPressed.has('KeyD')) {
            hs += 0.5
        }

        kinematics.velocity.x = hs
        kinematics.velocity.y = vs
    }

    clearCanvas(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent,
    ) {
        ctx.clearRect(0, 0, 1920, 1080)
    }

    start() {
        const app = App.empty()
            .addPlugins(defaultPlugins)
            .addPlugin(new Renderer2DPlugin())
            .addPlugin(new KinematicsPlugin())
            .addSystem(WorldPeriods.Init, this.init)
            .addSystem(this.update)
            .addSystem(WorldPeriods.Event, this.keyboardEvent)
            .addSystem(WorldPeriods.Update, this.clearCanvas)

        app.world.addEntity('a')
        app.run()
    }
}

new KinematicsTest().start()