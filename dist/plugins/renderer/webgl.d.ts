import { IApp, IPlugin } from "../../init/types.js";
export declare class RendererWebgpuPlugin implements IPlugin {
    ready(): boolean;
    build(app: IApp): void;
    destroy?: ((app: IApp) => void) | undefined;
}
