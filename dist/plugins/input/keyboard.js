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
let KeyboardComponent = class KeyboardComponent {
    keyPressed;
    constructor(keyPressed = new Set()) {
        this.keyPressed = keyPressed;
    }
};
KeyboardComponent = __decorate([
    Global
], KeyboardComponent);
export { KeyboardComponent };
export class KeyboardEventComponent {
    press;
    release;
    constructor(press = '', release = '') {
        this.press = press;
        this.release = release;
    }
}
const keyboard = new KeyboardComponent();
const keyboardEvents = [];
export class keyboardPlugin {
    build(app) {
        app.addSystem(WorldPeriods.BeforeEvent, this.updateKeyEvent)
            .world.globalComponents
            .set(KeyboardComponent, keyboard);
        window.addEventListener('keydown', e => {
            keyboard.keyPressed.add(e.code);
            keyboardEvents.push(new KeyboardEventComponent(e.code));
        });
        window.addEventListener('keyup', e => {
            keyboard.keyPressed.delete(e.code);
            keyboardEvents.push(new KeyboardEventComponent(undefined, e.code));
        });
    }
    updateKeyEvent(writer) {
        if (!keyboardEvents.length) {
            return;
        }
        keyboardEvents.splice(0, keyboardEvents.length).forEach(ev => {
            if (ev.press) {
                writer.write('keydown', ev);
            }
            if (ev.release) {
                writer.write('keyup', ev);
            }
        });
    }
}
__decorate([
    __param(0, Slot(EventWriter))
], keyboardPlugin.prototype, "updateKeyEvent", null);
