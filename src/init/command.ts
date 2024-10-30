import { ConstructorOf } from "../util/lang_feature"
import { Command, ConstructorParameters, IComponent, IEntity, Cmd } from "./types"

const withResolvers = <T>() => {
    let resolve: (value?: T | PromiseLike<T>) => void
    let reject: (reason?: any) => void
    const promise = new Promise<T>((_resolve, _reject) => {
        //@ts-ignore
        resolve = _resolve
        reject = _reject
    })

    //@ts-ignore
    return { promise, resolve, reject }
}

export class CommandConcrete implements Command {
    constructor(
        private commandSequence: Cmd[]
    ) {}

    spawnEntity(id: IEntity, ...components: IComponent[]): Promise<void> {
        const { promise, resolve } = withResolvers<void>()
        this.commandSequence.push(world => {
            world.addEntity(id, ...components)
            resolve()
        })

        return promise
    }

    despawnEntity(id: IEntity): Promise<void> {
        const { promise, resolve } = withResolvers<void>()
        this.commandSequence.push(world => {
            world.removeEntity(id)
            resolve()
        })

        return promise
    }

    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): Promise<void> {
        const { promise, resolve } = withResolvers<void>()
        this.commandSequence.push(world => {
            world.addComponent(id, ctor, ...args)
            resolve()
        })

        return promise
    }

    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void> {
        const { promise, resolve } = withResolvers<void>()
        this.commandSequence.push(world => {
            world.removeComponent(id, ctor)
            resolve()
        })

        return promise
    }

    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void> {
        const { promise, resolve } = withResolvers<void>()
        this.commandSequence.push(world => {
            world.activateComponent(id, ctor)
            resolve()
        })

        return promise
    }

    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): Promise<void> {
        const { promise, resolve } = withResolvers<void>()
        this.commandSequence.push(world => {
            world.deactivateComponent(id, ctor)
            resolve()
        })

        return promise
    }

}