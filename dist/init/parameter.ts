import { ConstructorOf } from "../util/lang_feature.js"
import { IComponent, QueryResult, IWorld, ParameterDescriptor, ParameterType, QueryFilterType } from "./types.js"

export interface ParameterMatcher {
    // 匹配参数
    (desc: ParameterDescriptor, index: number, world: IWorld, args: any[], entity?: string): boolean
}

export class ParameterImplementor {
    static readonly map: Map<any, ParameterMatcher> = new Map<any, ParameterMatcher>()
    static readonly EMPTY = {}

    static register(type: ParameterType, matcher: ParameterMatcher) {
        ParameterImplementor.map.set(type, matcher)
    }

    static unregister(type: ParameterType) {
        ParameterImplementor.map.delete(type)
    }

    constructor(
        private readonly components: ParameterDescriptor[],
        private args: any[] = new Array(components.length).fill(ParameterImplementor.EMPTY),
    ) {}

    match(world: IWorld, entity?: string) {
        const map = ParameterImplementor.map
        const len = this.components.length

        for (let i = 0; i < len; i++) {
            const desc = this.components[i]
            const matcher = map.get(desc.type)
            if (!matcher || !matcher(desc, i, world, this.args, entity)) {
                return false
            }
        }

        return true
    }

    async invoke(func: Function, thisArg?: any) {
        if (this.args.includes(ParameterImplementor.EMPTY)) {
            return
        }

        return await func.apply(thisArg, this.args)
    }

}

class QueryResultConcrete<T> implements QueryResult<T> {
    constructor(
        public comps: T[],
    ) {}

    get<T extends IComponent>(ctor: ConstructorOf<T>): T | undefined {
        return this.comps.find(comp => Object.getPrototypeOf(comp).constructor === ctor) as T | undefined
    }

    iter(): T {
        return this.comps as T
    }
    
}

ParameterImplementor.register(ParameterType.Component, (desc, index, world, args, entity) => {
    const globalComponent = world.globalComponents.get((desc as ParameterDescriptor<ParameterType.Component>).data)
    if (globalComponent) {
        args[index] = globalComponent
        return true
    }

    if (!entity)
        return false

    const comp = world.getEntityComponent(entity, (desc as ParameterDescriptor<ParameterType.Component>).data)
    if (!comp) {
        return false
    }

    args[index] = comp
    return true
})

ParameterImplementor.register(ParameterType.Option, (desc, index, world, args, entity) => {
    const globalComponent = world.globalComponents.get((desc as ParameterDescriptor<ParameterType.Component>).data)
    if (globalComponent) {
        args[index] = globalComponent
        return true
    }

    if (!entity)
        return false

    const comp = world.getEntityComponent(entity, (desc as ParameterDescriptor<ParameterType.Option>).data)
    args[index] = comp
    return true
})

ParameterImplementor.register(ParameterType.Query, (desc, index, world, args, entity) => {
    const [ ctors, options ] = (desc as ParameterDescriptor<ParameterType.Query>).data
    let withs: ConstructorOf<IComponent>[] = []
    let withouts: ConstructorOf<IComponent>[] = []
    options?.forEach(({ type, data }) => {
        if (type === QueryFilterType.With) {
            withs.push(data)
        }

        if (type === QueryFilterType.Without) {
            withouts.push(data)
        }
    })

    let comps = []
    if (!entity) {
        for (const ctor of ctors) {
            const comp = world.globalComponents.get(ctor)
            if (!comp) {
                return false
            }

            comps.push(comp)
        }

        for (const ctor of withs) {
            if (!world.globalComponents.get(ctor)) {
                return false
            }
        }

        for (const ctor of withouts) {
            if (world.globalComponents.get(ctor)) {
                return false
            }
        }

        args[index] = new QueryResultConcrete(comps)
        return true
    }

    for (const ctor of ctors) {
        const comp = world.getEntityComponent(entity, ctor)
        if (!comp) {
            return false
        }

        comps.push(comp)
    }

    for (const ctor of withs) {
        if (!world.getEntityComponent(entity, ctor)) {
            return false
        }
    }

    for (const ctor of withouts) {
        if (world.getEntityComponent(entity, ctor)) {
            return false
        }
    }

    args[index] = new QueryResultConcrete(comps)
    return true
})