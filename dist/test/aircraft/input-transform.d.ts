import { IApp, IComponent, IPlugin } from "../../init/types.js";
import { Vector } from "../../math/2d.js";
import { KeyboardComponent } from "../../plugins/input/keyboard.js";
export declare class InputComponent implements IComponent {
    direction: Vector;
}
export declare class InputTransformPlugin implements IPlugin {
    build(app: IApp): void;
    inputTransform(keyboard: KeyboardComponent, { direction }: InputComponent): void;
    resetInput({ direction }: InputComponent): void;
}
