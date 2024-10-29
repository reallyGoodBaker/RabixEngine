import { Global, Slot } from "../../init/systems.js"
import { IApp, IPlugin, WorldPeriods } from "../../init/types.js"
import { EventWriter } from "../core/events.js"

@Global
export class KeyboardComponent {
    constructor(
        public keyPressed: Set<string> = new Set(),
    ) {}
}

export class KeyboardEventComponent {
    constructor(
        public press = '',
        public release = '',
    ) {}
}

const keyboard = new KeyboardComponent()
const keyboardEvents: KeyboardEventComponent[] = []

export class keyboardPlugin implements IPlugin {

    build(app: IApp): void {
        app.addSystem(WorldPeriods.BeforeEvent, this.updateKeyEvent)
            .world.globalComponents
            .set(KeyboardComponent, keyboard)

        window.addEventListener('keydown', e => {
            keyboard.keyPressed.add(e.code)
            keyboardEvents.push(new KeyboardEventComponent(e.code))
        })

        window.addEventListener('keyup', e => {
            keyboard.keyPressed.delete(e.code)
            keyboardEvents.push(new KeyboardEventComponent(undefined, e.code))
        })
    }

    updateKeyEvent(
        @Slot(EventWriter) writer: EventWriter,
    ) {
        if (!keyboardEvents.length) {
            return
        }

        keyboardEvents.splice(0, keyboardEvents.length).forEach(ev => {
            if (ev.press) {
                writer.write('keydown', ev)
            }

            if (ev.release) {
                writer.write('keyup', ev)
            }
        })
    }

}