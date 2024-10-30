import { ParameterType, QueryFilterType, RunnerLabel, WorldPeriods } from './types.js';
export class Systems {
    systemRecords;
    static systemMap = new Map;
    static create() {
        return new Systems(new Map());
    }
    constructor(systemRecords) {
        this.systemRecords = systemRecords;
    }
    recordSystems(period, records) {
        for (const record of records) {
            let records;
            if ((records = this.systemRecords.get(period)) === undefined) {
                records = new Set();
                this.systemRecords.set(period, records);
            }
            records.add(record);
        }
        return this;
    }
    addSystem(period, system) {
        if (typeof period === 'function') {
            this.#addSystem_override3(period);
            return this;
        }
        if (!Array.isArray(system)) {
            this.#addSystem_override2(period, system);
            return this;
        }
        this.#addSystem_override1(period, system);
        return this;
    }
    #addSystem_override1(period, systems) {
        const records = systems.map(sys => {
            return Systems.systemMap.get(sys)
                ?? systemRecord(sys);
        }).filter(v => v);
        this.recordSystems(period, records);
    }
    #addSystem_override2(period, ...system) {
        this.#addSystem_override1(period, system);
    }
    #addSystem_override3(system) {
        this.#addSystem_override2(WorldPeriods.Update, system);
    }
    entries(period) {
        const records = this.systemRecords.get(period);
        return records ? records.values() : new Set().values();
    }
}
function systemRecord(system) {
    return { system, components: [], runner: RunnerLabel.Local };
}
export function getRecord(system) {
    let record;
    if ((record = Systems.systemMap.get(system)) === undefined) {
        record = systemRecord(system);
        Systems.systemMap.set(system, record);
    }
    return record;
}
export function createDecorator(cb) {
    return cb(getRecord);
}
export const Slot = (component) => createDecorator(g => {
    return (t, m, i) => {
        const record = g(t[m]);
        record.components[i] = {
            type: ParameterType.Component,
            data: component
        };
    };
});
export const Remote = createDecorator(g => {
    return (target, method) => {
        const record = g(target[method]);
        record.runner = RunnerLabel.Remote;
    };
});
export const globalSymbol = Symbol('global');
export const Global = (target) => {
    target[globalSymbol] = true;
};
export const Query = (queries, filters) => createDecorator(g => (target, method, i) => {
    const record = g(target[method]);
    record.components[i] = {
        type: ParameterType.Query,
        data: [
            queries,
            filters,
        ]
    };
});
export const Optional = (component) => createDecorator(g => {
    return (t, m, i) => {
        const record = g(t[m]);
        record.components[i] = {
            type: ParameterType.Option,
            data: component
        };
    };
});
export const With = (ctor) => ({
    type: QueryFilterType.With,
    data: ctor
});
export const Without = (ctor) => ({
    type: QueryFilterType.Without,
    data: ctor
});
