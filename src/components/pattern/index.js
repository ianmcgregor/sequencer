import Toggle from '../toggle'
import array from 'usfl/array/array'
import {toggleStep} from '../../actions'
import {
  Object3D
} from 'three'

function grid ({arr, cols, fn}) {
  let x = 0
  let y = 0
  arr.map((item, n) => {
    if (n > 0 && n % cols === 0) {
      x = 0
      y += 1
    }
    fn(item, x, y)
    x += 1
  })
}

export function createPattern ({
  dispatch,
  sound,
  world
}) {
  const holder = new Object3D()
  world.container.add(holder)

  holder.position.z = 2

  const toggles = array(16).map(n => {
    const toggle = new Toggle({
      label: String(n + 1),
      color: 0x00ff00,
      cb: () => dispatch(toggleStep(n, sound))
    })
    holder.add(toggle)
    return toggle
  })

  const incrX = 2
  const incrZ = 2.25
  grid({
    arr: toggles,
    cols: 4,
    fn: (toggle, x, y) => {
      toggle.position.set(
        x * incrX - incrX * 1.5,
        0,
        y * incrZ - incrZ * 1.5)
    }
  })

  function update (currentStep) {
    toggles[currentStep].tick(true)
  }

  function updatePattern (steps) {
    console.log('====> updatePattern')

    for (let i = 0; i < steps.length; i++) {
      toggles[i].toggle(steps[i])
    }
  }

  return {
    holder,
    toggles,
    update,
    updatePattern
  }
}
