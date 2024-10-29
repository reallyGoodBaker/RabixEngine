import { IApp, IPlugin } from "../../init/types.js"

export class RendererWebgpuPlugin implements IPlugin {

    ready() {
        ///@ts-ignore
        return !!navigator.gpu
    }

    build(app: IApp): void {
        throw new Error("Method not implemented.");
    }

    destroy?: ((app: IApp) => void) | undefined;
    
}