import { App } from '../../init/app.js'
import { Remote, Slot } from '../../init/systems.js'
import { World } from '../../init/world.js'

const world = World.create()

class HeatComponent {
    v = 100
}

class Dt {
    constructor(
        public current = 0,
        public dt = 0,
    ) {}
}

const entity1 = 'hpbar'

world.addEntity(
    entity1,
    new HeatComponent(),
    new Dt(
        performance.now(),
        0
    ),
)

const counter = document.getElementById('counter')
const hpbar = document.getElementById('hp')
const up = document.getElementById('up')

counter!.style.cssText = 'line-height: 60px; text-align: center; font-size: 2rem'
hpbar!.style.cssText = 'width: 100px; height: 10px; background-color: cyan;'
up!.addEventListener('click', () => {
    world.getEntityComponent(entity1, HeatComponent)!.v += 50
    counter!.innerText = String(Number(counter!.innerText) + 1)
})

class MyApp extends App {
    static renderHeat(
        @Slot(HeatComponent) heat: HeatComponent
    ) {
        if (heat.v < 0) {
            hpbar!.style.width = (heat.v = 0) + 'px'
        } else if (heat.v < 700) {
            hpbar!.style.width = heat.v + 'px'
            if (heat.v < 500) {
                counter!.style.fontSize = '2rem'
                counter!.style.color = ''
                hpbar!.style.backgroundColor = 'cyan'
            } else {
                counter!.style.fontSize = '4rem'
                counter!.style.color = 'red'
                hpbar!.style.backgroundColor = 'red'
            }
        } else {
            hpbar!.style.width = (heat.v = 700) + 'px'
        }
    }

    @Remote
    static decreaseHeat(
        @Slot(HeatComponent) heat: HeatComponent
    ) {
        heat.v -= 1
    }

    static countDt(
        @Slot(Dt) dt: Dt
    ) {
        const now = performance.now()
        dt.dt = now - dt.current
        dt.current = now
    }
}

const app = MyApp
    .create({ world })
    // .setScheduler(Scheduler.looper(16.6))  //60fps
    .addSystem(MyApp.renderHeat)
    .addSystem(MyApp.decreaseHeat)
    .addSystem(MyApp.countDt)
    .run()