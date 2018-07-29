import {init} from './'
import createUI from './create-ui'
import bleep from './bleep'

export default function sequencer (audioContext) {
  function schedule (beatNumber, time) {
    bleep(audioContext, beatNumber, time)
  }

  const metronome = init(audioContext, schedule)

  createUI(metronome)
}
