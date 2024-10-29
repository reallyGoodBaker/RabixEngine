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
import { Vector } from "../../math/2d.js";
import { TickComponent } from "../core/tick.js";
export class KinematicsComponent {
    velocity;
    acceleration;
    constructor(velocity = Vector.zero(), acceleration = Vector.zero()) {
        this.velocity = velocity;
        this.acceleration = acceleration;
    }
}
export class KinematicsPlugin {
    build(app) {
        app.addSystem(WorldPeriods.BeforeUpdate, this.updateKinematics);
    }
    updateKinematics(tick, kinematics) {
        const dt = tick.delta;
        kinematics.velocity.addSelf(kinematics.acceleration.multiply(dt));
    }
}
__decorate([
    __param(0, Slot(TickComponent)),
    __param(1, Slot(KinematicsComponent))
], KinematicsPlugin.prototype, "updateKinematics", null);
