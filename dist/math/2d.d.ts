interface DOMMatrixSelf2DMethods {
    invertSelf(): DOMMatrix;
    rotateAxisAngleSelf(x?: number, y?: number, z?: number, angle?: number): DOMMatrix;
    rotateFromVectorSelf(x?: number, y?: number): DOMMatrix;
    rotateSelf(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix;
    scaleSelf(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix;
    skewXSelf(sx?: number): DOMMatrix;
    skewYSelf(sy?: number): DOMMatrix;
    translateSelf(tx?: number, ty?: number, tz?: number): DOMMatrix;
    flipX(): DOMMatrix;
    flipY(): DOMMatrix;
    inverse(): DOMMatrix;
    rotate(rotX?: number, rotY?: number, rotZ?: number): DOMMatrix;
    rotateAxisAngle(x?: number, y?: number, z?: number, angle?: number): DOMMatrix;
    rotateFromVector(x?: number, y?: number): DOMMatrix;
    scale(scaleX?: number, scaleY?: number, scaleZ?: number, originX?: number, originY?: number, originZ?: number): DOMMatrix;
    skewX(sx?: number): DOMMatrix;
    skewY(sy?: number): DOMMatrix;
    translate(tx?: number, ty?: number, tz?: number): DOMMatrix;
}
export declare function transfrom2d<T extends keyof DOMMatrixSelf2DMethods>(matrix: DOMMatrix, anchor: [number, number], method: T, ...args: Parameters<DOMMatrixSelf2DMethods[T]>): DOMMatrix;
export declare class Vector extends Float64Array {
    constructor(x: number, y: number, z: number);
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get z(): number;
    set z(v: number);
    modulo(): number;
    addSelf(vec: Vector): this;
    add(vec: Vector): Vector;
    multiplySelf(scalar: number): this;
    multiply(scalar: number): Vector;
    dot(vec: Vector): number;
    cross(vec: Vector): Vector;
    transform2d(m: DOMMatrix): Vector;
    transform2dSelf(m: DOMMatrix): this;
    copy(): Vector;
    static angle(vec1: Vector, vec2: Vector): number;
    static zero(): Vector;
    static unit(): Vector;
}
export {};
