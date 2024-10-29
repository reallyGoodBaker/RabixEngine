import { IApp, IPlugin } from "../../init/types.js";
export declare class WindowComponent {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    aspectRatio: number;
    backgroundColor: string;
    constructor(canvas?: HTMLCanvasElement, width?: number, height?: number, aspectRatio?: number, backgroundColor?: string);
}
export declare class WindowPlugin implements IPlugin {
    ready(): boolean;
    build(app: IApp): void;
    initWindow({ canvas, width: maxWidth, height: maxHeight, aspectRatio, backgroundColor }: WindowComponent): void;
}
