import { IApp, IPlugin } from "../../init/types.js";
export declare class TickComponent {
    delta: number;
    timestamp: number;
    constructor(delta?: number, timestamp?: number);
}
export declare class TickPlugin implements IPlugin {
    build(app: IApp): void;
    updateTick(tick: TickComponent): void;
}
