import { Slot } from "../../init/systems.js"
import { IApp, IComponent, IPlugin, WorldPeriods } from "../../init/types.js"
import { Vector } from "../../math/2d.js"
import { Vec3 } from "../../math/3d/vec/vec3.js"
import { KeyboardComponent } from "../../plugins/input/keyboard.js"

export class InputComponent implements IComponent {
    direction: Vector = Vector.zero()
}

const up = new Vector(0, 1, 0)
const down = new Vector(0, -1, 0)
const left = new Vector(-1, 0, 0)
const right = new Vector(1, 0, 0)


export class InputTransformPlugin implements IPlugin {

    build(app: IApp): void {
        app.world.globalComponents
            .set(InputComponent, new InputComponent())
        app.addSystem(WorldPeriods.Event, this.inputTransform)
            .addSystem(WorldPeriods.AfterUpdate, this.resetInput)
    }

    inputTransform(
        @Slot(KeyboardComponent) keyboard: KeyboardComponent,
        @Slot(InputComponent) { direction }: InputComponent,
    ) {
        if(keyboard.keyPressed.has('KeyW')) {
            direction.addSelf(up)
        }
        
        if(keyboard.keyPressed.has('KeyA')) {
            direction.addSelf(left)
        }
        
        if(keyboard.keyPressed.has('KeyS')) {
            direction.addSelf(down)
        }
        
        if(keyboard.keyPressed.has('KeyD')) {
            direction.addSelf(right)
        }

        Vec3.normalize(direction)
    }
    
    resetInput(
        @Slot(InputComponent) { direction }: InputComponent
    ) {
        direction.x = direction.y = direction.z = 0
    }
}

