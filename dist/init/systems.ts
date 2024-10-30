import { ConstructorOf } from '../util/lang_feature.js'
import { IComponent, IQuery, IQueryFilter, ISystem, ISystemRecord, ISystemRecords, ISystems, ParameterType, QueryFilterType, RunnerLabel, WorldPeriods } from './types.js'

export class Systems implements ISystems {

    static systemMap = new Map<ISystem, ISystemRecord>

    static create() {
        return new Systems(new Map<WorldPeriods, ISystemRecords>())
    }

    constructor(
        public systemRecords: Map<WorldPeriods, ISystemRecords>
    ) {}

    recordSystems(period: WorldPeriods, records: Iterable<ISystemRecord>) {
        for (const record of records) {
            let records: Set<ISystemRecord> | undefined
            if ((records = this.systemRecords.get(period)) === undefined) {
                records = new Set<ISystemRecord>()
                this.systemRecords.set(period, records)
            }

            records.add(record)
        }

        return this
    }

    addSystem(system: ISystem): this
    addSystem(period: WorldPeriods, ...system: ISystem[]): this
    addSystem(period: WorldPeriods, systems: ISystem[]): this
    addSystem(period: unknown, system?: unknown): this {
        if (typeof period === 'function') {
            this.#addSystem_override3(period as ISystem)
            return this
        }

        if (!Array.isArray(system)) {
            this.#addSystem_override2(period as WorldPeriods, system as ISystem)
            return this
        }

        this.#addSystem_override1(period as WorldPeriods, system as ISystem[])
        return this
    }

    #addSystem_override1(period: WorldPeriods, systems: ISystem[]) {
        const records = systems.map(sys => {
            return Systems.systemMap.get(sys)
                ?? systemRecord(sys)
        }).filter(v => v) as ISystemRecord[]

        this.recordSystems(period, records)
    }

    #addSystem_override2(period: WorldPeriods, ...system: ISystem[]) {
        this.#addSystem_override1(period, system)
    }

    #addSystem_override3(system: ISystem) {
        this.#addSystem_override2(WorldPeriods.Update, system)
    }

    entries(period: WorldPeriods): IterableIterator<ISystemRecord> {
        const records = this.systemRecords.get(period)
        return records ? records.values() : new Set<ISystemRecord>().values()
    }

}

function systemRecord(system: ISystem): ISystemRecord {
    return { system, components: [], runner: RunnerLabel.Local }
}

type DecoratorCallback = (
    getRecord: (system: ISystem) => ISystemRecord
) => Function

export function getRecord(system: ISystem) {
    let record: ISystemRecord | undefined
    if ((record = Systems.systemMap.get(system)) === undefined) {
        record = systemRecord(system)
        Systems.systemMap.set(system, record)
    }

    return record
}

export function createDecorator(cb: DecoratorCallback) {
    return cb(getRecord)
}

export const Slot = (
    component: ConstructorOf<IComponent>
) => createDecorator(g => {
    return (t: any, m: string, i: number) => {
        const record = g(t[m])

        record.components[i] = {
            type: ParameterType.Component,
            data: component
        }
    }
})

export const Remote = createDecorator(g => {
    return (target: any, method: string) => {
        const record = g(target[method])
        record.runner = RunnerLabel.Remote
    }
}) as MethodDecorator

export const globalSymbol = Symbol('global')
export const Global = (target: any) => {
    target[globalSymbol] = true
}

export const Query = (
    queries: ConstructorOf<IComponent>[], filters?: IQueryFilter[]
) => createDecorator(g => (target: any, method: string, i: number) => {
    const record = g(target[method])

    record.components[i] = {
        type: ParameterType.Query,
        data: [
            queries,
            filters,
        ] as IQuery
    }
})

export const Optional = (
    component: ConstructorOf<IComponent>
) => createDecorator(g => {
    return (t: any, m: string, i: number) => {
        const record = g(t[m])

        record.components[i] = {
            type: ParameterType.Option,
            data: component
        }
    }
}) as ParameterDecorator

export const With = (ctor: ConstructorOf<IComponent>): IQueryFilter => ({
    type: QueryFilterType.With,
    data: ctor
})

export const Without = (ctor: ConstructorOf<IComponent>): IQueryFilter => ({
    type: QueryFilterType.Without,
    data: ctor
})