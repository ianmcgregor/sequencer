// length of "beep" (in seconds)
const noteLength = 0.05

export default function bleep (audioContext, beatNumber, time) {
  const osc = audioContext.createOscillator()
  osc.type = 'square'
  osc.type = 'sawtooth'
  osc.type = 'triangle'

  if (beatNumber % 16 === 0) {
    // beat 0 == high pitch
    osc.frequency.value = 880.0
  } else if (beatNumber % 4 === 0) {
    // quarter notes = medium pitch
    osc.frequency.value = 440.0
  } else {
    // other 16th notes = low pitch
    osc.frequency.value = 220.0
  }

  const gainNode = audioContext.createGain()
  gainNode.gain.value = 0
  osc.connect(gainNode)

  const env = new Envelope()
  env.connect(gainNode.gain)

  gainNode.connect(audioContext.destination)

  env.trigger(time)
  osc.start(time)
  osc.stop(time + noteLength)
}

class Envelope {
  constructor ({
    attack = 0.015,
    sustain = 0.015,
    release = 0.02
    // attack = 0.005,
    // sustain = 0.025,
    // release = 0.02
  } = {}) {
    this.attack = attack
    this.sustain = sustain
    this.release = release
  }

  trigger (time) {
    this.param.cancelScheduledValues(time)
    this.param.setValueAtTime(0, time)
    this.param.linearRampToValueAtTime(1, time + this.attack)
    this.param.linearRampToValueAtTime(1, time + this.attack + this.sustain)
    this.param.linearRampToValueAtTime(0, time + this.attack + this.sustain + this.release)
  }

  connect (gainParam) {
    this.param = gainParam
  }
}
