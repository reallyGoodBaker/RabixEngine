var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Global, Query, Slot } from "../../init/systems.js";
import { App } from "../../init/app.js";
import { RectComponent, Renderer2DComponent, Renderer2DPlugin, Transform2DComponent } from '../../plugins/renderer/2d.js';
import { Vector } from "../../math/2d.js";
import { EventReader } from "../../plugins/core/events.js";
import { defaultPlugins } from "../../plugins/index.js";
import { TickComponent } from "../../plugins/core/tick.js";
import { WorldPeriods } from "../../init/types.js";
import { Scheduler } from "../../init/scheduler.js";
import { ReflectPlugin } from "../../plugins/core/reflect.js";
import { WindowComponent } from "../../plugins/core/window.js";
import { testAabb } from "../../plugins/physics/collide.js";
class Timer {
    dt = 0;
}
let GameState = class GameState {
    playing = true;
};
GameState = __decorate([
    Global
], GameState);
class SnakeNode {
    isHead = false;
    pos = new Vector(0, 0, 0);
    v = new Vector(1, 0, 0);
}
class Food {
    pos = new Vector(0, 0, 0);
    life = 8000;
}
const keyMapping = {
    'KeyW': new Vector(0, -1, 0),
    'KeyA': new Vector(-1, 0, 0),
    'KeyS': new Vector(0, 1, 0),
    'KeyD': new Vector(1, 0, 0),
};
class Snake {
    nodes;
    constructor(nodes = []) {
        this.nodes = nodes;
    }
}
const identity = () => new DOMMatrix([1, 0, 0, 1, 0, 0]);
const app = App.default();
const snake = new Snake();
function grow() {
    const tail = snake.nodes[snake.nodes.length - 1];
    const newTail = new SnakeNode();
    newTail.pos = tail.pos;
    newTail.v = tail.v;
    snake.nodes.push(newTail);
    app.world.addEntity(`body${snake.nodes.length}`, new Transform2DComponent(), new RectComponent(), newTail, new TickComponent());
}
class SnakeGame {
    start() {
        app
            .setScheduler(Scheduler.looper(80))
            .addPlugins(defaultPlugins)
            .addPlugin(new ReflectPlugin())
            .addPlugin(new Renderer2DPlugin())
            .addSystem(WorldPeriods.Init, this.init)
            .addSystem(WorldPeriods.Event, this.input)
            .addSystem(this.updateSnake)
            .addSystem(WorldPeriods.AfterUpdate, this.updateCanvas)
            .addSystem(WorldPeriods.BeforeEvent, this.clearCanvas)
            .addSystem(this.food)
            .addSystem(WorldPeriods.AfterUpdate, this.renderFood)
            .run();
        let head, b, b0;
        app.world.addEntity('head', new Transform2DComponent(identity().translate(100, 0, 0)), new RectComponent(), head = new SnakeNode(), new TickComponent()).addEntity('body', new Transform2DComponent(identity().translate(50, 0, 0)), new RectComponent(), b = new SnakeNode(), new TickComponent()).addEntity('body0', new Transform2DComponent(identity()), new RectComponent(), b0 = new SnakeNode(), new TickComponent()).addEntity('snake', snake, new TickComponent()).addEntity(`food`, new Transform2DComponent(identity().translate(Math.floor(Math.random() * 30) * 50, Math.floor(Math.random() * 15) * 50, 0)), new RectComponent(50, 50, 'blue'), new TickComponent(), new Food(), new Timer());
        snake.nodes.push(head, b, b0);
        head.isHead = true;
        head.pos.x = 50;
        app.world.globalComponents
            .set(GameState, new GameState());
    }
    init(win) {
        win.backgroundColor = 'green';
    }
    input(query) {
        const [reader, snake, state] = query.iter();
        const events = reader.type('keydown');
        if (!events.hasAny()) {
            return;
        }
        const press = events.latest().data.press;
        if (press === 'Escape') {
            state.playing = !state.playing;
            console.log(state.playing ? 'Game started' : 'Game paused');
            return;
        }
        const dv = keyMapping[press];
        if (snake.nodes[0].v.add(dv).modulo() === 0) {
            return;
        }
        snake.nodes[0].v = dv;
    }
    clearCanvas(renderer) {
        renderer.ctx.clearRect(0, 0, 1920, 1080);
    }
    updateSnake(query) {
        const [state, _, tick] = query.iter();
        if (!state.playing) {
            return;
        }
        snake.nodes.toReversed().forEach((node, i, arr) => {
            if (i < arr.length - 1) {
                node.pos = arr[i + 1].pos;
                node.v = arr[i + 1].v;
            }
            else {
                node.pos = node.v.multiply(tick.delta * 0.5).add(node.pos);
            }
        });
    }
    updateCanvas(query) {
        const [node, rect, transform] = query.iter();
        if (node.isHead) {
            rect.color = 'red';
        }
        else {
            rect.color = 'yellow';
        }
        rect.w = rect.h = 50;
        transform.matrix = identity().translate(node.pos.x, node.pos.y, 0);
    }
    food(query) {
        const [timer, tick, state, food, transform] = query.iter();
        if (!state.playing) {
            return;
        }
        if ((timer.dt += tick.delta) > 4000) {
            food.pos = new Vector(Math.floor(Math.random() * 15) * 50, Math.floor(Math.random() * 10) * 50, 0);
            transform.matrix = identity().translate(...food.pos);
            timer.dt = 0;
            return;
        }
        const result = testAabb({
            pos: food.pos,
            size: new Vector(50, 50, 0),
        }, {
            pos: snake.nodes[0].pos,
            size: new Vector(50, 50, 0),
        });
        if (result) {
            food.pos = new Vector(Math.floor(Math.random() * 15) * 50, Math.floor(Math.random() * 10) * 50, 0);
            grow();
            transform.matrix = identity().translate(...food.pos);
        }
    }
    renderFood(query) {
        const [transform, food] = query.iter();
        transform.matrix = identity().translate(food.pos.x, food.pos.y, 0);
    }
}
__decorate([
    __param(0, Slot(WindowComponent))
], SnakeGame.prototype, "init", null);
__decorate([
    __param(0, Query([
        EventReader, Snake, GameState
    ]))
], SnakeGame.prototype, "input", null);
__decorate([
    __param(0, Slot(Renderer2DComponent))
], SnakeGame.prototype, "clearCanvas", null);
__decorate([
    __param(0, Query([
        GameState, Snake, TickComponent
    ]))
], SnakeGame.prototype, "updateSnake", null);
__decorate([
    __param(0, Query([
        SnakeNode, RectComponent, Transform2DComponent
    ]))
], SnakeGame.prototype, "updateCanvas", null);
__decorate([
    __param(0, Query([
        Timer, TickComponent, GameState, Food, Transform2DComponent
    ]))
], SnakeGame.prototype, "food", null);
__decorate([
    __param(0, Query([
        Transform2DComponent, Food
    ]))
], SnakeGame.prototype, "renderFood", null);
new SnakeGame().start();
