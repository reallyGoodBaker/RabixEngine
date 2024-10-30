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
import { Vec3 } from "../../math/3d/vec/vec3.js";
import { KeyboardComponent } from "../../plugins/input/keyboard.js";
export class InputComponent {
    direction = Vector.zero();
}
const up = new Vector(0, 1, 0);
const down = new Vector(0, -1, 0);
const left = new Vector(-1, 0, 0);
const right = new Vector(1, 0, 0);
export class InputTransformPlugin {
    build(app) {
        app.world.globalComponents
            .set(InputComponent, new InputComponent());
        app.addSystem(WorldPeriods.Event, this.inputTransform)
            .addSystem(WorldPeriods.AfterUpdate, this.resetInput);
    }
    inputTransform(keyboard, { direction }) {
        if (keyboard.keyPressed.has('KeyW')) {
            direction.addSelf(up);
        }
        if (keyboard.keyPressed.has('KeyA')) {
            direction.addSelf(left);
        }
        if (keyboard.keyPressed.has('KeyS')) {
            direction.addSelf(down);
        }
        if (keyboard.keyPressed.has('KeyD')) {
            direction.addSelf(right);
        }
        Vec3.normalize(direction);
    }
    resetInput({ direction }) {
        direction.x = direction.y = direction.z = 0;
    }
}
__decorate([
    __param(0, Slot(KeyboardComponent)),
    __param(1, Slot(InputComponent))
], InputTransformPlugin.prototype, "inputTransform", null);
__decorate([
    __param(0, Slot(InputComponent))
], InputTransformPlugin.prototype, "resetInput", null);
