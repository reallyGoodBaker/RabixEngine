import { IApp, IPlugin } from "../../init/types.js";
export declare class Renderer2DComponent {
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D);
}
export declare class Transform2DComponent {
    matrix: DOMMatrix;
    anchor: [number, number];
    constructor(matrix?: DOMMatrix, anchor?: [number, number]);
}
export declare class RectOutlineComponent {
    w: number;
    h: number;
    color: string;
    width: number;
    alpha: number;
    constructor(w?: number, h?: number, color?: string, width?: number, alpha?: number);
}
export declare class RectComponent {
    w: number;
    h: number;
    color: string;
    constructor(w?: number, h?: number, color?: string);
}
export declare class Image2DComponent {
    source: CanvasImageSource;
    w: number;
    h: number;
    sx: number;
    sy: number;
    color: string;
    constructor(source: CanvasImageSource, w: number, h: number, sx?: number, sy?: number, color?: string);
}
export declare class Renderer2DPlugin implements IPlugin {
    build(app: IApp): void;
    applyTransfrom({ ctx }: Renderer2DComponent, { matrix }: Transform2DComponent): void;
    restoreTransfrom({ ctx }: Renderer2DComponent, _: Transform2DComponent): void;
    renderRect({ ctx }: Renderer2DComponent, { w, h, color }: RectComponent, t?: Transform2DComponent): void;
    renderRectOutline({ ctx }: Renderer2DComponent, { w, h, color, width, alpha }: RectOutlineComponent, t?: Transform2DComponent): void;
    renderImage({ ctx }: Renderer2DComponent, image: Image2DComponent, t?: Transform2DComponent): void;
}
