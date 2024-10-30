import { Slot } from "../../init/systems.js"
import { IApp, IComponent, IPlugin, WorldPeriods } from "../../init/types.js"
import { TickComponent } from "../../plugins/core/tick.js"
import { KinematicsComponent } from "../../plugins/physics/kinematics.js"
import { RectComponent, Transform2DComponent } from "../../plugins/renderer/2d.js"
import { InputComponent } from "./input-transform.js"

class ClientPlayerComponent implements IComponent {

}

export class ClientPlayerPlugin implements IPlugin{
    build(app: IApp): void {
        app.world.addEntity(
            'persona',
            new TickComponent(),
            new Transform2DComponent(),
            new RectComponent(100, 100),
            new KinematicsComponent(),
        )

        app.addSystem(WorldPeriods.BeforeUpdate, this.trans)
    }
    
    trans( 
        @Slot(InputComponent) { direction }: InputComponent,
        @Slot(KinematicsComponent) { velocity }: KinematicsComponent,
    ) {
        velocity.x = direction.x
        velocity.y = direction.y
        velocity.z = direction.z 
        velocity.multiplySelf(2)
    }
}
