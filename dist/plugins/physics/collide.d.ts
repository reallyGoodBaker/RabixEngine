import { Hitbox2D } from "./rigibody.js";
import { Transform2DComponent } from "../renderer/2d.js";
export declare enum CollisionResult {
    None = 0,
    Top = 1,
    Left = 2,
    Right = 4,
    Bottom = 8,
    Inside = 16
}
export declare function testAabb(target: Hitbox2D, origin: Hitbox2D): boolean;
export declare function collideAabb(target: Hitbox2D, origin: Hitbox2D): number;
export declare function transfromHitbox2d(hitbox: Hitbox2D, transform: Transform2DComponent): {
    pos: import("../../math/2d.js").Vector;
    size: import("../../math/2d.js").Vector;
};
