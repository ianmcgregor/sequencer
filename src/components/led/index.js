import {
  Object3D,
  Mesh,
  SphereBufferGeometry,
  MeshLambertMaterial
} from 'three'

export default class Led extends Object3D {
  constructor ({
    color = 0xcccccc
  } = {}) {
    super()

    const led = new Mesh(
      new SphereBufferGeometry(0.2, 32, 32),
      new MeshLambertMaterial({color})
    )
    led.position.set(0, 0.1, 1)
    this.add(led)

    this.led = led
  }

  toggle (isOn) {
    this.isOn = isOn
    this.this.resetColor()
  }

  resetColor = () => {
    this.led.material.color.set(this.isOn ? 0x00ff00 : 0xcccccc)
  }

  flash () {
    this.led.material.color.set(0xff0000)

    setTimeout(this.resetColor, 100)
  }
}
