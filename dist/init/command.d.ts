import { ConstructorOf } from "../util/lang_feature";
import { Command, ConstructorParameters, IComponent, IEntity, IPlugin, IApp } from "./types";
export declare class CommandConcrete implements Command, IPlugin {
    app?: IApp;
    build(app: IApp): void;
    spawnEntity(id: IEntity, ...components: IComponent[]): Promise<void>;
    despawnEntity(id: IEntity): Promise<void>;
    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): Promise<void>;
    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>;
    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>;
    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void>;
    getEntityComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<IComponent | null>;
}
