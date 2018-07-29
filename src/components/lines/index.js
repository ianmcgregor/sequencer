import {createLine} from '../line'
import {createText} from '../text'
import array from 'usfl/array/array'
import Led from '../led'

export const createLines = ({
  dispatch,
  sounds,
  container
}) => {
  const lines = sounds.map(sound => createLine({
    dispatch,
    sound,
    container
  }))

  array(16).map(i => {
    const num = createText(String(i + 1), 0x333333, 0.01)
    num.rotation.x = -Math.PI / 2
    num.position.x = i
    num.position.y = 0.65
    num.position.z = -0.8
    container.add(num)
  })

  const leds = array(16).map(i => {
    const led = new Led()
    led.position.x = i
    led.position.z = -2
    container.add(led)
    return led
  })

  container.position.set(-8, 0, 0)

  lines.map((line, i) => line.holder.position.set(0, 0, i))

  const toggles = lines.reduce((arr, line) => arr.concat(line.toggles), [])

  function update (currentStep) {
    lines.map(line => line.update(currentStep))
    leds[currentStep].flash()
  }

  function updatePattern (steps, sound) {
    console.log('updatePattern', sound)
    const index = sounds.indexOf(sound)
    lines[index].updatePattern(steps)
    // lines.map(line => line.updatePattern(steps));
  }

  return {
    toggles,
    update,
    updatePattern
  }
}
