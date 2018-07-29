import {
  Object3D,
  Mesh,
  BoxBufferGeometry,
  CylinderBufferGeometry,
  MeshLambertMaterial
} from 'three'

import Color from 'color'

export default class ToggleBtn extends Object3D {
  constructor ({
    color = 0x00ff00,
    cb = () => {},
    scale = 0.4
  } = {}) {
    super()

    const base = new Mesh(
      new BoxBufferGeometry(1.5 * scale, 0.2, 1.5 * scale),
      new MeshLambertMaterial({color: new Color(0xcccccc).darken(0.1).rgbNumber()})
    )
    base.position.set(0, 0.2, 0)
    this.add(base)

    const btn = new Mesh(
      // new BoxBufferGeometry(1.2, 0.4, 1.2),
      new CylinderBufferGeometry(0.6 * scale, 0.6 * scale, 0.3, 32),
      new MeshLambertMaterial({color: 0xcccccc})
    )
    btn.position.set(0, 0.3, 0)
    this.add(btn)

    this.btn = btn
    this.cb = cb
  }

  onMouseDown () {
    this.btn.position.y = 0.22
    this.cb()
  }

  onMouseUp () {
    this.btn.position.y = 0.3
    if (this.isOn) {
      this.btn.position.y = 0.22
    }
  }

  toggle (isOn) {
    this.isOn = isOn
    this.btn.material.color.set(isOn ? 0x00ff00 : 0xcccccc)
  }
}
