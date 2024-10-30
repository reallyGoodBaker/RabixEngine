const withResolvers = () => {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        //@ts-ignore
        resolve = _resolve;
        reject = _reject;
    });
    //@ts-ignore
    return { promise, resolve, reject };
};
export class CommandConcrete {
    commandSequence;
    constructor(commandSequence) {
        this.commandSequence = commandSequence;
    }
    spawnEntity(id, ...components) {
        const { promise, resolve } = withResolvers();
        this.commandSequence.push(world => {
            world.addEntity(id, ...components);
            resolve();
        });
        return promise;
    }
    despawnEntity(id) {
        const { promise, resolve } = withResolvers();
        this.commandSequence.push(world => {
            world.removeEntity(id);
            resolve();
        });
        return promise;
    }
    addComponent(id, ctor, ...args) {
        const { promise, resolve } = withResolvers();
        this.commandSequence.push(world => {
            world.addComponent(id, ctor, ...args);
            resolve();
        });
        return promise;
    }
    removeComponent(id, ctor) {
        const { promise, resolve } = withResolvers();
        this.commandSequence.push(world => {
            world.removeComponent(id, ctor);
            resolve();
        });
        return promise;
    }
    activateComponent(id, ctor) {
        const { promise, resolve } = withResolvers();
        this.commandSequence.push(world => {
            world.activateComponent(id, ctor);
            resolve();
        });
        return promise;
    }
    deactivateComponent(id, ctor) {
        const { promise, resolve } = withResolvers();
        this.commandSequence.push(world => {
            world.deactivateComponent(id, ctor);
            resolve();
        });
        return promise;
    }
}
