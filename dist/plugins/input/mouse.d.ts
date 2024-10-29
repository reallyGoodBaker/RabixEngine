import { IApp, IPlugin } from "../../init/types.js";
import { EventWriter } from "../core/events.js";
export declare class MouseComponent {
    x: number;
    y: number;
    buttons: number;
    oldX: number;
    oldY: number;
    constructor(x: number, y: number, buttons: number, oldX?: number, oldY?: number);
}
export declare class MouseButtonEvent {
    button: MouseButtonMapping;
    buttonLabel: string;
    status: boolean;
    constructor(button: MouseButtonMapping, buttonLabel: string, status: boolean);
}
export declare class MouseMoveEventComponent {
    dx: number;
    dy: number;
    constructor(dx?: number, dy?: number);
}
declare enum MouseButtonMapping {
    MouseLeft = 0,
    MouseRight = 1,
    MouseMiddle = 2,
    Mouse4 = 3,
    Mouse5 = 4
}
export declare class MousePlugin implements IPlugin {
    build(app: IApp): void;
    updateMouseEvent(writer: EventWriter): void;
    updateMousePosition(move: MouseMoveEventComponent): void;
}
export {};
