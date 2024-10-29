import { ConstructorOf } from '../util/lang_feature.js';
import { IComponent, IQueryFilter, ISystem, ISystemRecord, ISystemRecords, ISystems, WorldPeriods } from './types.js';
export declare class Systems implements ISystems {
    #private;
    systemRecords: Map<WorldPeriods, ISystemRecords>;
    static systemMap: Map<ISystem, ISystemRecord>;
    static create(): Systems;
    constructor(systemRecords: Map<WorldPeriods, ISystemRecords>);
    recordSystems(period: WorldPeriods, records: Iterable<ISystemRecord>): this;
    addSystem(system: ISystem): this;
    addSystem(period: WorldPeriods, system: ISystem): this;
    addSystem(period: WorldPeriods, systems: ISystem[]): this;
    entries(period: WorldPeriods): IterableIterator<ISystemRecord>;
}
type DecoratorCallback = (getRecord: (system: ISystem) => ISystemRecord) => Function;
export declare function createDecorator(cb: DecoratorCallback): Function;
export declare const Slot: (component: ConstructorOf<IComponent>) => Function;
export declare const Remote: MethodDecorator;
export declare const singletonSymbol: unique symbol;
export declare const globalSymbol: unique symbol;
export declare const Singleton: (target: any) => void;
export declare const Global: (target: any) => void;
export declare const Query: (queries: ConstructorOf<IComponent>[], filters?: IQueryFilter[]) => Function;
export declare const Optional: (component: ConstructorOf<IComponent>) => ParameterDecorator;
export declare const With: (ctor: ConstructorOf<IComponent>) => IQueryFilter;
export declare const Without: (ctor: ConstructorOf<IComponent>) => IQueryFilter;
export {};
