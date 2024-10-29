/**
 * Extend class
 * @param ctor constructor
 * @param mixin methods
 */
export function impl(ctor, mixin) {
    const prototype = Reflect.getPrototypeOf(ctor);
    if (!prototype)
        return;
    for (const [name, method] of Object.entries(mixin)) {
        prototype[name] = method;
    }
}
