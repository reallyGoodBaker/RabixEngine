import { ConstructorOf } from "../util/lang_feature.js"
import { IStorage, ITable } from "./table.js"

export type IEntity = string

export interface IComponent { }

export interface ISystem {
    (...args: any[]): void
}

export enum ParameterType {
    Component,
    Query,
    Option,
}

export enum QueryFilterType {
    With,
    Without
}

export interface IQueryFilter {
    type: QueryFilterType,
    data: ConstructorOf<IComponent>
}

export type IQuery = [ConstructorOf<IComponent>[], IQueryFilter[]]

export type ParameterDescriptor<T = ParameterType> = {
    type: T,
    data: T extends ParameterType.Component ? ConstructorOf<IComponent>
        : T extends ParameterType.Query ? IQuery : any
}

export interface ISystemRecord {
    system: ISystem
    components: ParameterDescriptor[]
    runner: RunnerLabel
}

export enum RunnerLabel {
    Local,
    Remote,
}

export interface ISystemRecords extends Set<ISystemRecord> { }

export interface AssestDescriptor {
    equals(another: AssestDescriptor): boolean
}

export interface IApp {
    plugins: Set<IPlugin>
    addPlugin(plugin: IPlugin): this
    removePlugin(plugin: IPlugin): this

    ready(): boolean
    finish(): void
    
    scheduler: IScheduler
    setScheduler(scheduler: IScheduler): this
    run(): IApp
    addSystem(system: ISystem): this
    addSystem(period: WorldPeriods, system: ISystem): this
    addSystem(period: WorldPeriods, systems: ISystem[]): this

    world: IWorld
    setWorld(world: IWorld): this
}

export interface ISchedulerRun {
    (world: IWorld): void
}

interface ISchedulerExecutor {
    (...components: IComponent[]): void
}

export interface ISchedulerRunner {
    (executor: ISchedulerExecutor, ...components: IComponent[]): void
}

export interface IScheduler {
    run: ISchedulerRun
    tick(world: IWorld, period: WorldPeriods): Promise<void>
}

export interface IPlugin {
    ready?: (app: IApp) => boolean
    build(app: IApp): void
    destroy?: (app: IApp) => void
}

export enum WorldPeriods {
    Init,
    BeforeUpdate,
    Update,
    AfterUpdate,
    BeforeEvent,
    Event,
}

export interface ISystems {
    systemRecords: Map<WorldPeriods, ISystemRecords>
    recordSystems(period: WorldPeriods, records: Iterable<ISystemRecord>): this
    addSystem(system: ISystem): this
    addSystem(period: WorldPeriods, ...system: ISystem[]): this
    addSystem(period: WorldPeriods, systems: ISystem[]): this
    entries(period: WorldPeriods): IterableIterator<ISystemRecord>
}

export type ConstructorParameters<T extends (new (...args: any) => any)> = T extends new (...args: infer P) => any ? P : never

export interface ClassPrototype {
    constructor: new (...arg: any[]) => any
}

export type Cmd = (world: IWorld) => void

export interface IWorld {
    entities: Set<IEntity>
    addEntity(id: IEntity, ...components: IComponent[]): this
    removeEntity(id: IEntity): this
    getEntityComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>): T | null

    commandSequence: Cmd[],
    globalComponents: Map<ConstructorOf<IComponent>, IComponent>
    systems: ISystems
    store: Map<unknown, unknown>
    storage: IStorage
    table: ITable
    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void
    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void
    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void
    addComponent<T>(id: IEntity, component: T): void
    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): void
}

export interface Command {
    spawnEntity(id: IEntity, ...components: IComponent[]): Promise<void>
    despawnEntity(id: IEntity): Promise<void>
    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): Promise<void>
    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>
    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>
    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>
}

export interface QueryResult<T = IComponent[]> {
    get<E extends IComponent>(ctor: ConstructorOf<E>): E | undefined
    iter(): T
}