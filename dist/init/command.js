export class CommandConcrete {
    app;
    build(app) {
        this.app = app;
    }
    async spawnEntity(id, ...components) {
        this.app?.world.addEntity(id, ...components);
    }
    despawnEntity(id) {
        throw new Error("Method not implemented.");
    }
    addComponent(id, ctor, ...args) {
        throw new Error("Method not implemented.");
    }
    removeComponent(id, ctor) {
        throw new Error("Method not implemented.");
    }
    activateComponent(id, ctor) {
        throw new Error("Method not implemented.");
    }
    deactivateComponent(id, ctor) {
        throw new Error("Method not implemented.");
    }
    getEntityComponent(id, ctor) {
        throw new Error("Method not implemented.");
    }
}
