import { Global, Slot } from "../../init/systems.js"
import { IApp, IPlugin, WorldPeriods } from "../../init/types.js"

export class TickComponent {
    constructor(
        public delta: number = 0,
        public timestamp: number = 0,
    ) {}
}

export class TickPlugin implements IPlugin {

    build(app: IApp): void {
        app.addSystem(WorldPeriods.BeforeEvent, this.updateTick)
    }

    updateTick(
        @Slot(TickComponent) tick: TickComponent
    ) {
        const now = performance.now()
        tick.delta = now - tick.timestamp
        tick.timestamp = now
    }

}