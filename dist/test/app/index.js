var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { App } from '../../init/app.js';
import { Remote, Slot } from '../../init/systems.js';
import { World } from '../../init/world.js';
const world = World.create();
class HeatComponent {
    v = 100;
}
class Dt {
    current;
    dt;
    constructor(current = 0, dt = 0) {
        this.current = current;
        this.dt = dt;
    }
}
const entity1 = 'hpbar';
world.addEntity(entity1, new HeatComponent(), new Dt(performance.now(), 0));
const counter = document.getElementById('counter');
const hpbar = document.getElementById('hp');
const up = document.getElementById('up');
counter.style.cssText = 'line-height: 60px; text-align: center; font-size: 2rem';
hpbar.style.cssText = 'width: 100px; height: 10px; background-color: cyan;';
up.addEventListener('click', () => {
    world.getEntityComponent(entity1, HeatComponent).v += 50;
    counter.innerText = String(Number(counter.innerText) + 1);
});
class MyApp extends App {
    static renderHeat(heat) {
        if (heat.v < 0) {
            hpbar.style.width = (heat.v = 0) + 'px';
        }
        else if (heat.v < 700) {
            hpbar.style.width = heat.v + 'px';
            if (heat.v < 500) {
                counter.style.fontSize = '2rem';
                counter.style.color = '';
                hpbar.style.backgroundColor = 'cyan';
            }
            else {
                counter.style.fontSize = '4rem';
                counter.style.color = 'red';
                hpbar.style.backgroundColor = 'red';
            }
        }
        else {
            hpbar.style.width = (heat.v = 700) + 'px';
        }
    }
    static decreaseHeat(heat) {
        heat.v -= 1;
    }
    static countDt(dt) {
        const now = performance.now();
        dt.dt = now - dt.current;
        dt.current = now;
    }
}
__decorate([
    __param(0, Slot(HeatComponent))
], MyApp, "renderHeat", null);
__decorate([
    Remote,
    __param(0, Slot(HeatComponent))
], MyApp, "decreaseHeat", null);
__decorate([
    __param(0, Slot(Dt))
], MyApp, "countDt", null);
const app = MyApp
    .create({ world })
    // .setScheduler(Scheduler.looper(16.6))  //60fps
    .addSystem(MyApp.renderHeat)
    .addSystem(MyApp.decreaseHeat)
    .addSystem(MyApp.countDt)
    .run();
