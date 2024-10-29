import { ISchedulerRunner, RunnerLabel } from "./types.js"

export const defaultLocalRunner: ISchedulerRunner = (executor, ...components) => executor.apply(undefined, components)

export const defaultRemoteRunner: ISchedulerRunner = (executor, ...components) => {
    const worker = RemoteExecutor.getWorker(executor)

    worker.onmessage = e => {
        const data = e.data
        components.forEach((c: any, i) => {
            for (const k in c) {
                c[k] = data[i][k]
            }
        })
    }

    worker.postMessage(components)
}

class RemoteExecutor {
    static scripts = new WeakMap<Function, string>()
    static workers = new WeakMap<Function, Worker>()

    static createScriptUrl(func: Function) {
        const script = `self.addEventListener('message', e => {let data;(function ${func.toString()})(...(data=e.data));self.postMessage(data)})`
        const url = URL.createObjectURL(new Blob([script]))

        this.scripts.set(func, url)
        return url
    }

    static getScriptUrl(func: Function) {
        return this.scripts.get(func) || this.createScriptUrl(func)
    }

    static createWorker(func: Function) {
        const url = this.getScriptUrl(func)
        const worker = new Worker(url)

        this.workers.set(func, worker)
        return worker
    }

    static getWorker(func: Function) {
        return this.workers.get(func) || this.createWorker(func)
    }
}

export const Runner = {
    [RunnerLabel.Local]: defaultLocalRunner,
    [RunnerLabel.Remote]: defaultRemoteRunner,
}