import Fader from '../fader'
// import Button from '../button';
import Counter from '../counter'

import {
  Mesh,
  MeshLambertMaterial,
  Object3D,
  SphereBufferGeometry
} from 'three'

const min = 1
const max = 200

export default class BPM extends Object3D {
  constructor ({
    tempo = 60,
    cb = () => {}
  } = {}) {
    super()

    const fader = new Fader({
      color: 0xff2200,
      cb: value => {
        const bpm = Math.max(min, Math.round(value * max))
        counter.update(bpm)
        cb(bpm)
      }
    })
    fader.position.set(0, 0, 2)
    this.add(fader)
    fader.value = tempo / max

    const counter = new Counter({
      label: 'BPM',
      color: 0x111111
    })
    counter.position.set(0, 0.5, -1)
    counter.rotation.x = -0.2
    this.add(counter)
    counter.update(tempo)

    const led = new Mesh(
      new SphereBufferGeometry(0.2, 32, 32),
      new MeshLambertMaterial({color: 0xcccccc})
    )
    led.position.set(0, 0.1, 4.5)
    this.add(led)

    this.led = led
    this.track = fader.track

    this.cb = cb
  }

  resetColor = () => {
    this.led.material.color.set(0xcccccc)
  }

  tick () {
    this.led.material.color.set(0x00ff00)

    setTimeout(this.resetColor, 100)
  }
}
