import { App } from "../../init/app.js"
import { Query, Slot, With } from "../../init/systems.js"
import { Vector } from "../../math/2d.js"
import { TickComponent } from "../../plugins/core/tick.js"
import { defaultPlugins, physicsPlugins } from "../../plugins/index.js"
import { KinematicsComponent } from "../../plugins/physics/kinematics.js"
import { ConstraintedRigibodyCollision, ConstraintedRigibodyComponent, Hitbox2D } from '../../plugins/physics/rigibody.js'
import { Image2DComponent, RectComponent, RectOutlineComponent, Renderer2DComponent, Renderer2DPlugin, Transform2DComponent } from "../../plugins/renderer/2d.js"
import { WorldPeriods } from '../../init/types.js'
import { EventReader } from "../../plugins/core/events.js"
import { Entity } from "../../init/world.js"

let groundHitbox: Hitbox2D | null = null
let dzHitbox: Hitbox2D | null = null

class HitboxOutline {
    constructor(
        public hitBox: Hitbox2D,
        public outline: RectOutlineComponent,
    ) { }
}

class GravityTest {

    updateGravity(
        @Slot(KinematicsComponent) kinematics: KinematicsComponent,
        @Slot(Transform2DComponent) transform: Transform2DComponent,
        @Slot(TickComponent) { delta }: TickComponent,
        @Slot(Entity) { id }: Entity,
    ) {
        // console.log(id)
        const d = kinematics.velocity.multiply(delta)
        transform.matrix.translateSelf(...d)
    }

    clear(
        @Slot(Renderer2DComponent) { ctx }: Renderer2DComponent
    ) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    updateCollision(
        @Slot(EventReader) events: EventReader,
        @Slot(Transform2DComponent) transform: Transform2DComponent,
        @Slot(Entity) { id }: Entity,
        @Slot(KinematicsComponent) kinematics: KinematicsComponent,
    ) {
        const ev = events
            .type(ConstraintedRigibodyCollision)
            .latest<ConstraintedRigibodyCollision>()

        if (!ev) {
            return
        }

        if (id === 'ground') {
            return
        }

        const { data: collision } = ev
        const { depthLtrb } = collision
        transform.matrix = transform.matrix.translate(0, -depthLtrb[0] / 500, 0)
        kinematics.velocity = Vector.zero()
    }

    renderHitboxes(
        @Slot(HitboxOutline) outline: HitboxOutline,
    ) {

    }

    start() {
        const app = App.empty()
            .addPlugins(defaultPlugins)
            .addPlugins(physicsPlugins)
            .addPlugin(new Renderer2DPlugin())
            .addSystem(WorldPeriods.BeforeUpdate, this.updateGravity)
            .addSystem(this.updateCollision)
            .addSystem(WorldPeriods.BeforeEvent, this.clear)
        
        const world = app.world
        
        const dz = document.createElement('img')
        dz.src = './assest/dz.jpg'

        dz.addEventListener('load', () => {
            const h = dz.naturalHeight
            const w = dz.naturalWidth

            dzHitbox = {
                pos: Vector.zero(),
                size: Vector.from([ w, h, 0 ]) as Vector,
            }

            app.world.addEntity(
                'dz',
                new Image2DComponent(dz, w, h),
                new Transform2DComponent(
                    new DOMMatrix([ 0.5, 0, 0, 0.5, 10, 0 ]),
                    [w/2, h/2]
                ),
                new KinematicsComponent(undefined, Vector.from([0, 0.009, 0]) as Vector),
                new TickComponent(),
                new ConstraintedRigibodyComponent(
                    dzHitbox,
                    0,
                    [ 'ground' ]
                ),
                new RectOutlineComponent(w, h, 'red'),
            )
        })

        const w = 1920
        const h = 10
        const height = 1080

        groundHitbox = {
            pos: Vector.zero(),
            size: Vector.from([ w, h, 0 ]) as Vector,
        }

        world.addEntity(
            'ground',
            new RectComponent(w, h, 'blue'),
            new Transform2DComponent(
                new DOMMatrix([1, 0, 0, 1, 0, height - 15]),
                [w/2, 5]
            ),
            new TickComponent(),
            new ConstraintedRigibodyComponent(
                groundHitbox
            ),
            new RectOutlineComponent(w, h, 'yellow'),
        )

        app.run()
    }
}

new GravityTest().start()