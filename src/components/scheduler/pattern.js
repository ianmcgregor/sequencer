import array from 'usfl/array/array'

export function sequencer (dispatch) {
  let elapsedSeconds = 0
  let elapsedTickSeconds = 0
  let beatNum = 0

  const bpm = 90
  const minute = 60
  const beatSeconds = minute / bpm
  const measures = 4
  const tickSeconds = beatSeconds / measures // 16th
  const bars = 4
  const numTicks = measures * bars

  const toggles = array(16)

  function update (dt) {
    elapsedSeconds += dt
    if (elapsedSeconds >= beatSeconds) {
      elapsedSeconds = 0
    }

    elapsedTickSeconds += dt
    if (elapsedTickSeconds >= tickSeconds) {
      elapsedTickSeconds = 0
      beatNum++
      if (beatNum === numTicks) {
        beatNum = 0
      }
    }
  }

  function updatePattern (steps) {
    console.log('====> updatePattern')

    for (let i = 0; i < steps.length; i++) {
      toggles[i].toggle(steps[i])
    }
  }

  return {
    update,
    updatePattern
  }
}
