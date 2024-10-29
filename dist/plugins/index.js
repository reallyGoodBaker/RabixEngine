import { EventsPlugin } from "./core/events.js";
import { ReflectPlugin } from "./core/reflect.js";
import { TickPlugin } from "./core/tick.js";
import { WindowPlugin } from "./core/window.js";
import { keyboardPlugin } from "./input/keyboard.js";
import { MousePlugin } from "./input/mouse.js";
import { KinematicsPlugin } from "./physics/kinematics.js";
import { RigibodyPlugin } from "./physics/rigibody.js";
function c(constructor) {
    return Reflect.construct(constructor, []);
}
export const defaultPlugins = [
    c(TickPlugin),
    c(ReflectPlugin),
    c(EventsPlugin),
    c(WindowPlugin),
    c(keyboardPlugin),
    c(MousePlugin),
];
export const physicsPlugins = [
    c(KinematicsPlugin),
    c(RigibodyPlugin),
];
