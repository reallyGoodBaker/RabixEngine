import { IApp, IPlugin } from "../../init/types.js";
export declare class FrameComponent {
    frames: number;
    element: HTMLElement;
    timer?: number | undefined;
    constructor(frames: number, element: HTMLElement, timer?: number | undefined);
}
export declare class FramePlugin implements IPlugin {
    build(app: IApp): void;
    update(frame: FrameComponent): void;
}
