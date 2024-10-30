import { Systems, globalSymbol } from "./systems.js";
export class Entity {
    id;
    constructor(id) {
        this.id = id;
    }
}
export class World {
    entities;
    globalComponents;
    systems;
    store;
    storage;
    table;
    commandSequence;
    constructor(entities, globalComponents, systems, store, storage, table, commandSequence) {
        this.entities = entities;
        this.globalComponents = globalComponents;
        this.systems = systems;
        this.store = store;
        this.storage = storage;
        this.table = table;
        this.commandSequence = commandSequence;
    }
    addComponent(id, ctor, ...args) {
        if (typeof ctor === 'function') {
            return this.#addComponent_override2(id, ctor, args);
        }
        return this.#addComponent_override1(id, ctor);
    }
    checkIfGlobal(ctor) {
        return ctor[globalSymbol];
    }
    #addComponent_override1(id, component) {
        const row = this.storage.get(id);
        // 没有Entity
        if (!row) {
            return;
        }
        const prototype = Reflect.getPrototypeOf(component);
        if (!prototype) {
            throw Error('未使用class构造Component');
        }
        const ctor = prototype.constructor;
        //全局组件不储存在表中
        if (this.checkIfGlobal(ctor)) {
            this.globalComponents.set(ctor, component);
            return;
        }
        // Entity已拥有该组件
        if (row.has(ctor)) {
            return;
        }
        row.set(ctor, component);
    }
    #addComponent_override2(id, ctor, args) {
        //全局组件不储存在表中
        if (this.checkIfGlobal(ctor)) {
            const component = Reflect.construct(ctor, args);
            this.globalComponents.set(ctor, component);
            return;
        }
        const row = this.storage.get(id);
        // 没有Entity
        if (!row) {
            return;
        }
        // Entity已拥有该组件
        if (row.has(ctor)) {
            return;
        }
        const component = Reflect.construct(ctor, args);
        row.set(ctor, component);
    }
    removeComponent(id, ctor) {
        const row = this.storage.get(id);
        // 没有Entity
        if (!row) {
            return;
        }
        // Entity没有该组件
        if (!row.has(ctor)) {
            return;
        }
        row.delete(ctor);
    }
    deactivateComponent(id, ctor) {
        const row = this.table.get(id);
        row?.delete(ctor);
    }
    activateComponent(id, ctor) {
        const row = this.table.get(id);
        row?.add(ctor);
    }
    static create() {
        return new World(new Set(), new Map(), Systems.create(), new Map(), new Map(), new Map(), []);
    }
    addEntity(id, ...components) {
        this.entities.add(id);
        const len = components.length;
        const storage = this.storage;
        let table = this.table.get(id);
        let row;
        //获得作为行的WeakMap
        if ((row = storage.get(id)) === undefined) {
            row = new WeakMap();
            storage.set(id, row);
        }
        if (!table) {
            table = new Set([Entity]);
            this.table.set(id, table);
        }
        //设置行的数据（Entity 对应的 Components）
        for (let i = 0; i < len; i++) {
            const component = components[i];
            const componentPrototype = Reflect.getPrototypeOf(component);
            if (!componentPrototype) {
                continue;
            }
            const componentType = componentPrototype.constructor;
            // console.log(componentType.name)
            row.set(componentType, component);
            table.add(componentType);
        }
        return this;
    }
    removeEntity(id) {
        this.entities.delete(id);
        const storage = this.storage;
        const row = storage.get(id);
        const table = this.table.get(id);
        if (!row || !table)
            return this;
        for (const componentCtor of table) {
            row.delete(componentCtor);
        }
        storage.delete(id);
        return this;
    }
    getEntityComponent(id, ctor) {
        //@ts-ignore
        if (ctor === Entity) {
            //@ts-ignore
            return new Entity(id);
        }
        const storage = this.storage;
        const table = this.table.get(id);
        const row = storage.get(id);
        if (row && table?.has(ctor)) {
            return row.get(ctor) ?? null;
        }
        //@ts-ignore
        if (ctor[globalSymbol]) {
            return this.globalComponents.get(ctor) ?? null;
        }
        return null;
    }
}
