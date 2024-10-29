import { Slot } from "../../init/systems.js"
import { IApp, IPlugin, WorldPeriods } from "../../init/types.js"
import { Vector } from "../../math/2d.js"
import { TickComponent } from "../core/tick.js"

export class KinematicsComponent {
    constructor(
        public velocity = Vector.zero(),
        public acceleration = Vector.zero(),
    ) {}
}

export class KinematicsPlugin implements IPlugin {

    build(app: IApp): void {
        app.addSystem(WorldPeriods.BeforeUpdate, this.updateKinematics)
    }

    updateKinematics(
        @Slot(TickComponent) tick: TickComponent,
        @Slot(KinematicsComponent) kinematics: KinematicsComponent,
    ) {
        const dt = tick.delta
        kinematics.velocity.addSelf(kinematics.acceleration.multiply(dt))
    }

}