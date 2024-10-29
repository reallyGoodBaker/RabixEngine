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
let FrameComponent = class FrameComponent {
    frames;
    element;
    timer;
    constructor(frames, element, timer) {
        this.frames = frames;
        this.element = element;
        this.timer = timer;
    }
};
FrameComponent = __decorate([
    Global
], FrameComponent);
export { FrameComponent };
export class FramePlugin {
    build(app) {
        app.addSystem(this.update);
    }
    update(frame) {
        const { frames, timer, element } = frame;
        frame.frames++;
        if (timer) {
            return;
        }
        //@ts-ignore
        element.innerText = frames;
        frame.frames = 0;
        frame.timer = setTimeout(() => frame.timer = 0, 1000);
    }
}
__decorate([
    __param(0, Slot(FrameComponent))
], FramePlugin.prototype, "update", null);
