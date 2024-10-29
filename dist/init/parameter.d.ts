import { IWorld, ParameterDescriptor, ParameterType } from "./types.js";
export interface ParameterMatcher {
    (desc: ParameterDescriptor, index: number, world: IWorld, args: any[], entity?: string): boolean;
}
export declare class ParameterImplementor {
    private readonly components;
    private args;
    static readonly map: Map<any, ParameterMatcher>;
    static readonly EMPTY: {};
    static register(type: ParameterType, matcher: ParameterMatcher): void;
    static unregister(type: ParameterType): void;
    constructor(components: ParameterDescriptor[], args?: any[]);
    match(world: IWorld, entity?: string): boolean;
    invoke(func: Function, thisArg?: any): Promise<any>;
}
