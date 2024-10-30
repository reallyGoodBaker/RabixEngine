import { ConstructorOf } from "../util/lang_feature.js"
import { Systems, globalSymbol } from "./systems.js"
import { IRow, IStorage, ITable } from "./table.js"
import { ClassPrototype, Cmd, IComponent, IEntity, ISystems, IWorld } from "./types.js"

export class Entity implements IComponent {
    constructor(
        public id: string
    ) {}
}

export class World implements IWorld {
    
    constructor(
        public entities: Set<IEntity>,
        public globalComponents: Map<ConstructorOf<IComponent>, IComponent>,
        public systems: ISystems,
        public store: Map<unknown, unknown>,
        public storage: IStorage,
        public table: ITable,
        public commandSequence: Cmd[],
    ) {}

    addComponent<T>(id: IEntity, component: T): void
    addComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>, ...args: ConstructorParameters<ConstructorOf<T>>): void
    addComponent(
        id: IEntity,
        ctor: any,
        ...args: any[]
    ): void {
        if (typeof ctor === 'function') {
            return this.#addComponent_override2(id, ctor, args)
        }

        return this.#addComponent_override1(id, ctor)
    }

    checkIfGlobal(ctor: ConstructorOf<IComponent>): boolean {
        return (ctor as any)[globalSymbol]
    }

    #addComponent_override1<T extends IComponent>(id: IEntity, component: T) {
        const row = this.storage.get(id)

        // 没有Entity
        if (!row) {
            return
        }

        const prototype = <ClassPrototype> Reflect.getPrototypeOf(component!)
        if (!prototype) {
            throw Error('未使用class构造Component')
        }

        const ctor = prototype.constructor as ConstructorOf<IComponent>

        //全局组件不储存在表中
        if (this.checkIfGlobal(ctor)) {
            this.globalComponents.set(ctor, component)
            return
        }

        // Entity已拥有该组件
        if (row.has(ctor)) {
            return
        }

        row.set(ctor, component)
    }

    #addComponent_override2<T extends IComponent>(
        id: IEntity, 
        ctor: ConstructorOf<T>, 
        args: ConstructorParameters<ConstructorOf<T>>[]
    ): void {
        //全局组件不储存在表中
        if (this.checkIfGlobal(ctor)) {
            const component = Reflect.construct(ctor, args)
            this.globalComponents.set(ctor, component!)
            return
        }

        const row = this.storage.get(id)

        // 没有Entity
        if (!row) {
            return
        }

        // Entity已拥有该组件
        if (row.has(ctor)) {
            return
        }

        const component = Reflect.construct(ctor, args)
        row.set(ctor, component!)
    }

    removeComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void {
        const row = this.storage.get(id)

        // 没有Entity
        if (!row) {
            return
        }

        // Entity没有该组件
        if (!row.has(ctor)) {
            return
        }

        row.delete(ctor)
    }

    deactivateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void {
        const row = this.table.get(id)

        row?.delete(ctor)
    }

    activateComponent(id: IEntity, ctor: ConstructorOf<IComponent>): void {
        const row = this.table.get(id)

        row?.add(ctor)
    }

    static create() {
        return new World(
            new Set(),
            new Map(),
            Systems.create(),
            new Map(),
            new Map(),
            new Map(),
            [],
        )
    }

    addEntity(id: IEntity, ...components: IComponent[]) {
        this.entities.add(id)

        const len = components.length
        const storage = this.storage
        let table = this.table.get(id)
        let row: IRow | undefined

        //获得作为行的WeakMap
        if ((row = storage.get(id)) === undefined) {
            row = new WeakMap()
            storage.set(id, row)
        }

        if (!table) {
            table = new Set([ Entity ])
            this.table.set(id, table)
        }

        //设置行的数据（Entity 对应的 Components）
        for (let i = 0; i < len; i++) {
            const component = components[i]
            const componentPrototype = Reflect.getPrototypeOf(component)

            if (!componentPrototype) {
                continue
            }

            const componentType = <ConstructorOf<IComponent>> componentPrototype.constructor
            // console.log(componentType.name)

            row.set(componentType, component)
            table.add(componentType)
        }

        return this
    }

    removeEntity(id: IEntity) {
        this.entities.delete(id)

        const storage = this.storage
        const row = storage.get(id)
        const table = this.table.get(id)

        if (!row || !table) return this

        for (const componentCtor of table) {
            row.delete(componentCtor)
        }

        storage.delete(id)

        return this
    }

    getEntityComponent<T extends IComponent>(id: IEntity, ctor: ConstructorOf<T>): T | null {
        //@ts-ignore
        if (ctor === Entity) {
            //@ts-ignore
            return new Entity(id)
        }

        const storage = this.storage
        const table = this.table.get(id)
        const row = storage.get(id)

        if (row && table?.has(ctor)) {
            return <T> row.get(ctor) ?? null
        }

        //@ts-ignore
        if (ctor[globalSymbol]) {
            return <T> this.globalComponents.get(ctor) ?? null
        }

        return null
    }
}