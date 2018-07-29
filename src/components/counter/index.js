import {
  Object3D,
  Mesh,
  DoubleSide,
  RawShaderMaterial,
  TextureLoader
} from 'three'

import createGeometry from 'three-bmfont-text'
import loadFont from 'load-bmfont'
import MSDFShader from 'three-bmfont-text/shaders/msdf'

function load (opt, cb) {
  loadFont(opt.font, (err, font) => {
    if (err) {
      throw err
    }
    const loader = new TextureLoader()
    loader.load(opt.image, texture => cb(font, texture), () => {}, error => console.error(error))
  })
}

export default class Counter extends Object3D {
  constructor ({
    label = '',
    color = 0xc0ffee
  } = {}) {
    super()

    this._value = 0

    load({
      font: 'font/Roboto-msdf.json',
      image: 'font/Roboto-msdf.png'
    }, (font, texture) => {
      const geom = createGeometry({
        text: `${label} ${String(this._value)}`.trim(),
        font: font,
        align: 'center',
        flipY: texture.flipY
      })

      const material = new RawShaderMaterial(MSDFShader({
        map: texture,
        transparent: true,
        color: color,
        side: DoubleSide
      }))

      const layout = geom.layout
      const text = new Mesh(geom, material)
      text.position.set(0 - layout.width / 2, 0 - layout.descender + layout.height - 1, 0)

      const anchor = new Object3D()
      anchor.add(text)
      anchor.rotation.set(0, Math.PI, Math.PI)
      anchor.scale.multiplyScalar(0.02)

      this.add(anchor)

      this.material = material
      this.text = text
      this.geom = geom
      this._label = label
    })
  }

  update (num) {
    this._value = num

    if (!this.geom) {
      return
    }
    // this.material.uniforms.color.value.setHex(color);
    // const value = '' + Math.round(Math.random() * 100);
    // this.geom.update(value);
    this.geom.update(`${this._label} ${String(this._value)}`.trim())
    const layout = this.geom.layout
    this.text.position.set(0 - layout.width / 2, 0 - layout.descender + layout.height - 1, 0)
  }
}
