import { IApp, IComponent, IPlugin } from "../../init/types.js";
import { ConstructorOf } from "../../util/lang_feature.js";
export interface RabixEvent<T> {
    type: string;
    data: T;
}
export declare class EventReader<T = any> {
    private chunk;
    constructor(chunk: any[]);
    filter<T>(predicate: (value: RabixEvent<T>) => boolean): EventReader<any>;
    map<T, R>(callback: (value: RabixEvent<T>) => R): R[];
    forEach(callback: (value: RabixEvent<T>) => void): void;
    type<T extends IComponent>(eventType: string): EventReader<T>;
    type<T extends IComponent>(eventType: ConstructorOf<T>): EventReader<T>;
    hasAny(): boolean;
    latest<T = any>(): RabixEvent<T>;
}
export declare class EventWriter {
    write(type: string, data: any): void;
}
export declare class EventsPlugin implements IPlugin {
    build(app: IApp): void;
    clearEvents(): void;
}
