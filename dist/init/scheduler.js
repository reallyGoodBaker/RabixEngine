import { ParameterImplementor } from "./parameter.js";
import { Runner } from "./runner.js";
import { WorldPeriods } from './types.js';
async function defaultRun(world) {
    await this.tick(world, WorldPeriods.Init);
    const loop = async () => {
        requestAnimationFrame(loop);
        await this.tick(world, WorldPeriods.BeforeEvent);
        await this.tick(world, WorldPeriods.Event);
        await this.tick(world, WorldPeriods.BeforeUpdate);
        await this.tick(world, WorldPeriods.Update);
        await this.tick(world, WorldPeriods.AfterUpdate);
    };
    await loop();
}
function looperBuilder(timeout) {
    return async function (world) {
        await this.tick(world, WorldPeriods.Init);
        const loop = async () => {
            await this.tick(world, WorldPeriods.BeforeEvent);
            await this.tick(world, WorldPeriods.Event);
            await this.tick(world, WorldPeriods.BeforeUpdate);
            await this.tick(world, WorldPeriods.Update);
            await this.tick(world, WorldPeriods.AfterUpdate);
            setTimeout(loop, timeout);
        };
        await loop();
    };
}
export class Scheduler {
    run;
    constructor(run) {
        this.run = run;
    }
    static create() {
        return new Scheduler(defaultRun);
    }
    static looper(timeout) {
        return new Scheduler(looperBuilder(timeout));
    }
    async tick(world, period) {
        const { systems } = world;
        await Promise.allSettled(Array.from(systems.entries(period)).map(record => this.#handleSystemRecord(record, world)));
    }
    async #handleSystemRecord({ system, components, runner }, world) {
        if (!world.entities.size) {
            const impl = new ParameterImplementor(components);
            if (impl.match(world)) {
                await impl.invoke((...args) => Runner[runner](system, ...args));
            }
        }
        for (const entity of world.entities) {
            const impl = new ParameterImplementor(components);
            if (impl.match(world, entity)) {
                await impl.invoke((...args) => Runner[runner](system, ...args));
            }
        }
    }
}
