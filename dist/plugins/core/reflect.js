var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Global } from "../../init/systems.js";
let ReflectComponent = class ReflectComponent {
    app;
    world;
    constructor(app, world) {
        this.app = app;
        this.world = world;
    }
};
ReflectComponent = __decorate([
    Global
], ReflectComponent);
export { ReflectComponent };
export class ReflectPlugin {
    ready;
    destroy;
    build(app) {
        app.world.globalComponents
            .set(ReflectComponent, new ReflectComponent(app, app.world));
    }
}
