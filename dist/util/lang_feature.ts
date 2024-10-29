/**
 * Get the constructor type of the target type
 */
export type ConstructorOf<T> = new (...args: any[]) => T

/**
 * Extend class
 * @param ctor constructor
 * @param mixin methods
 */
export function impl(ctor: Function, mixin: { [key: string]: Function}) {
    const prototype = Reflect.getPrototypeOf(ctor)

    if (!prototype) return

    for (const [ name, method ] of Object.entries(mixin)) {
        (<any> prototype)[name] = method
    }
}

