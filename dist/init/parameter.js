import { ParameterType, QueryFilterType } from "./types.js";
export class ParameterImplementor {
    components;
    args;
    static map = new Map();
    static EMPTY = {};
    static register(type, matcher) {
        ParameterImplementor.map.set(type, matcher);
    }
    static unregister(type) {
        ParameterImplementor.map.delete(type);
    }
    constructor(components, args = new Array(components.length).fill(ParameterImplementor.EMPTY)) {
        this.components = components;
        this.args = args;
    }
    match(world, entity) {
        const map = ParameterImplementor.map;
        const len = this.components.length;
        for (let i = 0; i < len; i++) {
            const desc = this.components[i];
            const matcher = map.get(desc.type);
            if (!matcher || !matcher(desc, i, world, this.args, entity)) {
                return false;
            }
        }
        return true;
    }
    async invoke(func, thisArg) {
        if (this.args.includes(ParameterImplementor.EMPTY)) {
            return;
        }
        return await func.apply(thisArg, this.args);
    }
}
class QueryResultConcrete {
    comps;
    constructor(comps) {
        this.comps = comps;
    }
    get(ctor) {
        return this.comps.find(comp => Object.getPrototypeOf(comp).constructor === ctor);
    }
    iter() {
        return this.comps;
    }
}
ParameterImplementor.register(ParameterType.Component, (desc, index, world, args, entity) => {
    const globalComponent = world.globalComponents.get(desc.data);
    if (globalComponent) {
        args[index] = globalComponent;
        return true;
    }
    if (!entity)
        return false;
    const comp = world.getEntityComponent(entity, desc.data);
    if (!comp) {
        return false;
    }
    args[index] = comp;
    return true;
});
ParameterImplementor.register(ParameterType.Option, (desc, index, world, args, entity) => {
    const globalComponent = world.globalComponents.get(desc.data);
    if (globalComponent) {
        args[index] = globalComponent;
        return true;
    }
    if (!entity)
        return false;
    const comp = world.getEntityComponent(entity, desc.data);
    args[index] = comp;
    return true;
});
ParameterImplementor.register(ParameterType.Query, (desc, index, world, args, entity) => {
    const [ctors, options] = desc.data;
    let withs = [];
    let withouts = [];
    options?.forEach(({ type, data }) => {
        if (type === QueryFilterType.With) {
            withs.push(data);
        }
        if (type === QueryFilterType.Without) {
            withouts.push(data);
        }
    });
    let comps = [];
    if (!entity) {
        for (const ctor of ctors) {
            const comp = world.globalComponents.get(ctor);
            if (!comp) {
                return false;
            }
            comps.push(comp);
        }
        for (const ctor of withs) {
            if (!world.globalComponents.get(ctor)) {
                return false;
            }
        }
        for (const ctor of withouts) {
            if (world.globalComponents.get(ctor)) {
                return false;
            }
        }
        args[index] = new QueryResultConcrete(comps);
        return true;
    }
    for (const ctor of ctors) {
        const comp = world.getEntityComponent(entity, ctor);
        if (!comp) {
            return false;
        }
        comps.push(comp);
    }
    for (const ctor of withs) {
        if (!world.getEntityComponent(entity, ctor)) {
            return false;
        }
    }
    for (const ctor of withouts) {
        if (world.getEntityComponent(entity, ctor)) {
            return false;
        }
    }
    args[index] = new QueryResultConcrete(comps);
    return true;
});
