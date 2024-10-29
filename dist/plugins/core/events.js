var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EventReader_1;
import { Global } from "../../init/systems.js";
import { WorldPeriods } from "../../init/types.js";
const internal = [];
let EventReader = EventReader_1 = class EventReader {
    chunk;
    constructor(chunk) {
        this.chunk = chunk;
    }
    filter(predicate) {
        return new EventReader_1(this.chunk.filter(predicate));
    }
    map(callback) {
        return this.chunk.map(callback);
    }
    forEach(callback) {
        this.chunk.forEach(callback);
    }
    type(eventType) {
        if (typeof eventType === 'string')
            return this.filter(({ type }) => type === eventType);
        return this.filter(({ data }) => data instanceof eventType);
    }
    hasAny() {
        return this.chunk.length > 0;
    }
    latest() {
        return this.chunk[this.chunk.length - 1];
    }
};
EventReader = EventReader_1 = __decorate([
    Global
], EventReader);
export { EventReader };
let EventWriter = class EventWriter {
    write(type, data) {
        internal.push({ type, data });
    }
};
EventWriter = __decorate([
    Global
], EventWriter);
export { EventWriter };
const events = new EventReader(internal);
export class EventsPlugin {
    build(app) {
        app.addSystem(WorldPeriods.AfterUpdate, this.clearEvents)
            .world.globalComponents
            .set(EventReader, events)
            .set(EventWriter, new EventWriter());
    }
    clearEvents() {
        // 清除上一个循环的事件
        internal.length = 0;
    }
}
