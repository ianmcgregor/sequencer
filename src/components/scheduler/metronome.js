import createTimer from './create-timer'

let audioContext = null
let schedule = null
let isPlaying = false
// What note is currently last scheduled?
let current16thStep = 0
// tempo (in beats per minute)
let tempo = 0
let timePer16thStep = 0
// How frequently to call scheduling function (in milliseconds)
// const lookahead = 25.0;
// How frequently to call scheduling function (sec)
const lookahead = 0.025
// How far ahead to schedule audio (sec) This overlaps with next interval in case the timer is late
const scheduleAheadTime = lookahead * 4
// when the next note is due.
let nextStepTime = 0.0
// 0 == 16th, 1 == 8th, 2 == quarter note
// const noteResolution = 0;
// the notes that have been put into the web audio, and may or may not have played yet. {note, time}
const notesInQueue = []
let lastStep = -1
let timer = null

function setTempo (value) {
  tempo = value
  timePer16thStep = 60.0 / tempo / 4
}

function nextStep () {
  // Advance current note and time by a 16th note...
  // Notice this picks up the current tempo value to calculate beat length.
  // const secondsPerBeat = 60.0 / tempo;
  // Add beat length to last beat time
  // nextStepTime += 0.25 * secondsPerBeat;
  // nextStepTime += secondsPerBeat / 4;
  nextStepTime += timePer16thStep

  // Advance the beat number, wrap to zero
  current16thStep++
  if (current16thStep === 16) {
    current16thStep = 0
  }
}

function scheduleStep (beatNumber, time) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push({note: beatNumber, time: time})

  // if (noteResolution === 1 && beatNumber % 2) {
  //     // we're not playing non-8th 16th notes
  //     return;
  // }
  // if (noteResolution === 2 && beatNumber % 4) {
  //     // we're not playing non-quarter 8th notes
  //     return;
  // }

  schedule(beatNumber, time)
}

function scheduler () {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextStepTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleStep(current16thStep, nextStepTime)
    nextStep()
  }
}

export function play () {
  if (isPlaying) {
    return
  }
  isPlaying = true
  current16thStep = 0
  nextStepTime = audioContext.currentTime
  timer.postMessage('start')
}

export function stop () {
  if (!isPlaying) {
    return
  }
  isPlaying = false
  timer.postMessage('stop')
}

function getCurrentStep () {
  let currentStep = lastStep

  const currentTime = audioContext.currentTime

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    currentStep = notesInQueue[0].note
    notesInQueue.shift()
  }

  lastStep = currentStep

  return currentStep
}

export function init (context, cb) {
  console.log('init')
  audioContext = context
  schedule = cb

  setTempo(60)

  timer = createTimer()

  timer.onmessage = ({data}) => {
    if (data === 'tick') {
      // console.log('tick!');
      scheduler()
    } else {
      console.log('message: ' + data)
    }
  }
  timer.postMessage({interval: lookahead})

  return {
    play,
    stop,
    getCurrentStep,
    getPlaying: () => isPlaying,
    getCurrentTime: () => audioContext.currentTime,
    get currentStep () {
      return getCurrentStep()
    },
    get currentTime () {
      return audioContext.currentTime
    },
    get playing () {
      return isPlaying
    },
    get bpm () {
      return tempo
    },
    set bpm (value) {
      setTempo(value)
    }
  }
}
