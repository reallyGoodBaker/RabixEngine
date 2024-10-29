var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Global, Slot } from "../../init/systems.js";
import { WorldPeriods } from "../../init/types.js";
import { EventWriter } from "../core/events.js";
let MouseComponent = class MouseComponent {
    x;
    y;
    buttons;
    oldX;
    oldY;
    constructor(x, y, buttons, oldX = 0, oldY = 0) {
        this.x = x;
        this.y = y;
        this.buttons = buttons;
        this.oldX = oldX;
        this.oldY = oldY;
    }
};
MouseComponent = __decorate([
    Global
], MouseComponent);
export { MouseComponent };
export class MouseButtonEvent {
    button;
    buttonLabel;
    status;
    constructor(button, buttonLabel, status) {
        this.button = button;
        this.buttonLabel = buttonLabel;
        this.status = status;
    }
}
export class MouseMoveEventComponent {
    dx;
    dy;
    constructor(dx = 0, dy = 0) {
        this.dx = dx;
        this.dy = dy;
    }
}
const mouseComponent = new MouseComponent(0, 0, 0, 0);
const mouseEvents = [];
const downHandler = (e) => {
    const button = MouseButtonMapping[e.button];
    mouseComponent.buttons = e.buttons;
    mouseEvents.push(new MouseButtonEvent(e.button, button, true));
};
const upHandler = (e) => {
    const button = MouseButtonMapping[e.button];
    mouseComponent.buttons = e.buttons;
    mouseEvents.push(new MouseButtonEvent(e.button, button, false));
};
const moveHandler = (e) => {
    mouseComponent.x = e.screenX;
    mouseComponent.y = e.screenY;
};
var MouseButtonMapping;
(function (MouseButtonMapping) {
    MouseButtonMapping[MouseButtonMapping["MouseLeft"] = 0] = "MouseLeft";
    MouseButtonMapping[MouseButtonMapping["MouseRight"] = 1] = "MouseRight";
    MouseButtonMapping[MouseButtonMapping["MouseMiddle"] = 2] = "MouseMiddle";
    MouseButtonMapping[MouseButtonMapping["Mouse4"] = 3] = "Mouse4";
    MouseButtonMapping[MouseButtonMapping["Mouse5"] = 4] = "Mouse5";
})(MouseButtonMapping || (MouseButtonMapping = {}));
export class MousePlugin {
    build(app) {
        window.addEventListener('mousedown', downHandler);
        window.addEventListener('mouseup', upHandler);
        window.addEventListener('mousemove', moveHandler);
        app.addSystem(WorldPeriods.BeforeEvent, this.updateMouseEvent)
            .addSystem(WorldPeriods.BeforeEvent, this.updateMousePosition)
            .world.globalComponents
            .set(MouseComponent, mouseComponent);
    }
    updateMouseEvent(writer) {
        mouseEvents.splice(0, mouseEvents.length).forEach(ev => {
            writer.write('mousebutton', ev);
            writer.write(ev.buttonLabel, ev.status);
        });
    }
    updateMousePosition(move) {
        const { oldX, oldY, x, y } = mouseComponent;
        move.dx = x - oldX;
        move.dy = y - oldY;
        mouseComponent.oldX = x;
        mouseComponent.oldY = y;
    }
}
__decorate([
    __param(0, Slot(EventWriter))
], MousePlugin.prototype, "updateMouseEvent", null);
__decorate([
    __param(0, Slot(MouseMoveEventComponent))
], MousePlugin.prototype, "updateMousePosition", null);
