import { ConstructorOf } from "../util/lang_feature.js";
import { IStorage, ITable } from "./table.js";
export type IEntity = string;
export interface IComponent {
}
export interface ISystem {
    (...args: any[]): void;
}
export declare enum ParameterType {
    Component = 0,
    Query = 1,
    Option = 2
}
export declare enum QueryFilterType {
    With = 0,
    Without = 1
}
export interface IQueryFilter {
    type: QueryFilterType;
    data: ConstructorOf<IComponent>;
}
export type IQuery = [ConstructorOf<IComponent>[], IQueryFilter[]];
export type ParameterDescriptor<T = ParameterType> = {
    type: T;
    data: T extends ParameterType.Component ? ConstructorOf<IComponent> : T extends ParameterType.Query ? IQuery : any;
};
export interface ISystemRecord {
    system: ISystem;
    components: ParameterDescriptor[];
    runner: RunnerLabel;
}
export declare enum RunnerLabel {
    Local = 0,
    Remote = 1
}
export interface ISystemRecords extends Set<ISystemRecord> {
}
export interface AssestDescriptor {
    equals(another: AssestDescriptor): boolean;
}
export interface IApp {
    plugins: Set<IPlugin>;
    addPlugin(plugin: IPlugin): this;
    removePlugin(plugin: IPlugin): this;
    ready(): boolean;
    finish(): void;
    scheduler: IScheduler;
    setScheduler(scheduler: IScheduler): this;
    run(): IApp;
    addSystem(system: ISystem): this;
    addSystem(period: WorldPeriods, system: ISystem): this;
    addSystem(period: WorldPeriods, systems: ISystem[]): this;
    world: IWorld;
    setWorld(world: IWorld): this;
}
export interface ISchedulerRun {
    (world: IWorld): void;
}
interface ISchedulerExecutor {
    (...components: IComponent[]): void;
}
export interface ISchedulerRunner {
    (executor: ISchedulerExecutor, ...components: IComponent[]): void;
}
export interface IScheduler {
    run: ISchedulerRun;
    tick(world: IWorld, period: WorldPeriods): Promise<void>;
}
export interface IPlugin {
    ready?: (app: IApp) => boolean;
    build(app: IApp): void;
    destroy?: (app: IApp) => void;
}
export declare enum WorldPeriods {
    Init = 0,
    BeforeUpdate = 1,
    Update = 2,
    AfterUpdate = 3,
    BeforeEvent = 4,
    Event = 5
}
export interface ISystems {
    systemRecords: Map<WorldPeriods, ISystemRecords>;
    recordSystems(period: WorldPeriods, records: Iterable<ISystemRecord>): this;
    addSystem(system: ISystem): this;
    addSystem(period: WorldPeriods, system: ISystem): this;
    addSystem(period: WorldPeriods, systems: ISystem[]): this;
    entries(period: WorldPeriods): IterableIterator<ISystemRecord>;
}
export type ConstructorParameters<T extends (new (...args: any) => any)> = T extends new (...args: infer P) => any ? P : never;
export interface ClassPrototype {
    constructor: new (...arg: any[]) => any;
}
export interface IWorld {
    entities: Set<IEntity>;
    addEntity(id: IEntity, ...components: IComponent[]): this;
    removeEntity(id: IEntity): this;
    getEntityComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>): T | null;
    singletonComponents: Map<ConstructorOf<IComponent>, IComponent>;
    globalComponents: Map<ConstructorOf<IComponent>, IComponent>;
    systems: ISystems;
    store: Map<unknown, unknown>;
    storage: IStorage;
    table: ITable;
    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void;
    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void;
    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void;
    addComponent<T>(id: IEntity, component: T): void;
    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): void;
}
export interface Command {
    spawnEntity(id: IEntity, ...components: IComponent[]): Promise<void>;
    despawnEntity(id: IEntity): Promise<void>;
    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): Promise<void>;
    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>;
    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>;
    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>;
    getEntityComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<IComponent | null>;
}
export interface QueryResult<T = IComponent[]> {
    get<E extends IComponent>(ctor: ConstructorOf<E>): E | undefined;
    iter(): T;
}
export {};
