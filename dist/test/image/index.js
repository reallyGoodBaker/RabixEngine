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
import { FrameComponent, FramePlugin } from "../../plugins/core/frame.js";
import { KeyboardComponent } from "../../plugins/input/keyboard.js";
import { ReflectComponent } from "../../plugins/core/reflect.js";
import { Renderer2DComponent, Image2DComponent, RectOutlineComponent, Transform2DComponent, Renderer2DPlugin } from "../../plugins/renderer/2d.js";
import { transfrom2d } from "../../math/2d.js";
import { EventReader } from "../../plugins/core/events.js";
import { MouseMoveEventComponent } from "../../plugins/input/mouse.js";
import { defaultPlugins } from "../../plugins/index.js";
class ShowOutlineComponent {
    showOutline;
    constructor(showOutline = true) {
        this.showOutline = showOutline;
    }
}
class MouseDragComponent {
    dragging;
    dx;
    dy;
    constructor(dragging = false, dx = 0, dy = 0) {
        this.dragging = dragging;
        this.dx = dx;
        this.dy = dy;
    }
}
class MyApp {
    init({ world }) {
        const x = (1980 - 300) / 2;
        const y = (1080 - 300) / 2;
        const image = document.createElement('img');
        image.src = 'http://q1.qlogo.cn/g?b=qq&nk=2433479855&s=100';
        image.onload = () => {
            world.addEntity('miku', new Image2DComponent(image, 100, 100), new Transform2DComponent(new DOMMatrix([3, 0, 0, 3, x, y]), [50, 50]), new ShowOutlineComponent(), new RectOutlineComponent(image.width, image.height, 'blue'), new MouseDragComponent(), new MouseMoveEventComponent());
        };
    }
    mikuUpdate(transform, { keyPressed }, events, drag, { dx, dy }) {
        const mouseLeft = events.type('MouseLeft').latest();
        let rotX = 0, rotY = 0, rotZ = 0;
        if (mouseLeft) {
            if (mouseLeft.data) {
                drag.dragging = true;
            }
            else {
                drag.dragging = false;
            }
        }
        if (drag.dragging) {
            rotY += dx;
            rotX += dy;
        }
        if (keyPressed.has('KeyW')) {
            rotX += 1;
        }
        if (keyPressed.has('KeyS')) {
            rotX -= 1;
        }
        if (keyPressed.has('KeyA')) {
            rotY -= 1;
        }
        if (keyPressed.has('KeyD')) {
            rotY += 1;
        }
        if (keyPressed.has('KeyQ')) {
            rotZ -= 1;
        }
        if (keyPressed.has('KeyE')) {
            rotZ += 1;
        }
        const { matrix, anchor } = transform;
        transform.matrix = transfrom2d(matrix, anchor, 'rotate', rotX, rotY, rotZ);
    }
    clearCanvas({ ctx }) {
        ctx.clearRect(0, 0, 1920, 1080);
    }
    toggleOutline(outline, { world }, events) {
        const e = events
            .type('keydown')
            //@ts-ignore
            .filter(({ data: { press } }) => press)
            .latest();
        if (!e) {
            return;
        }
        const { data: { press } } = e;
        if (press === 'Space') {
            if (outline.showOutline) {
                world.deactivateComponent('miku', RectOutlineComponent);
            }
            else {
                world.activateComponent('miku', RectOutlineComponent);
            }
            outline.showOutline = !outline.showOutline;
        }
    }
    start() {
        const app = App.empty()
            .addPlugins(defaultPlugins)
            .addPlugin(new Renderer2DPlugin())
            .addPlugin(new FramePlugin())
            .addSystem(WorldPeriods.Init, this.init)
            .addSystem(WorldPeriods.BeforeUpdate, this.clearCanvas)
            .addSystem(this.mikuUpdate)
            .addSystem(this.toggleOutline);
        app.world.addEntity('init', new FrameComponent(0, document.getElementById('fps')));
        app.run();
    }
}
__decorate([
    __param(0, Slot(ReflectComponent))
], MyApp.prototype, "init", null);
__decorate([
    __param(0, Slot(Transform2DComponent)),
    __param(1, Slot(KeyboardComponent)),
    __param(2, Slot(EventReader)),
    __param(3, Slot(MouseDragComponent)),
    __param(4, Slot(MouseMoveEventComponent))
], MyApp.prototype, "mikuUpdate", null);
__decorate([
    __param(0, Slot(Renderer2DComponent))
], MyApp.prototype, "clearCanvas", null);
__decorate([
    __param(0, Slot(ShowOutlineComponent)),
    __param(1, Slot(ReflectComponent)),
    __param(2, Slot(EventReader))
], MyApp.prototype, "toggleOutline", null);
new MyApp().start();
