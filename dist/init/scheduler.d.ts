import { IScheduler, ISchedulerRun, IWorld, WorldPeriods } from './types.js';
export declare class Scheduler implements IScheduler {
    #private;
    run: ISchedulerRun;
    constructor(run: ISchedulerRun);
    static create(): Scheduler;
    static looper(timeout: number): Scheduler;
    tick(world: IWorld, period: WorldPeriods): Promise<void>;
}
