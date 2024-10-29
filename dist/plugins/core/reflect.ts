import { Global } from "../../init/systems.js"
import { IApp, IPlugin, IWorld } from "../../init/types.js"

@Global
export class ReflectComponent {
    constructor(
        public app: IApp,
        public world: IWorld,
    ) {}
}

export class ReflectPlugin implements IPlugin {
    ready?: ((app: IApp) => boolean) | undefined
    destroy?: ((app: IApp) => void) | undefined
    
    build(app: IApp): void {
        app.world.globalComponents
            .set(ReflectComponent, new ReflectComponent(app, app.world))
    }
}