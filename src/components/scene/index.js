import BPM from '../bpm'
import {observeInteractions} from '../interaction'
import {
  DoubleSide,
  MeshLambertMaterial,
  Mesh,
  BoxBufferGeometry,
  Object3D
} from 'three'
import {createPattern} from '../pattern'
import {createLines} from '../lines'
import {createSoundToggles} from '../sounds'
import PlayButton from '../play-button'
import {changeTempo, togglePlay} from '../../actions'

export function createScene ({
  world,
  dispatch,
  tempo,
  sounds
}) {
  const soundsHolder = new Object3D()
  world.container.add(soundsHolder)
  soundsHolder.position.set(-3, 0, -4)

  const toggleHolder = new Object3D()
  world.container.add(toggleHolder)

  const holder = new Object3D()
  world.container.add(holder)

  const linesHolder = new Object3D()
  world.container.add(linesHolder)

  toggleHolder.position.z = 2
  // holder.position.z = -8;

  const baseDepth = 1
  const base = new Mesh(
    new BoxBufferGeometry(25, 15, baseDepth),
    new MeshLambertMaterial({
      color: 0xdddddd,
      side: DoubleSide
    })
  )
  base.rotation.set(Math.PI * 0.5, 0, 0)
  base.position.set(0, 0 - baseDepth / 2, 0)
  base.receiveShadow = true
  world.container.add(base)

  // const cube = new Mesh(
  //     new BoxGeometry(1, 1, 1),
  //     new MeshLambertMaterial({
  //         // map: texture,
  //         color: 0xffff00
  //     })
  // );
  // cube.position.set(0, 1, -4.5);
  // cube.castShadow = true;
  // holder.add(cube);

  const soundToggles = createSoundToggles({
    dispatch,
    world,
    sounds
  })
  soundToggles.holder.position.set(-3, 0, -4)
  soundToggles.holder.visible = false

  const pattern = createPattern({
    dispatch,
    world
  })
  pattern.holder.position.set(0, 0, 2)
  pattern.holder.visible = false

  const lines = createLines({
    dispatch,
    sounds,
    container: linesHolder
  })

  const bpm = new BPM({
    tempo,
    cb: value => dispatch(changeTempo(value))
  })
  bpm.position.set(-10, 0, -4)
  holder.add(bpm)

  const playBtn = new PlayButton({
    cb: () => dispatch(togglePlay())
  })
  playBtn.position.set(-10, 0, 5)
  holder.add(playBtn)

  observeInteractions({
    camera: world.camera,
    objects: [
      bpm.track,
      playBtn.btn,
      ...pattern.toggles.map(t => t.btn),
      ...soundToggles.toggles.map(t => t.btn),
      ...lines.toggles.map(t => t.btn)
    ]
  })

  function update (currentStep) {
    pattern.update(currentStep)
    playBtn.update(currentStep)
    lines.update(currentStep)

    if (currentStep % 4 === 0) {
      bpm.tick()
    }
    // cube.rotation.y += 0.01;
    // counter.rotation.y += 0.01;
    // base.rotation.y += 0.01;
    // counterA.position.y = 2 + Math.sin(counter * 2) * 0.1;
    // counterA.rotation.z = Math.cos(counter * 1) * 0.2;

    // counter += 0.03;
  }

  function updatePattern (steps, sound) {
    pattern.updatePattern(steps)
    lines.updatePattern(steps, sound)
  }

  function updateSound (sound) {
    soundToggles.updateSound(sound)
  }

  return {
    bpm,
    update,
    updatePattern,
    updateSound
  }
}
