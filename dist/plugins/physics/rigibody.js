var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Slot } from "../../init/systems.js";
import { WorldPeriods } from "../../init/types.js";
import { Entity } from "../../init/world.js";
import { Vector } from "../../math/2d.js";
import { EventWriter } from "../core/events.js";
import { ReflectComponent } from "../core/reflect.js";
import { TickComponent } from "../core/tick.js";
import { Transform2DComponent } from "../renderer/2d.js";
import { collideAabb, transfromHitbox2d } from "./collide.js";
export class RigibodyComponent {
    mass;
    centroid;
    angularVelocity;
    angularAcceleration;
    hitboxes;
    constructor(mass = 0, centroid = Vector.zero(), angularVelocity = Vector.zero(), angularAcceleration = Vector.zero(), hitboxes = []) {
        this.mass = mass;
        this.centroid = centroid;
        this.angularVelocity = angularVelocity;
        this.angularAcceleration = angularAcceleration;
        this.hitboxes = hitboxes;
    }
}
export class ConstraintedRigibodyComponent {
    hitbox;
    mass;
    colliders;
    constructor(hitbox, mass = 0, colliders = []) {
        this.hitbox = hitbox;
        this.mass = mass;
        this.colliders = colliders;
    }
}
export class ConstraintedRigibodyCollision {
    collider;
    collided;
    result;
    colliderRigibody;
    collidedRigibody;
    depthLtrb;
    constructor(collider, collided, result, colliderRigibody, collidedRigibody, depthLtrb = []) {
        this.collider = collider;
        this.collided = collided;
        this.result = result;
        this.colliderRigibody = colliderRigibody;
        this.collidedRigibody = collidedRigibody;
        this.depthLtrb = depthLtrb;
    }
}
export class RigibodyPlugin {
    build(app) {
        app.addSystem(WorldPeriods.BeforeUpdate, this.update)
            .addSystem(WorldPeriods.BeforeUpdate, this.updateConstraintedRigibody);
    }
    update(rigibody, tick) {
        rigibody.angularVelocity.addSelf(rigibody.angularAcceleration.multiply(tick.delta));
    }
    updateConstraintedRigibody({ world }, { hitbox, colliders }, transform, events, { id }) {
        const root = transfromHitbox2d(hitbox, transform);
        for (const entity of colliders) {
            const colliderRigibody = world.getEntityComponent(entity, ConstraintedRigibodyComponent);
            const colliderTransform = world.getEntityComponent(entity, Transform2DComponent);
            if (!colliderRigibody || !colliderTransform) {
                continue;
            }
            const { hitbox } = colliderRigibody;
            const result = collideAabb(root, transfromHitbox2d(hitbox, colliderTransform));
            if (!result) {
                continue;
            }
            const a1 = root.pos;
            const a2 = root.pos.add(root.size);
            const b1 = hitbox.pos;
            const b2 = hitbox.pos.add(hitbox.size);
            const depthLtrb = [
                a1.x - b1.x,
                a1.y - b1.y,
                a2.x - b2.x,
                a2.y - b2.y,
            ];
            const collision = new ConstraintedRigibodyCollision(id, entity, result, world.getEntityComponent(id, ConstraintedRigibodyComponent), world.getEntityComponent(entity, ConstraintedRigibodyComponent), depthLtrb);
            events.write('collision', collision);
        }
    }
}
__decorate([
    __param(0, Slot(RigibodyComponent)),
    __param(1, Slot(TickComponent))
], RigibodyPlugin.prototype, "update", null);
__decorate([
    __param(0, Slot(ReflectComponent)),
    __param(1, Slot(ConstraintedRigibodyComponent)),
    __param(2, Slot(Transform2DComponent)),
    __param(3, Slot(EventWriter)),
    __param(4, Slot(Entity))
], RigibodyPlugin.prototype, "updateConstraintedRigibody", null);
