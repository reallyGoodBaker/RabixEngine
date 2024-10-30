import { App } from "../../init/app.js";
import { Scheduler } from "../../init/scheduler.js";
import { defaultPlugins, physicsPlugins } from "../../plugins/index.js";
import { Renderer2DPlugin } from "../../plugins/renderer/2d.js";
import { ClientPlayerPlugin } from "./player.js";
import { InputTransformPlugin } from "./input-transform.js";
class Fireable {
}
function createApp() {
    const app = App.create({
        plugins: new Set([
            ...defaultPlugins,
            new InputTransformPlugin(),
            new Renderer2DPlugin(),
            ...physicsPlugins,
            new ClientPlayerPlugin(),
        ])
    });
    app.setScheduler(Scheduler.looper(16.67));
    return app;
}
createApp().run();
