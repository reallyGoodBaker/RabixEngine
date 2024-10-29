import { Global, Slot } from "../../init/systems.js"
import { IApp, IPlugin, WorldPeriods } from "../../init/types.js"
import { EventWriter } from "../core/events.js"

@Global
export class MouseComponent {
    constructor(
        public x: number,
        public y: number,
        public buttons: number,
        public oldX = 0,
        public oldY = 0
    ) {}
}

export class MouseButtonEvent {
    constructor(
        public button: MouseButtonMapping,
        public buttonLabel: string,
        public status: boolean, // true = down, false = up
    ) {}
}

export class MouseMoveEventComponent {
    constructor(
        public dx = 0,
        public dy = 0,
    ) {}
}

const mouseComponent = new MouseComponent(0, 0, 0, 0)
const mouseEvents: MouseButtonEvent[] = []

const downHandler = (e: MouseEvent) => {
    const button = MouseButtonMapping[e.button]
    mouseComponent.buttons = e.buttons
    mouseEvents.push(new MouseButtonEvent(e.button, button, true))
}

const upHandler = (e: MouseEvent) => {
    const button = MouseButtonMapping[e.button]
    mouseComponent.buttons = e.buttons
    mouseEvents.push(new MouseButtonEvent(e.button, button, false))
}

const moveHandler = (e: MouseEvent) => {
    mouseComponent.x = e.screenX
    mouseComponent.y = e.screenY
}

enum MouseButtonMapping {
    MouseLeft,
    MouseRight,
    MouseMiddle,
    Mouse4,
    Mouse5,
}

export class MousePlugin implements IPlugin {

    build(app: IApp): void {
        window.addEventListener('mousedown', downHandler)
        window.addEventListener('mouseup', upHandler)
        window.addEventListener('mousemove', moveHandler)

        app.addSystem(WorldPeriods.BeforeEvent, this.updateMouseEvent)
            .addSystem(WorldPeriods.BeforeEvent, this.updateMousePosition)
            .world.globalComponents
            .set(MouseComponent, mouseComponent)
    }

    updateMouseEvent(
        @Slot(EventWriter) writer: EventWriter
    ) {
        mouseEvents.splice(0, mouseEvents.length).forEach(ev => {
            writer.write('mousebutton', ev)
            writer.write(ev.buttonLabel, ev.status)
        })
    }

    updateMousePosition(
        @Slot(MouseMoveEventComponent) move: MouseMoveEventComponent
    ) {
        const { oldX, oldY, x, y } = mouseComponent
        
        move.dx = x - oldX
        move.dy = y - oldY

        mouseComponent.oldX = x
        mouseComponent.oldY = y
    }

}