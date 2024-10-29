/**
 * Get the constructor type of the target type
 */
export type ConstructorOf<T> = new (...args: any[]) => T;
/**
 * Extend class
 * @param ctor constructor
 * @param mixin methods
 */
export declare function impl(ctor: Function, mixin: {
    [key: string]: Function;
}): void;
