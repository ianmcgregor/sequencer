import {WebGLRenderer, Scene, Object3D, PerspectiveCamera, DirectionalLight, AmbientLight} from 'three'
import Controls from './controls'

export default function World ({
  el = document.body,
  fov = 70,
  bgColor = 0x333333,
  width = window.innerWidth,
  height = window.innerHeight
} = {}) {
  const renderer = new WebGLRenderer({antiAlias: true})
  renderer.setClearColor(bgColor)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  el.appendChild(renderer.domElement)

  const scene = new Scene()
  const container = new Object3D()
  scene.add(container)

  const camera = new PerspectiveCamera(fov, width / height)
  camera.position.set(0, 5, 10)
  camera.lookAt(container.position)

  let light = new DirectionalLight(0xFFFFFF, 0.2)
  light.position.set(1, 10, 1)
  light.castShadow = true
  light.shadow.bias = 0.0001

  light.shadow.camera.near = 0
  light.shadow.camera.far = 20
  light.shadow.camera.left = -10
  light.shadow.camera.right = 10
  light.shadow.camera.top = 10
  light.shadow.camera.bottom = -10
  light.shadow.mapSize.width = 1024
  light.shadow.mapSize.height = 1024
  container.add(light)

  light = new AmbientLight(0x999999)
  container.add(light)

  const controls = new Controls({
    container,
    scene,
    camera
  })

  function render () {
    controls.update()
    renderer.render(scene, camera)
  }

  function resize (w = window.innerWidth, h = window.innerHeight) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }

  function setClearColor (value) {
    renderer.setClearColor(value)
  }

  return {
    container,
    controls,
    scene,
    camera,
    renderer,
    render,
    resize,
    setClearColor,
    get width () {
      return renderer.domElement.width
    },
    get height () {
      return renderer.domElement.height
    },
    get dpr () {
      return window.devicePixelRatio || 1
    }
  }
}
