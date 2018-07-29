import {
  Object3D,
  Mesh,
  BoxBufferGeometry,
  MeshLambertMaterial,
  Vector3
} from 'three'

import Color from 'color'

import map from 'usfl/math/map'
import clamp from 'usfl/math/clamp'

export default class Fader extends Object3D {
  constructor ({
    color = 0x00ff00,
    cb = () => {}
  } = {}) {
    super()

    const track = new Mesh(
      new BoxBufferGeometry(1.5, 0.2, 4),
      new MeshLambertMaterial({color: new Color(color).darken(0.1).rgbNumber()})
    )
    track.position.set(0, 0.1, 0)
    this.add(track)

    const trackHit = new Mesh(
      new BoxBufferGeometry(1.5, 0.2, 6),
      new MeshLambertMaterial({color: new Color(color).darken(1).rgbNumber()})
    )
    // trackHit.material.opacity = 0;
    // trackHit.material.transparent = true;
    trackHit.material.visible = false
    trackHit.position.set(0, 0.1, 0)
    this.add(trackHit)

    const btn = new Mesh(
      new BoxBufferGeometry(1.3, 0.4, 0.6),
      new MeshLambertMaterial({color})
    )
    btn.position.set(0, 0.3, 1.6)

    const anchor = new Object3D()
    anchor.add(track)
    anchor.add(btn)
    this.add(anchor)

    this.globalPosition = new Vector3()

    this.btn = btn
    this.track = trackHit
    this.cb = cb
  }

  set value (value) {
    const z = map(value, 0, 1, 1.6, -1.4)
    this.btn.position.z = Math.max(-1.4, Math.min(1.6, z))
  }

  onMouseDown () {
    console.log('DOWN')
    // this.btn.position.y = 0.125;
    // this.cb();
    this.isDown = true
  }

  onMouseMove (point) {
    if (!this.isDown) {
      return
    }

    this.globalPosition.setFromMatrixPosition(this.matrixWorld)
    // this.btn.position.z = map(point.z - this.globalPosition.z, -2, 2, -1.4, 1.6);
    const z = map(point.z - this.globalPosition.z, -2, 2, -1.4, 1.6)
    this.btn.position.z = Math.max(-1.4, Math.min(1.6, z))
    this.cb(clamp(map(point.z - this.globalPosition.z, -1.9, 1.9, 1, 0), 0, 1))
  }

  onMouseUp () {
    // this.btn.position.y = 0.375;
    this.isDown = false
  }
}
