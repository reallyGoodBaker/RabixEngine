import { Slot } from "../../init/systems.js"
import { IApp, IEntity, IPlugin, WorldPeriods } from "../../init/types.js"
import { Entity } from "../../init/world.js"
import { Vector } from "../../math/2d.js"
import { EventWriter } from "../core/events.js"
import { ReflectComponent } from "../core/reflect.js"
import { TickComponent } from "../core/tick.js"
import { Transform2DComponent } from "../renderer/2d.js"
import { collideAabb, transfromHitbox2d } from "./collide.js"

export interface Hitbox2D {
    pos: Vector,
    size: Vector,
}

export class RigibodyComponent {
    constructor(
        public mass = 0,
        public centroid = Vector.zero(),
        public angularVelocity = Vector.zero(),
        public angularAcceleration = Vector.zero(),
        public hitboxes: Hitbox2D[] = [],
    ) {}
}

export class ConstraintedRigibodyComponent {
    constructor(
        public hitbox: Hitbox2D,
        public mass = 0,
        public colliders: IEntity[] = [],
    ) {}
}

export class ConstraintedRigibodyCollision {
    constructor(
        public collider: IEntity,
        public collided: IEntity,
        public result: number,
        public colliderRigibody: ConstraintedRigibodyComponent,
        public collidedRigibody: ConstraintedRigibodyComponent,
        public depthLtrb: number[] = [],
    ) {}
}

export class RigibodyPlugin implements IPlugin {

    build(app: IApp): void {
        app.addSystem(WorldPeriods.BeforeUpdate, this.update)
            .addSystem(WorldPeriods.BeforeUpdate, this.updateConstraintedRigibody)
    }

    update(
        @Slot(RigibodyComponent) rigibody: RigibodyComponent,
        @Slot(TickComponent) tick: TickComponent,
    ) {
        rigibody.angularVelocity.addSelf(rigibody.angularAcceleration.multiply(tick.delta))
    }

    updateConstraintedRigibody(
        @Slot(ReflectComponent) { world }: ReflectComponent,
        @Slot(ConstraintedRigibodyComponent) { hitbox, colliders }: ConstraintedRigibodyComponent,
        @Slot(Transform2DComponent) transform: Transform2DComponent,
        @Slot(EventWriter) events: EventWriter,
        @Slot(Entity) { id }: Entity,
    ) {
        const root = transfromHitbox2d(hitbox, transform)

        for (const entity of colliders) {
            const colliderRigibody = world.getEntityComponent(entity, ConstraintedRigibodyComponent)
            const colliderTransform = world.getEntityComponent(entity, Transform2DComponent)

            if (!colliderRigibody || !colliderTransform) {
                continue
            }

            const { hitbox } = colliderRigibody
            const result = collideAabb(root, transfromHitbox2d(hitbox, colliderTransform))

            if (!result) {
                continue
            }

            const a1 = root.pos
            const a2 = root.pos.add(root.size)
            const b1 = hitbox.pos
            const b2 = hitbox.pos.add(hitbox.size)

            const depthLtrb = [
                a1.x - b1.x,
                a1.y - b1.y,
                a2.x - b2.x,
                a2.y - b2.y,
            ]

            const collision = new ConstraintedRigibodyCollision(
                id, entity, result,
                world.getEntityComponent(id, ConstraintedRigibodyComponent)!,
                world.getEntityComponent(entity, ConstraintedRigibodyComponent)!,
                depthLtrb,
            )

            events.write('collision', collision)
        }
    }

}