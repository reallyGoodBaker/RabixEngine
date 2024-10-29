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
import { WindowComponent } from "../core/window.js";
import { Optional } from "../../init/systems.js";
let Renderer2DComponent = class Renderer2DComponent {
    ctx;
    constructor(ctx) {
        this.ctx = ctx;
    }
};
Renderer2DComponent = __decorate([
    Global
], Renderer2DComponent);
export { Renderer2DComponent };
export class Transform2DComponent {
    matrix;
    anchor;
    constructor(matrix = new DOMMatrix([1, 0, 0, 1, 0, 0]), anchor = [0, 0]) {
        this.matrix = matrix;
        this.anchor = anchor;
    }
}
export class RectOutlineComponent {
    w;
    h;
    color;
    width;
    alpha;
    constructor(w = 0, h = 0, color = 'red', width = 4, alpha = 1) {
        this.w = w;
        this.h = h;
        this.color = color;
        this.width = width;
        this.alpha = alpha;
    }
}
export class RectComponent {
    w;
    h;
    color;
    constructor(w = 0, h = 0, color = 'red') {
        this.w = w;
        this.h = h;
        this.color = color;
    }
}
export class Image2DComponent {
    source;
    w;
    h;
    sx;
    sy;
    color;
    constructor(source, w, h, sx = 0, sy = 0, color = 'red') {
        this.source = source;
        this.w = w;
        this.h = h;
        this.sx = sx;
        this.sy = sy;
        this.color = color;
    }
}
export class Renderer2DPlugin {
    build(app) {
        //@ts-ignore
        const mainCanvas = app.world.globalComponents.get(WindowComponent).canvas;
        const ctx = mainCanvas.getContext('2d');
        if (!ctx) {
            throw Error('Update your browser!');
        }
        mainCanvas.width = 1920;
        mainCanvas.height = 1080;
        app
            // .addSystem(WorldPeriods.AfterUpdate, this.applyTransfrom)
            .addSystem(WorldPeriods.AfterUpdate, this.renderRect)
            .addSystem(WorldPeriods.AfterUpdate, this.renderImage)
            .addSystem(WorldPeriods.AfterUpdate, this.renderRectOutline);
        // .addSystem(WorldPeriods.AfterUpdate, this.restoreTransfrom)
        app.world.globalComponents
            .set(Renderer2DComponent, new Renderer2DComponent(ctx));
    }
    applyTransfrom({ ctx }, { matrix }) {
        ctx.save();
        ctx.setTransform(matrix);
    }
    restoreTransfrom({ ctx }, _) {
        ctx.restore();
    }
    renderRect({ ctx }, { w, h, color }, t) {
        if (t) {
            ctx.save();
            ctx.setTransform(t.matrix);
        }
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        if (t) {
            ctx.restore();
        }
    }
    renderRectOutline({ ctx }, { w, h, color, width, alpha }, t) {
        if (t) {
            ctx.save();
            ctx.setTransform(t.matrix);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.strokeRect(0, 0, w, h);
        if (t) {
            ctx.restore();
        }
    }
    renderImage({ ctx }, image, t) {
        if (t) {
            ctx.save();
            ctx.setTransform(t.matrix);
        }
        const { source, sx, sy, w, h } = image;
        ctx.drawImage(source, sx, sy, w, h, 0, 0, w, h);
        if (t) {
            ctx.restore();
        }
    }
}
__decorate([
    __param(0, Slot(Renderer2DComponent)),
    __param(1, Slot(Transform2DComponent))
], Renderer2DPlugin.prototype, "applyTransfrom", null);
__decorate([
    __param(0, Slot(Renderer2DComponent)),
    __param(1, Slot(Transform2DComponent))
], Renderer2DPlugin.prototype, "restoreTransfrom", null);
__decorate([
    __param(0, Slot(Renderer2DComponent)),
    __param(1, Slot(RectComponent)),
    __param(2, Optional(Transform2DComponent))
], Renderer2DPlugin.prototype, "renderRect", null);
__decorate([
    __param(0, Slot(Renderer2DComponent)),
    __param(1, Slot(RectOutlineComponent)),
    __param(2, Optional(Transform2DComponent))
], Renderer2DPlugin.prototype, "renderRectOutline", null);
__decorate([
    __param(0, Slot(Renderer2DComponent)),
    __param(1, Slot(Image2DComponent)),
    __param(2, Optional(Transform2DComponent))
], Renderer2DPlugin.prototype, "renderImage", null);
