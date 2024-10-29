var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { App } from "../../init/app.js";
import { Slot } from "../../init/systems.js";
import { WorldPeriods } from "../../init/types.js";
import { ReflectComponent } from "../../plugins/core/reflect.js";
import { TickComponent } from "../../plugins/core/tick.js";
import { defaultPlugins } from "../../plugins/index.js";
import { KeyboardComponent } from "../../plugins/input/keyboard.js";
import { KinematicsComponent, KinematicsPlugin } from "../../plugins/physics/kinematics.js";
import { Image2DComponent, Transform2DComponent, RectOutlineComponent, Renderer2DComponent, Renderer2DPlugin } from "../../plugins/renderer/2d.js";
class KinematicsTest {
    init({ world }) {
        const x = (1980 - 300) / 2;
        const y = (1080 - 300) / 2;
        const image = document.createElement('img');
        image.src = 'http://q1.qlogo.cn/g?b=qq&nk=2433479855&s=100';
        image.onload = () => {
            world.addEntity('miku', new Image2DComponent(image, 100, 100), new Transform2DComponent(new DOMMatrix([3, 0, 0, 3, x, y]), [50, 50]), new RectOutlineComponent(image.width, image.height, 'blue'), new KinematicsComponent(), new TickComponent());
        };
    }
    update(kinematics, transform, tick) {
        const vec = kinematics.velocity.multiply(tick.delta);
        transform.matrix = transform.matrix.translate(...vec);
    }
    keyboardEvent(keyboard, kinematics) {
        let vs, hs = vs = 0;
        if (keyboard.keyPressed.has('KeyW')) {
            vs -= 0.5;
        }
        if (keyboard.keyPressed.has('KeyS')) {
            vs += 0.5;
        }
        if (keyboard.keyPressed.has('KeyA')) {
            hs -= 0.5;
        }
        if (keyboard.keyPressed.has('KeyD')) {
            hs += 0.5;
        }
        kinematics.velocity.x = hs;
        kinematics.velocity.y = vs;
    }
    clearCanvas({ ctx }) {
        ctx.clearRect(0, 0, 1920, 1080);
    }
    start() {
        const app = App.empty()
            .addPlugins(defaultPlugins)
            .addPlugin(new Renderer2DPlugin())
            .addPlugin(new KinematicsPlugin())
            .addSystem(WorldPeriods.Init, this.init)
            .addSystem(this.update)
            .addSystem(WorldPeriods.Event, this.keyboardEvent)
            .addSystem(WorldPeriods.Update, this.clearCanvas);
        app.world.addEntity('a');
        app.run();
    }
}
__decorate([
    __param(0, Slot(ReflectComponent))
], KinematicsTest.prototype, "init", null);
__decorate([
    __param(0, Slot(KinematicsComponent)),
    __param(1, Slot(Transform2DComponent)),
    __param(2, Slot(TickComponent))
], KinematicsTest.prototype, "update", null);
__decorate([
    __param(0, Slot(KeyboardComponent)),
    __param(1, Slot(KinematicsComponent))
], KinematicsTest.prototype, "keyboardEvent", null);
__decorate([
    __param(0, Slot(Renderer2DComponent))
], KinematicsTest.prototype, "clearCanvas", null);
new KinematicsTest().start();
