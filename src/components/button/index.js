import {
  Object3D,
  Mesh,
  CylinderBufferGeometry,
  MeshLambertMaterial
} from 'three'

import Color from 'color'

export default class Button extends Object3D {
  constructor ({
    color = 0x00ff00,
    cb = () => {}
  } = {}) {
    super()

    const base = new Mesh(
      new CylinderBufferGeometry(1.5, 1.5, 0.25, 32),
      new MeshLambertMaterial({color: new Color(color).darken(0.1).rgbNumber()})
    )
    base.position.set(0, 0.125, 0)
    this.add(base)

    const btn = new Mesh(
      new CylinderBufferGeometry(1, 1, 0.65, 32),
      new MeshLambertMaterial({color})
    )
    btn.position.set(0, 0.375, 0)
    this.add(btn)

    this.btn = btn
    this.cb = cb
  }

  onMouseDown () {
    this.btn.position.y = 0.125
    this.cb()
  }

  onMouseUp () {
    this.btn.position.y = 0.375
  }
}
