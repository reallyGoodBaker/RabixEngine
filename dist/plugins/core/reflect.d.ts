import { IApp, IPlugin, IWorld } from "../../init/types.js";
export declare class ReflectComponent {
    app: IApp;
    world: IWorld;
    constructor(app: IApp, world: IWorld);
}
export declare class ReflectPlugin implements IPlugin {
    ready?: ((app: IApp) => boolean) | undefined;
    destroy?: ((app: IApp) => void) | undefined;
    build(app: IApp): void;
}
