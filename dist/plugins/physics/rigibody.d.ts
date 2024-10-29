import { IApp, IEntity, IPlugin } from "../../init/types.js";
import { Entity } from "../../init/world.js";
import { Vector } from "../../math/2d.js";
import { EventWriter } from "../core/events.js";
import { ReflectComponent } from "../core/reflect.js";
import { TickComponent } from "../core/tick.js";
import { Transform2DComponent } from "../renderer/2d.js";
export interface Hitbox2D {
    pos: Vector;
    size: Vector;
}
export declare class RigibodyComponent {
    mass: number;
    centroid: Vector;
    angularVelocity: Vector;
    angularAcceleration: Vector;
    hitboxes: Hitbox2D[];
    constructor(mass?: number, centroid?: Vector, angularVelocity?: Vector, angularAcceleration?: Vector, hitboxes?: Hitbox2D[]);
}
export declare class ConstraintedRigibodyComponent {
    hitbox: Hitbox2D;
    mass: number;
    colliders: IEntity[];
    constructor(hitbox: Hitbox2D, mass?: number, colliders?: IEntity[]);
}
export declare class ConstraintedRigibodyCollision {
    collider: IEntity;
    collided: IEntity;
    result: number;
    colliderRigibody: ConstraintedRigibodyComponent;
    collidedRigibody: ConstraintedRigibodyComponent;
    depthLtrb: number[];
    constructor(collider: IEntity, collided: IEntity, result: number, colliderRigibody: ConstraintedRigibodyComponent, collidedRigibody: ConstraintedRigibodyComponent, depthLtrb?: number[]);
}
export declare class RigibodyPlugin implements IPlugin {
    build(app: IApp): void;
    update(rigibody: RigibodyComponent, tick: TickComponent): void;
    updateConstraintedRigibody({ world }: ReflectComponent, { hitbox, colliders }: ConstraintedRigibodyComponent, transform: Transform2DComponent, events: EventWriter, { id }: Entity): void;
}
