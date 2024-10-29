import { IApp, IPlugin } from "../../init/types.js";
import { EventWriter } from "../core/events.js";
export declare class KeyboardComponent {
    keyPressed: Set<string>;
    constructor(keyPressed?: Set<string>);
}
export declare class KeyboardEventComponent {
    press: string;
    release: string;
    constructor(press?: string, release?: string);
}
export declare class keyboardPlugin implements IPlugin {
    build(app: IApp): void;
    updateKeyEvent(writer: EventWriter): void;
}
