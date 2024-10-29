import { Global } from "../../init/systems.js"
import { IApp, IComponent, IPlugin, WorldPeriods } from "../../init/types.js"
import { ConstructorOf } from "../../util/lang_feature.js"

export interface RabixEvent<T> {
    type: string
    data: T
}

const internal: RabixEvent<any>[] = []

@Global
export class EventReader<T=any> {
    constructor(
        private chunk: any[]
    ) {}

    filter<T>(predicate: (value: RabixEvent<T>) => boolean) {
        return new EventReader(
            this.chunk.filter(predicate)
        )
    }

    map<T, R>(callback: (value: RabixEvent<T>) => R): R[] {
        return this.chunk.map(callback)
    }

    forEach(callback: (value: RabixEvent<T>) => void) {
        this.chunk.forEach(callback)
    }

    type<T extends IComponent>(eventType: string): EventReader<T>
    type<T extends IComponent>(eventType: ConstructorOf<T>): EventReader<T>
    type(eventType: any) {
        if (typeof eventType === 'string') return this.filter<T>(({ type }) => type === eventType)
        return this.filter<T>(({ data }) => data instanceof eventType)
    }

    hasAny() {
        return this.chunk.length > 0
    }

    latest<T = any>(): RabixEvent<T> {
        return this.chunk[this.chunk.length - 1]
    }
}

@Global
export class EventWriter {
    write(type: string, data: any) {
        internal.push({ type, data })
    }
}

const events = new EventReader(internal)

export class EventsPlugin implements IPlugin {

    build(app: IApp): void {
        app.addSystem(WorldPeriods.AfterUpdate, this.clearEvents)
            .world.globalComponents
            .set(EventReader, events)
            .set(EventWriter, new EventWriter())
    }

    clearEvents() {
        // 清除上一个循环的事件
        internal.length = 0
    }

}