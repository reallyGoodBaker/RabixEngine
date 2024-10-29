import { Scheduler } from "./scheduler.js";
import { World } from "./world.js";
export class App {
    plugins;
    scheduler;
    world;
    constructor(plugins, scheduler, world) {
        this.plugins = plugins;
        this.scheduler = scheduler;
        this.world = world;
        plugins.forEach(plugin => plugin.build(this));
    }
    static create(opt) {
        return new App(opt.plugins ?? new Set(), opt.scheduler ?? Scheduler.create(), opt.world ?? World.create());
    }
    static default() {
        return new App(new Set(), Scheduler.create(), World.create());
    }
    static empty() {
        return new App(new Set(), Scheduler.create(), World.create());
    }
    setWorld(world) {
        this.world = world;
        return this;
    }
    addPlugin(plugin) {
        this.plugins.add(plugin);
        plugin.build(this);
        return this;
    }
    addPlugins(plugins) {
        for (const plugin of plugins) {
            this.addPlugin(plugin);
        }
        return this;
    }
    removePlugin(plugin) {
        if (typeof plugin === 'function') {
            for (const plug of this.plugins) {
                if (plug instanceof plugin) {
                    plugin = plug;
                    break;
                }
            }
            return this;
        }
        this.plugins.delete(plugin);
        if (plugin.destroy) {
            plugin.destroy(this);
        }
        return this;
    }
    ready() {
        for (const plugin of this.plugins) {
            if (plugin.ready && plugin.ready(this)) {
                continue;
            }
            else
                return false;
        }
        return true;
    }
    finish() {
        for (const plugin of this.plugins) {
            if (plugin.destroy) {
                plugin.destroy(this);
            }
        }
    }
    run = () => {
        // 先检查插件是否就绪
        const check = () => {
            for (const plugin of this.plugins) {
                if (plugin.ready && !plugin.ready(this)) {
                    //循环等待直到插件全部就绪
                    requestIdleCallback(this.run);
                    return;
                }
            }
        };
        check();
        this.scheduler.run(this.world);
        return this;
    };
    setScheduler(scheduler) {
        this.scheduler = scheduler;
        return this;
    }
    addSystem(period, systems) {
        this.world.systems.addSystem(period, systems);
        return this;
    }
}
