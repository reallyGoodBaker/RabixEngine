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
import { Vector } from "../../math/2d.js";
import { TickComponent } from "../../plugins/core/tick.js";
import { defaultPlugins, physicsPlugins } from "../../plugins/index.js";
import { KinematicsComponent } from "../../plugins/physics/kinematics.js";
import { ConstraintedRigibodyCollision, ConstraintedRigibodyComponent } from '../../plugins/physics/rigibody.js';
import { Image2DComponent, RectComponent, RectOutlineComponent, Renderer2DComponent, Renderer2DPlugin, Transform2DComponent } from "../../plugins/renderer/2d.js";
import { WorldPeriods } from '../../init/types.js';
import { EventReader } from "../../plugins/core/events.js";
import { Entity } from "../../init/world.js";
let groundHitbox = null;
let dzHitbox = null;
class HitboxOutline {
    hitBox;
    outline;
    constructor(hitBox, outline) {
        this.hitBox = hitBox;
        this.outline = outline;
    }
}
class GravityTest {
    updateGravity(kinematics, transform, { delta }, { id }) {
        // console.log(id)
        const d = kinematics.velocity.multiply(delta);
        transform.matrix.translateSelf(...d);
    }
    clear({ ctx }) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    updateCollision(events, transform, { id }, kinematics) {
        const ev = events
            .type(ConstraintedRigibodyCollision)
            .latest();
        if (!ev) {
            return;
        }
        if (id === 'ground') {
            return;
        }
        const { data: collision } = ev;
        const { depthLtrb } = collision;
        transform.matrix = transform.matrix.translate(0, -depthLtrb[0] / 500, 0);
        kinematics.velocity = Vector.zero();
    }
    renderHitboxes(outline) {
    }
    start() {
        const app = App.empty()
            .addPlugins(defaultPlugins)
            .addPlugins(physicsPlugins)
            .addPlugin(new Renderer2DPlugin())
            .addSystem(WorldPeriods.BeforeUpdate, this.updateGravity)
            .addSystem(this.updateCollision)
            .addSystem(WorldPeriods.BeforeEvent, this.clear);
        const world = app.world;
        const dz = document.createElement('img');
        dz.src = './assest/dz.jpg';
        dz.addEventListener('load', () => {
            const h = dz.naturalHeight;
            const w = dz.naturalWidth;
            dzHitbox = {
                pos: Vector.zero(),
                size: Vector.from([w, h, 0]),
            };
            app.world.addEntity('dz', new Image2DComponent(dz, w, h), new Transform2DComponent(new DOMMatrix([0.5, 0, 0, 0.5, 10, 0]), [w / 2, h / 2]), new KinematicsComponent(undefined, Vector.from([0, 0.009, 0])), new TickComponent(), new ConstraintedRigibodyComponent(dzHitbox, 0, ['ground']), new RectOutlineComponent(w, h, 'red'));
        });
        const w = 1920;
        const h = 10;
        const height = 1080;
        groundHitbox = {
            pos: Vector.zero(),
            size: Vector.from([w, h, 0]),
        };
        world.addEntity('ground', new RectComponent(w, h, 'blue'), new Transform2DComponent(new DOMMatrix([1, 0, 0, 1, 0, height - 15]), [w / 2, 5]), new TickComponent(), new ConstraintedRigibodyComponent(groundHitbox), new RectOutlineComponent(w, h, 'yellow'));
        app.run();
    }
}
__decorate([
    __param(0, Slot(KinematicsComponent)),
    __param(1, Slot(Transform2DComponent)),
    __param(2, Slot(TickComponent)),
    __param(3, Slot(Entity))
], GravityTest.prototype, "updateGravity", null);
__decorate([
    __param(0, Slot(Renderer2DComponent))
], GravityTest.prototype, "clear", null);
__decorate([
    __param(0, Slot(EventReader)),
    __param(1, Slot(Transform2DComponent)),
    __param(2, Slot(Entity)),
    __param(3, Slot(KinematicsComponent))
], GravityTest.prototype, "updateCollision", null);
__decorate([
    __param(0, Slot(HitboxOutline))
], GravityTest.prototype, "renderHitboxes", null);
new GravityTest().start();
