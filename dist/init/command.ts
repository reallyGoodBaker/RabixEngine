import { ConstructorOf } from "../util/lang_feature"
import { Command, ConstructorParameters, IComponent, IEntity, IPlugin, IApp } from "./types"

export class CommandConcrete implements Command, IPlugin {
    app?: IApp

    build(app: IApp): void {
        this.app = app
    }

    async spawnEntity(id: IEntity, ...components: IComponent[]): Promise<void> {
        this.app?.world.addEntity(id, ...components)
    }

    despawnEntity(id: IEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getEntityComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<IComponent | null> {
        throw new Error("Method not implemented.");
    }


}