import { ConstructorOf } from "../util/lang_feature.js";
import { IStorage, ITable } from "./table.js";
import { IComponent, IEntity, ISystems, IWorld } from "./types.js";
export declare class Entity implements IComponent {
    id: string;
    constructor(id: string);
}
export declare class World implements IWorld {
    #private;
    entities: Set<IEntity>;
    singletonComponents: Map<ConstructorOf<IComponent>, IComponent>;
    globalComponents: Map<ConstructorOf<IComponent>, IComponent>;
    systems: ISystems;
    store: Map<unknown, unknown>;
    storage: IStorage;
    table: ITable;
    constructor(entities: Set<IEntity>, singletonComponents: Map<ConstructorOf<IComponent>, IComponent>, globalComponents: Map<ConstructorOf<IComponent>, IComponent>, systems: ISystems, store: Map<unknown, unknown>, storage: IStorage, table: ITable);
    addComponent<T>(id: IEntity, component: T): void;
    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): void;
    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void;
    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void;
    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void;
    static create(): World;
    addEntity(id: IEntity, ...components: IComponent[]): this;
    removeEntity(id: IEntity): this;
    getEntityComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>): T | null;
}
