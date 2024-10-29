import { ParameterImplementor } from "./parameter.js"
import { Runner } from "./runner.js"
import { IScheduler, ISchedulerRun, ISystemRecord, IWorld, WorldPeriods } from './types.js'

async function defaultRun(this: IScheduler, world: IWorld) {
    await this.tick(world, WorldPeriods.Init)

    const loop = async () => {
        requestAnimationFrame(loop)

        await this.tick(world, WorldPeriods.BeforeEvent)
        await this.tick(world, WorldPeriods.Event)
        await this.tick(world, WorldPeriods.BeforeUpdate)
        await this.tick(world, WorldPeriods.Update)
        await this.tick(world, WorldPeriods.AfterUpdate)
    }

    await loop()
}

function looperBuilder(timeout: number) {
    return async function(this: IScheduler, world: IWorld) {
        await this.tick(world, WorldPeriods.Init)

        const loop = async () => {
            await this.tick(world, WorldPeriods.BeforeEvent)
            await this.tick(world, WorldPeriods.Event)
            await this.tick(world, WorldPeriods.BeforeUpdate)
            await this.tick(world, WorldPeriods.Update)
            await this.tick(world, WorldPeriods.AfterUpdate)

            setTimeout(loop, timeout)
        }

        await loop()
    }
}

export class Scheduler implements IScheduler {
    
    constructor(
        public run: ISchedulerRun,
    ) {}

    static create() {
        return new Scheduler(defaultRun)
    }

    static looper(timeout: number) {
        return new Scheduler(looperBuilder(timeout))
    }

    async tick(world: IWorld, period: WorldPeriods) {
        const { systems } = world

        await Promise.allSettled(Array.from(systems.entries(period)).map(record => this.#handleSystemRecord(record, world)))
    }

    async #handleSystemRecord(
        { system, components, runner }: ISystemRecord,
        world: IWorld,
    ) {
        if (!world.entities.size) {
            const impl = new ParameterImplementor(components)
            if (impl.match(world)) {
                await impl.invoke((...args: any[]) => Runner[runner](system, ...args))
            }
        }

        for (const entity of world.entities) {
            const impl = new ParameterImplementor(components)
            if (impl.match(world, entity)) {
                await impl.invoke((...args: any[]) => Runner[runner](system, ...args))   
            }
        }
    }
    
}