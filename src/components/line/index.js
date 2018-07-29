import ToggleBtn from '../toggle-btn'
import array from 'usfl/array/array'
import {toggleStep} from '../../actions'
import {
  Object3D
} from 'three'

export function createLine ({
  dispatch,
  sound,
  container
}) {
  const holder = new Object3D()
  container.add(holder)

  // holder.position.z = 2;

  const toggles = array(16).map(n => {
    const toggle = new ToggleBtn({
      color: 0x00ff00,
      cb: () => dispatch(toggleStep(n, sound))
    })
    holder.add(toggle)
    return toggle
  })

  const incrX = 1
  toggles.map((toggle, x) => toggle.position.set(x * incrX, 0, 0))

  function update (currentStep) {
    // toggles[currentStep].tick(true);
  }

  function updatePattern (steps) {
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
