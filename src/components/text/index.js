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

const cache = {
  font: null,
  texture: null
}

export function loadText (opt) {
  return new Promise((resolve, reject) => {
    loadFont(opt.font, (err, font) => {
      if (err) {
        reject(err)
      }
      const loader = new TextureLoader()
      loader.load(
        opt.image,
        texture => {
          cache.font = font
          cache.texture = texture
          resolve()
        },
        () => {},
        error => reject(error)
      )
    })
  })
}

export function createText (str, color = 0xff0000, scale = 0.05) {
  const geom = createGeometry({
    text: String(str),
    font: cache.font,
    align: 'center',
    flipY: cache.texture.flipY
  })

  const material = new RawShaderMaterial(MSDFShader({
    map: cache.texture,
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
  anchor.scale.multiplyScalar(scale)

  const container = new Object3D()
  container.add(anchor)

  return container
}
