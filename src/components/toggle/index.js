import {
  Object3D,
  Mesh,
  BoxBufferGeometry,
  CylinderBufferGeometry,
  SphereBufferGeometry,
  MeshLambertMaterial
} from 'three'

import Color from 'color'
import {createText} from '../text'

export default class Toggle extends Object3D {
  constructor ({
    color = 0x00ff00,
    label = '0',
    cb = () => {},
    scale = 0.5
  } = {}) {
    super()

    const base = new Mesh(
      new BoxBufferGeometry(1.5 * scale, 0.2, 1.5 * scale),
      new MeshLambertMaterial({color: new Color(color).darken(0.1).rgbNumber()})
    )
    base.position.set(0, 0.2, 0)
    this.add(base)

    const btn = new Mesh(
      new CylinderBufferGeometry(0.6 * scale, 0.6 * scale, 0.4, 32),
      new MeshLambertMaterial({color})
    )
    btn.position.set(0, 0.4, 0)
    this.add(btn)

    const led = new Mesh(
      new SphereBufferGeometry(0.2, 32, 32),
      new MeshLambertMaterial({color: 0xff0000})
    )
    led.position.set(0, 0.1, 1)
    this.add(led)

    const num = createText(label, 0x333333, 0.01)
    num.rotation.x = -Math.PI / 2
    num.position.y = 0.65
    num.position.z = 0.2
    this.add(num)

    this.num = num
    this.led = led
    this.btn = btn
    this.cb = cb
  }

  onMouseDown () {
    this.btn.position.y = 0.4 - 0.275
    this.num.position.y = 0.65 - 0.275
    this.cb()
  }

  onMouseUp () {
    this.btn.position.y = 0.4
    this.num.position.y = 0.65
  }

  resetColor = () => {
    this.led.material.color.set(this.isOn ? 0x00ff00 : 0xcccccc)
  }

  toggle (isOn) {
    this.isOn = isOn
    this.resetColor()
  }

  tick () {
    this.led.material.color.set(0xff0000)

    setTimeout(this.resetColor, 100)
  }
}
