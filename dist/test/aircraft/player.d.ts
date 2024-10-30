import { IApp, IPlugin } from "../../init/types.js";
import { KinematicsComponent } from "../../plugins/physics/kinematics.js";
import { InputComponent } from "./input-transform.js";
export declare class ClientPlayerPlugin implements IPlugin {
    build(app: IApp): void;
    trans({ direction }: InputComponent, { velocity }: KinematicsComponent): void;
}
