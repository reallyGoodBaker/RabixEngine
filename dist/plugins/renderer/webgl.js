export class RendererWebgpuPlugin {
    ready() {
        ///@ts-ignore
        return !!navigator.gpu;
    }
    build(app) {
        throw new Error("Method not implemented.");
    }
    destroy;
}
