import { IComponent, IEntity } from "./types.js";
import { ConstructorOf } from "../util/lang_feature.js";
export interface IRow extends WeakMap<ConstructorOf<IComponent>, IComponent> {
}
export interface IStorage extends Map<IEntity, IRow> {
}
export interface ITable extends Map<IEntity, Set<ConstructorOf<IComponent>>> {
}
