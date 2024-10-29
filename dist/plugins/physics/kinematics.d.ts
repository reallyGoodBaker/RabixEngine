import { IApp, IPlugin } from "../../init/types.js";
import { Vector } from "../../math/2d.js";
import { TickComponent } from "../core/tick.js";
export declare class KinematicsComponent {
    velocity: Vector;
    acceleration: Vector;
    constructor(velocity?: Vector, acceleration?: Vector);
}
export declare class KinematicsPlugin implements IPlugin {
    build(app: IApp): void;
    updateKinematics(tick: TickComponent, kinematics: KinematicsComponent): void;
}
