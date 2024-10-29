import { IApp, IPlugin, IScheduler, ISystem, IWorld, WorldPeriods } from "./types.js";
import { ConstructorOf } from "../util/lang_feature.js";
export declare class App implements IApp {
    plugins: Set<IPlugin>;
    scheduler: IScheduler;
    world: IWorld;
    constructor(plugins: Set<IPlugin>, scheduler: IScheduler, world: IWorld);
    static create(opt: {
        plugins?: Set<IPlugin>;
        scheduler?: IScheduler;
        world?: IWorld;
    }): App;
    static default(): App;
    static empty(): App;
    setWorld(world: IWorld): this;
    addPlugin(plugin: IPlugin): this;
    addPlugins(plugins: IPlugin[]): this;
    removePlugin(plugin: IPlugin | ConstructorOf<IPlugin>): this;
    ready(): boolean;
    finish(): void;
    run: () => this;
    setScheduler(scheduler: IScheduler): this;
    addSystem(system: ISystem): this;
    addSystem(period: WorldPeriods, system: ISystem): this;
    addSystem(period: WorldPeriods, systems: ISystem[]): this;
}
