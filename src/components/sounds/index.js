import Toggle from '../toggle'
import {selectSound} from '../../actions'
import {
  Object3D
} from 'three'

export function createSoundToggles ({
  world,
  dispatch,
  sounds
}) {
  const holder = new Object3D()
  world.container.add(holder)
  holder.position.set(-3, 0, -4)

  const soundToggles = sounds.reduce((ob, s, i) => {
    const toggle = new Toggle({
      label: s,
      color: 0x00ff00,
      cb: () => dispatch(selectSound(s))
    })
    toggle.position.set(i * 2, 0, 0)
    holder.add(toggle)
    ob[s] = toggle
    return ob
  }, {})

  const toggles = Object.keys(soundToggles).map(s => soundToggles[s])

  function updateSound (sound) {
    toggles.map(t => t.toggle(0))
    soundToggles[sound].toggle(1)
  }

  return {
    holder,
    toggles,
    updateSound
  }
}
