import Button from '../button'
import Counter from '../counter'

import {
  Object3D
} from 'three'

export default class PlayButton extends Object3D {
  constructor ({
    cb = () => {}
  } = {}) {
    super()

    const button = new Button({
      color: 0xff2200,
      cb: () => cb()
    })
    button.position.set(0, 0, 0)
    this.add(button)

    const counter = new Counter({
      label: 'STEP',
      color: 0x111111
    })
    counter.position.set(0, 0.5, -2)
    counter.rotation.x = -0.2
    this.add(counter)
    this.counter = counter

    this.btn = button.btn
  }

  update (num) {
    this.counter.update(num + 1)
  }
}
