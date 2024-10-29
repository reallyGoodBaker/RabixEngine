import { Scheduler } from "./scheduler.js"
import { IApp, IPlugin, IScheduler, ISystem, IWorld, WorldPeriods } from "./types.js"
import { World } from "./world.js"
import { ConstructorOf } from "../util/lang_feature.js"

export class App implements IApp {

    constructor(
        public plugins: Set<IPlugin>,
        public scheduler: IScheduler,
        public world: IWorld,
    ) {
        plugins.forEach(plugin => plugin.build(this))
    }

    static create(opt: {
        plugins?: Set<IPlugin>,
        scheduler?: IScheduler,
        world?: IWorld
    }) {
        return new App(
            opt.plugins ?? new Set<IPlugin>(),
            opt.scheduler ?? Scheduler.create(),
            opt.world ?? World.create(),
        ) 
    }

    static default() {
        return new App(
            new Set<IPlugin>(),
            Scheduler.create(),
            World.create(),
        )
    }

    static empty() {
        return new App(
            new Set<IPlugin>(),
            Scheduler.create(),
            World.create(),
        )
    }

    setWorld(world: IWorld) {
        this.world = world

        return this
    }

    addPlugin(plugin: IPlugin): this {
        this.plugins.add(plugin)
        plugin.build(this)

        return this
    }

    addPlugins(plugins: IPlugin[]) {
        for (const plugin of plugins) {
            this.addPlugin(plugin)
        }

        return this
    }

    removePlugin(plugin: IPlugin | ConstructorOf<IPlugin>): this {
        if (typeof plugin === 'function') {
            for (const plug of this.plugins) {
                if (plug instanceof plugin) {
                    plugin = plug
                    break
                }
            }

            return this
        }

        this.plugins.delete(plugin)
        
        if (plugin.destroy) {
            plugin.destroy(this)
        }

        return this
    }

    ready(): boolean {
        for (const plugin of this.plugins) {
            if (plugin.ready && plugin.ready(this)) {
                continue
            } else return false
        }

        return true
    }

    finish(): void {
        for (const plugin of this.plugins) {
            if (plugin.destroy) {
                plugin.destroy(this)
            }
        }
    }

    run = () => {
        // 先检查插件是否就绪
        const check = () => {
            for (const plugin of this.plugins) {
                if (plugin.ready && !plugin.ready(this)) {
                    //循环等待直到插件全部就绪
                    requestIdleCallback(this.run)
                    return
                }
            }
        }

        check()
        this.scheduler.run(this.world)

        return this
    }

    setScheduler(scheduler: IScheduler): this {
        this.scheduler = scheduler
        return this
    }

    addSystem(system: ISystem): this
    addSystem(period: WorldPeriods, system: ISystem): this
    addSystem(period: WorldPeriods, systems: ISystem[]): this
    addSystem(period: any, systems?: any): this {
        this.world.systems.addSystem(period, systems)
        return this
    }
    
}