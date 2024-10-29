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
let WindowComponent = class WindowComponent {
    canvas;
    width;
    height;
    aspectRatio;
    backgroundColor;
    constructor(canvas = document.createElement('canvas'), 
    //@ts-ignore
    width = visualViewport.width, 
    //@ts-ignore
    height = visualViewport.height, aspectRatio = 16 / 9, backgroundColor = '#000') {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.aspectRatio = aspectRatio;
        this.backgroundColor = backgroundColor;
    }
};
WindowComponent = __decorate([
    Global
], WindowComponent);
export { WindowComponent };
function setWindow(canvas, maxWidth, maxHeight, aspectRatio, backgroundColor) {
    //是否匹配屏幕的宽度（上下留黑边）
    const matchWidth = maxWidth / aspectRatio <= maxHeight;
    let width, height;
    if (matchWidth) {
        width = maxWidth;
        height = maxWidth / aspectRatio;
    }
    else {
        height = maxHeight;
        width = maxHeight * aspectRatio;
    }
    //设置背景色
    document.body.style.backgroundColor = backgroundColor;
    //居中
    canvas.style.position = 'fixed';
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.top = `${(maxHeight - height) / 2}px`;
    canvas.style.left = `${(maxWidth - width) / 2}px`;
}
export class WindowPlugin {
    ready() {
        return !!visualViewport;
    }
    build(app) {
        app.addSystem(WorldPeriods.Init, this.initWindow)
            .world.globalComponents
            .set(WindowComponent, new WindowComponent());
    }
    initWindow({ canvas, width: maxWidth, height: maxHeight, aspectRatio, backgroundColor }) {
        setWindow(canvas, maxWidth, maxHeight, aspectRatio, backgroundColor);
        document.body.appendChild(canvas);
    }
}
__decorate([
    __param(0, Slot(WindowComponent))
], WindowPlugin.prototype, "initWindow", null);
