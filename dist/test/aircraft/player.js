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
import { TickComponent } from "../../plugins/core/tick.js";
import { KinematicsComponent } from "../../plugins/physics/kinematics.js";
import { RectComponent, Transform2DComponent } from "../../plugins/renderer/2d.js";
import { InputComponent } from "./input-transform.js";
class ClientPlayerComponent {
}
export class ClientPlayerPlugin {
    build(app) {
        app.world.addEntity('persona', new TickComponent(), new Transform2DComponent(), new RectComponent(100, 100), new KinematicsComponent());
        app.addSystem(WorldPeriods.BeforeUpdate, this.trans);
    }
    trans({ direction }, { velocity }) {
        velocity.x = direction.x;
        velocity.y = direction.y;
        velocity.z = direction.z;
        velocity.multiplySelf(2);
    }
}
__decorate([
    __param(0, Slot(InputComponent)),
    __param(1, Slot(KinematicsComponent))
], ClientPlayerPlugin.prototype, "trans", null);
